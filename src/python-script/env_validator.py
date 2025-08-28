#!/usr/bin/env python3
"""
Валидатор конфигурации .env файла
Запустите этот скрипт для проверки корректности настроек
"""

import os
from dotenv import load_dotenv
import sys

def validate_env_file():
    """Проверка .env файла на корректность"""
    
    # Загрузка .env файла
    if not os.path.exists('.env'):
        print("❌ Файл .env не найден!")
        print("📝 Создайте .env файл на основе .env.example:")
        print("   cp .env.example .env")
        return False
    
    load_dotenv()
    
    print("🔍 Проверка конфигурации...")
    print("-" * 40)
    
    errors = []
    warnings = []
    
    # Проверка обязательных параметров
    required_vars = {
        'MEXC_API_KEY': 'API ключ MEXC',
        'MEXC_SECRET_KEY': 'Секретный ключ MEXC'
    }
    
    for var, description in required_vars.items():
        value = os.getenv(var)
        if not value:
            errors.append(f"❌ {var} не установлен ({description})")
        elif value in ['your_mexc_api_key_here', 'your_mexc_secret_key_here']:
            errors.append(f"❌ {var} содержит значение по умолчанию")
        else:
            print(f"✅ {var}: {'*' * 8}{value[-4:]} ({description})")
    
    # Проверка опциональных параметров
    optional_vars = {
        'SANDBOX_MODE': ('true', 'Режим песочницы'),
        'RISK_PER_TRADE': ('0.02', 'Риск на сделку'),
        'STOP_LOSS_PCT': ('0.05', 'Stop-Loss %'),
        'TAKE_PROFIT_PCT': ('0.10', 'Take-Profit %'),
        'TRADING_PAIRS': ('BTC/USDT,ETH/USDT', 'Торгуемые пары')
    }
    
    for var, (default, description) in optional_vars.items():
        value = os.getenv(var, default)
        print(f"📋 {var}: {value} ({description})")
    
    # Проверка числовых значений
    numeric_vars = ['RISK_PER_TRADE', 'STOP_LOSS_PCT', 'TAKE_PROFIT_PCT']
    for var in numeric_vars:
        try:
            value = float(os.getenv(var, '0'))
            if value <= 0 or value > 1:
                warnings.append(f"⚠️  {var} = {value} (рекомендуется 0.01-0.20)")
        except ValueError:
            errors.append(f"❌ {var} должен быть числом")
    
    # Проверка торгуемых пар
    pairs = os.getenv('TRADING_PAIRS', '').split(',')
    valid_pairs = [pair.strip() for pair in pairs if '/' in pair]
    if len(valid_pairs) == 0:
        errors.append("❌ Не указаны корректные торгуемые пары")
    else:
        print(f"📈 Торгуемые пары: {len(valid_pairs)} шт.")
    
    print("-" * 40)
    
    # Вывод результатов
    if errors:
        print("🚨 ОШИБКИ КОНФИГУРАЦИИ:")
        for error in errors:
            print(f"   {error}")
        print()
    
    if warnings:
        print("⚠️  ПРЕДУПРЕЖДЕНИЯ:")
        for warning in warnings:
            print(f"   {warning}")
        print()
    
    if not errors:
        sandbox_status = "SANDBOX" if os.getenv('SANDBOX_MODE', 'true').lower() == 'true' else "LIVE"
        print(f"✅ Конфигурация корректна! Режим: {sandbox_status}")
        return True
    else:
        print("❌ Исправьте ошибки в .env файле перед запуском бота")
        return False

if __name__ == "__main__":
    if validate_env_file():
        print("\n🚀 Готово к запуску торгового бота!")
        sys.exit(0)
    else:
        sys.exit(1)