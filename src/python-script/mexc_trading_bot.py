# MEXC Trading Bot - Trend Following Strategy
# ВАЖНО: Для работы требуется установка библиотек:
# pip install ccxt pandas numpy ta-lib requests

import ccxt
import pandas as pd
import numpy as np
import time
import json
from datetime import datetime
import logging
from config import TradingConfig

# Настройка логирования
logging.basicConfig(
    level=getattr(logging, TradingConfig.LOG_LEVEL),
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(TradingConfig.LOG_FILE),
        logging.StreamHandler()
    ]
)

class MexcTrendBot:
    def __init__(self, api_key=None, secret_key=None, sandbox=None):
        """
        Инициализация бота с параметрами из .env файла
        """
        # Использование конфигурации из .env файла
        self.api_key = api_key or TradingConfig.API_KEY
        self.secret_key = secret_key or TradingConfig.SECRET_KEY
        self.sandbox = sandbox if sandbox is not None else TradingConfig.SANDBOX_MODE
        
        # Проверка наличия API ключей
        if not self.api_key or not self.secret_key:
            raise ValueError("API ключи не найдены! Проверьте .env файл")
        
        self.exchange = ccxt.mexc({
            'apiKey': self.api_key,
            'secret': self.secret_key,
            'sandbox': self.sandbox,
            'enableRateLimit': True,
        })
        
        # Параметры стратегии
        self.risk_per_trade = TradingConfig.RISK_PER_TRADE
        self.stop_loss_pct = TradingConfig.STOP_LOSS_PCT
        self.take_profit_pct = TradingConfig.TAKE_PROFIT_PCT
        
        # Параметры индикаторов
        self.ma_short = TradingConfig.MA_SHORT_PERIOD
        self.ma_medium = TradingConfig.MA_MEDIUM_PERIOD
        self.ma_long = TradingConfig.MA_LONG_PERIOD
        self.rsi_period = TradingConfig.RSI_PERIOD
        self.rsi_oversold = TradingConfig.RSI_OVERSOLD
        self.rsi_overbought = TradingConfig.RSI_OVERBOUGHT
        
        # Торгуемые пары
        self.symbols = TradingConfig.TRADING_PAIRS
        
        # Активные позиции
        self.positions = {}
        
        logging.info(f"Бот инициализирован. Режим: {'SANDBOX' if self.sandbox else 'LIVE'}")
        logging.info(f"Торгуемые пары: {', '.join(self.symbols)}")
        
    def get_historical_data(self, symbol, timeframe=None, limit=None):
        """
        Получение исторических данных
        """
        timeframe = timeframe or TradingConfig.TIMEFRAME
        limit = limit or TradingConfig.HISTORICAL_PERIODS
        
        try:
            ohlcv = self.exchange.fetch_ohlcv(symbol, timeframe, limit=limit)
            df = pd.DataFrame(ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
            df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
            return df
        except Exception as e:
            logging.error(f"Ошибка получения данных для {symbol}: {e}")
            return None
    
    def calculate_ma(self, df, periods):
        """
        Расчет скользящих средних
        """
        return {
            f'ma_{period}': df['close'].rolling(window=period).mean().iloc[-1]
            for period in periods
        }
    
    def calculate_rsi(self, df, period=14):
        """
        Расчет RSI
        """
        delta = df['close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
        rs = gain / loss
        rsi = 100 - (100 / (1 + rs))
        return rsi.iloc[-1]
    
    def calculate_macd(self, df, fast=12, slow=26, signal=9):
        """
        Расчет MACD
        """
        ema_fast = df['close'].ewm(span=fast).mean()
        ema_slow = df['close'].ewm(span=slow).mean()
        macd_line = ema_fast - ema_slow
        signal_line = macd_line.ewm(span=signal).mean()
        histogram = macd_line - signal_line
        
        return {
            'macd': macd_line.iloc[-1],
            'signal': signal_line.iloc[-1],
            'histogram': histogram.iloc[-1]
        }
    
    def analyze_trend(self, symbol):
        """
        Анализ тренда для конкретной пары
        """
        df = self.get_historical_data(symbol)
        if df is None or len(df) < self.ma_long:
            return None
        
        current_price = df['close'].iloc[-1]
        
        # Скользящие средние
        ma_values = self.calculate_ma(df, [self.ma_short, self.ma_medium, self.ma_long])
        
        # RSI
        rsi = self.calculate_rsi(df)
        
        # MACD
        macd_data = self.calculate_macd(df)
        
        # Определение тренда
        ma_trend = "UPTREND" if (ma_values[f'ma_{self.ma_short}'] > ma_values[f'ma_{self.ma_medium}'] > ma_values[f'ma_{self.ma_long}']) else \
                  "DOWNTREND" if (ma_values[f'ma_{self.ma_short}'] < ma_values[f'ma_{self.ma_medium}'] < ma_values[f'ma_{self.ma_long}']) else \
                  "SIDEWAYS"
        
        # Сигналы на покупку/продажу
        buy_signals = [
            ma_trend == "UPTREND",
            current_price > ma_values[f'ma_{self.ma_short}'],
            rsi < 70,  # Не перекупленность
            macd_data['macd'] > macd_data['signal']  # MACD бычий сигнал
        ]
        
        sell_signals = [
            ma_trend == "DOWNTREND",
            current_price < ma_values[f'ma_{self.ma_short}'],
            rsi > 30,  # Не перепроданность
            macd_data['macd'] < macd_data['signal']  # MACD медвежий сигнал
        ]
        
        return {
            'symbol': symbol,
            'current_price': current_price,
            'trend': ma_trend,
            'ma_values': ma_values,
            'rsi': rsi,
            'macd': macd_data,
            'buy_score': sum(buy_signals),
            'sell_score': sum(sell_signals),
            'signal': 'BUY' if sum(buy_signals) >= 3 else 'SELL' if sum(sell_signals) >= 3 else 'HOLD'
        }
    
    def get_balance(self):
        """
        Получение баланса аккаунта
        """
        try:
            balance = self.exchange.fetch_balance()
            return balance
        except Exception as e:
            logging.error(f"Ошибка получения баланса: {e}")
            return None
    
    def calculate_position_size(self, symbol, entry_price):
        """
        Расчет размера позиции на основе риска
        """
        balance = self.get_balance()
        if not balance:
            return 0
        
        total_balance = balance['USDT']['free']
        risk_amount = total_balance * self.risk_per_trade
        stop_loss_price = entry_price * (1 - self.stop_loss_pct)
        risk_per_unit = abs(entry_price - stop_loss_price)
        
        position_size = risk_amount / risk_per_unit
        return position_size
    
    def place_buy_order(self, symbol, analysis):
        """
        Размещение ордера на покупку
        """
        try:
            current_price = analysis['current_price']
            position_size = self.calculate_position_size(symbol, current_price)
            
            if position_size <= 0:
                logging.warning(f"Недостаточно средств для покупки {symbol}")
                return None
            
            # Размещение рыночного ордера
            order = self.exchange.create_market_buy_order(symbol, position_size)
            
            # Размещение ордеров stop-loss и take-profit
            stop_loss_price = current_price * (1 - self.stop_loss_pct)
            take_profit_price = current_price * (1 + self.take_profit_pct)
            
            stop_order = self.exchange.create_order(
                symbol, 'market', 'sell', position_size, None,
                None, None, {'stopPrice': stop_loss_price}
            )
            
            limit_order = self.exchange.create_limit_sell_order(
                symbol, position_size, take_profit_price
            )
            
            # Сохранение информации о позиции
            self.positions[symbol] = {
                'entry_order': order,
                'stop_order': stop_order,
                'limit_order': limit_order,
                'entry_price': current_price,
                'stop_loss': stop_loss_price,
                'take_profit': take_profit_price,
                'size': position_size,
                'timestamp': datetime.now()
            }
            
            logging.info(f"Покупка {symbol}: {position_size} по цене {current_price}")
            return order
            
        except Exception as e:
            logging.error(f"Ошибка размещения ордера на покупку {symbol}: {e}")
            return None
    
    def place_sell_order(self, symbol):
        """
        Размещение ордера на продажу (закрытие позиции)
        """
        try:
            if symbol not in self.positions:
                logging.warning(f"Нет открытой позиции для {symbol}")
                return None
            
            position = self.positions[symbol]
            
            # Отмена существующих ордеров
            try:
                self.exchange.cancel_order(position['stop_order']['id'], symbol)
                self.exchange.cancel_order(position['limit_order']['id'], symbol)
            except:
                pass
            
            # Размещение рыночного ордера на продажу
            order = self.exchange.create_market_sell_order(symbol, position['size'])
            
            logging.info(f"Продажа {symbol}: {position['size']}")
            del self.positions[symbol]
            return order
            
        except Exception as e:
            logging.error(f"Ошибка размещения ордера на продажу {symbol}: {e}")
            return None
    
    def check_and_execute_strategy(self):
        """
        Проверка сигналов и выполнение стратегии
        """
        for symbol in self.symbols:
            try:
                analysis = self.analyze_trend(symbol)
                if not analysis:
                    continue
                
                signal = analysis['signal']
                logging.info(f"{symbol}: Цена={analysis['current_price']:.2f}, Тренд={analysis['trend']}, Сигнал={signal}")
                
                # Логика торговли
                if signal == 'BUY' and symbol not in self.positions:
                    # Дополнительная проверка RSI для избежания покупки в перекупленности
                    if analysis['rsi'] < self.rsi_overbought:
                        self.place_buy_order(symbol, analysis)
                
                elif signal == 'SELL' and symbol in self.positions:
                    # Дополнительная проверка RSI для избежания продажи в перепроданности
                    if analysis['rsi'] > self.rsi_oversold:
                        self.place_sell_order(symbol)
                
            except Exception as e:
                logging.error(f"Ошибка анализа {symbol}: {e}")
    
    def monitor_positions(self):
        """
        Мониторинг открытых позиций
        """
        for symbol, position in list(self.positions.items()):
            try:
                current_price = self.exchange.fetch_ticker(symbol)['last']
                entry_price = position['entry_price']
                
                # Проверка времени удержания позиции
                hold_time = datetime.now() - position['timestamp']
                
                # Логирование статуса позиции
                pnl_pct = ((current_price - entry_price) / entry_price) * 100
                logging.info(f"Позиция {symbol}: P&L={pnl_pct:.2f}%, Время={hold_time}")
                
            except Exception as e:
                logging.error(f"Ошибка мониторинга позиции {symbol}: {e}")
    
    def run_bot(self):
        """
        Основной цикл работы бота
        """
        logging.info("Запуск торгового бота...")
        
        while True:
            try:
                # Проверка и выполнение стратегии
                self.check_and_execute_strategy()
                
                # Мониторинг позиций
                self.monitor_positions()
                
                # Вывод статистики портфеля
                balance = self.get_balance()
                if balance:
                    usdt_balance = balance.get('USDT', {}).get('free', 0)
                    logging.info(f"Баланс USDT: {usdt_balance:.2f}")
                
                # Пауза между итерациями
                time.sleep(TradingConfig.CHECK_INTERVAL)
                
            except KeyboardInterrupt:
                logging.info("Остановка бота...")
                break
            except Exception as e:
                logging.error(f"Ошибка в основном цикле: {e}")
                time.sleep(30)

# Класс для backtesting стратегии
class BacktestEngine:
    def __init__(self, initial_capital=10000):
        self.initial_capital = initial_capital
        self.capital = initial_capital
        self.trades = []
        
    def backtest_strategy(self, symbol, days=30):
        """
        Бэктестинг стратегии на исторических данных
        """
        # Здесь будет код для тестирования стратегии на исторических данных
        # Для полной реализации потребуется больше кода
        pass

# Пример использования
if __name__ == "__main__":
    try:
        # Создание и запуск бота (API ключи читаются из .env файла)
        bot = MexcTrendBot()
        
        # Проверка подключения
        balance = bot.get_balance()
        if balance:
            logging.info("Подключение к MEXC успешно!")
            logging.info(f"Режим: {'SANDBOX' if bot.sandbox else 'LIVE TRADING'}")
        else:
            logging.error("Ошибка подключения к MEXC")
            exit(1)
        
        # Запуск бота (раскомментируйте для реального использования)
        # bot.run_bot()
        
        print("\n" + "="*50)
        print("MEXC Trading Bot готов к работе!")
        print("="*50)
        print("Для запуска:")
        print("1. Настройте .env файл с вашими API ключами")
        print("2. Установите зависимости: pip install -r requirements.txt")
        print("3. Протестируйте на sandbox среде")
        print("4. Раскомментируйте bot.run_bot() для автоматической торговли")
        print("="*50)
        
    except ValueError as e:
        logging.error(f"Ошибка конфигурации: {e}")
        print("\nСоздайте .env файл на основе .env.example и укажите ваши API ключи MEXC")
    except Exception as e:
        logging.error(f"Ошибка инициализации бота: {e}")

    
    # Создание и запуск бота
    bot = MexcTrendBot(API_KEY, SECRET_KEY, sandbox=True)
    
    # Запуск бота (раскомментируйте для реального использования)
    # bot.run_bot()
    
    print("Пример скрипта загружен. Для реального использования:")
    print("1. Установите библиотеки: pip install ccxt pandas numpy ta-lib")
    print("2. Получите API ключи от MEXC")
    print("3. Замените API_KEY и SECRET_KEY на настоящие")
    print("4. Протестируйте на sandbox среде")
    print("5. Запустите bot.run_bot() для автоматической торговли")