import torch

import yfinance as yf

import pandas as pd
import numpy as np

from customclass import StocksLSTM

import datetime as DT

import joblib

import os

class StockPredict:
    def __init__(self):
        self.device = torch.device("cuda") if torch.cuda.is_available() else torch.device("cpu")
        torch.set_default_device(self.device)
    
        self.key = ["Open", "Close", "High", "Low", "Volume"]

        self.end = DT.date.today()
        self.start = self.end - DT.timedelta(days=14) #extra then slice

        self.model = StocksLSTM(hidden_size=128, num_layers=2, input_size=len(self.key))
        model_path = os.path.join(os.path.dirname(__file__), "models/modelv1.pt")
        self.model = torch.load(model_path, map_location=self.device, weights_only=False)
        scaler_path = os.path.join(os.path.dirname(__file__), "minmax_scalerv1.save")
        self.scaler = joblib.load(scaler_path)


    def predict(self, symbol):

        seq = yf.download(symbol, end=self.end, start=self.start)

        seq = seq.tail(7)

        if isinstance(seq.columns, pd.MultiIndex):
            seq.columns = [col[0] for col in seq.columns]

        seq = seq[self.key]
        seq["Ticker"] = symbol

        seq["Volume"] = np.log1p(seq["Volume"])
        seq[self.key] = self.scaler.transform(seq[self.key])

        input = torch.tensor(seq[self.key].values, dtype=torch.float32).unsqueeze(0).to(self.device)

        self.model.eval()

        with torch.no_grad():
            res = self.model(input)
    
        return res

    def unscale(self, predict):
        temp = np.zeros((len(predict), len(self.key)))
        temp[:, 1] = predict.squeeze()
        ret = self.scaler.inverse_transform(temp)
        ret = ret[:, 1]
        return ret
    
    def final(self, ticker):
        unscaled = self.predict(ticker)
        scaled = self.unscale(unscaled)
        return scaled