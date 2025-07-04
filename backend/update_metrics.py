import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "coreproject.settings")
django.setup()

from stocks.services import update_all_stock_metrics

if __name__ == "__main__":
    updated = update_all_stock_metrics(verbose=True)
    print(f"✅ Updated {len(updated)} stocks: {updated}")