from rest_framework import serializers

from ml.predict import StockPredict


class PostReceiveLogic(serializers.Serializer):
    tickersymbol = serializers.ListField(child=serializers.CharField(write_only=True))

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.modelpredict = StockPredict()

    def check_ticker(self, data):
        predictor = self.modelpredict
        tickersymbol = data.get("tickersymbol", [])

        results = {}

        for symbol in tickersymbol:
            res = predictor.final(ticker=symbol)

            if res is not None:
                results[symbol] = res

        return results
