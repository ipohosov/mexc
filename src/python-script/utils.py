import pandas as pd
import numpy as np
from datetime import datetime
import logging

class TradingUtils:
    @staticmethod
    def format_price(price):
        """Форматирование цены"""
        return f"{price:,.2f}"
    
    @staticmethod
    def calculate_percentage_change(old_value, new_value):
        """Расчет процентного изменения"""
        return ((new_value - old_value) / old_value) * 100
    
    @staticmethod
    def log_trade(symbol, action, price, amount, reason):
        """Логирование сделки"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        logging.info(f"[TRADE] {timestamp} - {action} {amount} {symbol} @ {price} | Причина: {reason}")
    
    @staticmethod
    def validate_signal_strength(buy_score, sell_score, min_threshold=3):
        """Валидация силы сигнала"""
        return buy_score >= min_threshold or sell_score >= min_threshold

class RiskManager:
    def __init__(self, max_risk_per_trade=0.02, max_total_risk=0.10):
        self.max_risk_per_trade = max_risk_per_trade
        self.max_total_risk = max_total_risk
    
    def calculate_position_size(self, account_balance, entry_price, stop_loss_price):
        """Расчет размера позиции на основе риска"""
        risk_amount = account_balance * self.max_risk_per_trade
        risk_per_unit = abs(entry_price - stop_loss_price)
        
        if risk_per_unit == 0:
            return 0
        
        position_size = risk_amount / risk_per_unit
        return position_size
    
    def validate_new_position(self, current_positions, new_risk):
        """Проверка возможности открытия новой позиции"""
        total_current_risk = sum(pos.get('risk', 0) for pos in current_positions.values())
        return (total_current_risk + new_risk) <= self.max_total_risk

class PerformanceTracker:
    def __init__(self):
        self.trades_history = []
        self.daily_pnl = 0
        self.total_trades = 0
        self.winning_trades = 0
    
    def add_trade(self, trade_data):
        """Добавление завершенной сделки"""
        self.trades_history.append(trade_data)
        self.total_trades += 1
        
        if trade_data.get('pnl', 0) > 0:
            self.winning_trades += 1
    
    def get_win_rate(self):
        """Расчет процента прибыльных сделок"""
        if self.total_trades == 0:
            return 0
        return (self.winning_trades / self.total_trades) * 100
    
    def get_statistics(self):
        """Получение статистики торговли"""
        return {
            'total_trades': self.total_trades,
            'winning_trades': self.winning_trades,
            'win_rate': self.get_win_rate(),
            'daily_pnl': self.daily_pnl
        }