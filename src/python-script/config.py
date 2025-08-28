import os
from dotenv import load_dotenv

# Загрузка переменных окружения
load_dotenv()

# Конфигурация торгового бота

class TradingConfig:
    # API настройки MEXC (из .env файла)
    API_KEY = os.getenv('MEXC_API_KEY')
    SECRET_KEY = os.getenv('MEXC_SECRET_KEY')
    SANDBOX_MODE = os.getenv('SANDBOX_MODE', 'true').lower() == 'true'
    
    # Параметры управления рисками
    RISK_PER_TRADE = float(os.getenv('RISK_PER_TRADE', '0.02'))
    STOP_LOSS_PCT = float(os.getenv('STOP_LOSS_PCT', '0.05'))
    TAKE_PROFIT_PCT = float(os.getenv('TAKE_PROFIT_PCT', '0.10'))
    MAX_OPEN_POSITIONS = int(os.getenv('MAX_OPEN_POSITIONS', '5'))
    
    # Параметры технических индикаторов
    MA_SHORT_PERIOD = int(os.getenv('MA_SHORT_PERIOD', '7'))
    MA_MEDIUM_PERIOD = int(os.getenv('MA_MEDIUM_PERIOD', '25'))
    MA_LONG_PERIOD = int(os.getenv('MA_LONG_PERIOD', '50'))
    RSI_PERIOD = int(os.getenv('RSI_PERIOD', '14'))
    RSI_OVERSOLD = int(os.getenv('RSI_OVERSOLD', '30'))
    RSI_OVERBOUGHT = int(os.getenv('RSI_OVERBOUGHT', '70'))
    MACD_FAST = int(os.getenv('MACD_FAST', '12'))
    MACD_SLOW = int(os.getenv('MACD_SLOW', '26'))
    MACD_SIGNAL = int(os.getenv('MACD_SIGNAL', '9'))
    
    # Торгуемые пары
    TRADING_PAIRS = os.getenv('TRADING_PAIRS', 'BTC/USDT,ETH/USDT,BNB/USDT,ADA/USDT,SOL/USDT,XRP/USDT').split(',')
    
    # Настройки времени
    TIMEFRAME = os.getenv('TIMEFRAME', '1h')
    CHECK_INTERVAL = int(os.getenv('CHECK_INTERVAL', '60'))
    HISTORICAL_PERIODS = int(os.getenv('HISTORICAL_PERIODS', '100'))
    
    # Настройки логирования
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    LOG_FILE = os.getenv('LOG_FILE', 'trading_bot.log')
    
    @classmethod
    def validate_config(cls):
        """Проверка корректности конфигурации"""
        if not cls.API_KEY or not cls.SECRET_KEY:
            raise ValueError("API_KEY и SECRET_KEY должны быть указаны в .env файле")
        
        if cls.API_KEY == "your_mexc_api_key_here":
            raise ValueError("Замените API_KEY в .env файле на настоящий ключ")
        
        if cls.SECRET_KEY == "your_mexc_secret_key_here":
            raise ValueError("Замените SECRET_KEY в .env файле на настоящий ключ")
        
        return True