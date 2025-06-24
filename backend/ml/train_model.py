import torch
from torch import nn
from torch.utils.data import DataLoader

import yfinance as yf

import pandas as pd
from sklearn.preprocessing import MinMaxScaler
import numpy as np

from customclass import StockDataset, StocksLSTM

import joblib

device =  torch.device("cuda") if torch.cuda.is_available() else torch.device("cpu")
torch.set_default_device(device)

tickers = "AAPL,MSFT,NVDA,AMZN,GOOG,GOOGL,META,AVGO,TSM,ORCL,CRM,ADBE,AMD,CSCO,IBM,QCOM,TXN,INTU,ADP,ADI,PANW,KLAC,LRCX,AMAT,ASML,TSLA,BA,GE,AMGN,NEE,UBER,EA,TEAM,CDW,CSCO,IBM,NOW,INTU,ANET,FI,ADP,KLAC,LRCX,AMAT,ASML,URBN"
tickers = tickers.split(",")
start = "2020-06-01"
end = "2025-06-01"

training_dfs = []
key = ["Open", "Close", "High", "Low", "Volume"]

for ticker in tickers:
    one = yf.download(ticker, start, end)

    if isinstance(one.columns, pd.MultiIndex):
        one.columns = [col[0] for col in one.columns]

    one = one[key]
    one["Ticker"] = ticker
        
    training_dfs.append(one)



training_fulldata = pd.concat(training_dfs, axis=0)
np.save("unscaled_fulldata", training_fulldata)

scaler = MinMaxScaler()
training_fulldata["Volume"] = np.log1p(training_fulldata["Volume"])
scaler.fit(training_fulldata[key])
training_fulldata[key] = scaler.transform(training_fulldata[key])
joblib.dump(scaler, "backend/ml/minmax_scalerv1.save")

# split into two sets
generator = torch.Generator(device=device).manual_seed(312)
train_set, test_set = torch.utils.data.random_split(StockDataset(training_fulldata, key=key, setsize=7), [0.8, 0.2], generator=generator)
np.save("train_indices.npy", train_set.indices)
np.save("test_indices.npy", test_set.indices)
training_fulldata.to_csv("training_fulldata.csv")


def train(model, dataset, optimizer, n_epoch=5, criterion=nn.MSELoss()):
    model.train()

    for i in range(n_epoch):
        model.zero_grad()
        batch_loss = 0.0

        for factor_batch, target_batch in dataset:
            factor_batch = factor_batch.to(device).float()
            target_batch = target_batch.to(device).float().unsqueeze(1)

            predicted = model(factor_batch)
            sequence_loss = criterion(predicted, target_batch)
            
            optimizer.zero_grad()
            sequence_loss.backward()
            optimizer.step()

            batch_loss += sequence_loss.item()

        avg_loss = batch_loss / len(dataset)
        print(f"Epoch {i + 1}, Average Loss = {avg_loss}")



model = StocksLSTM(hidden_size=128, num_layers=2, input_size=len(key))

train_loader = DataLoader(train_set, batch_size=128, shuffle=True)

optimizer = torch.optim.Adam(model.parameters(), lr=0.0005)

train(model, train_loader, optimizer, n_epoch=50, criterion=nn.MSELoss())

torch.save(model, "./modelv1.pt")


    