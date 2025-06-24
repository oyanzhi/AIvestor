import torch
from torch import nn
from torch.utils.data import Dataset


#custom dataset
class StockDataset(Dataset): #could change to iterable if using live data for ml?
    def __init__(self, df, key, setsize=7):
        self.setsize = setsize
        self.sequences = []

        for ticker in df["Ticker"].unique():
            one = df[df["Ticker"] == ticker].sort_index()
            factors = one[key].values
            target = one["Close"].values

            for i in range(len(factors) - setsize):
                x = factors[i : i + setsize]
                y = target[i + setsize]
                self.sequences.append((x, y))

    def __len__(self):
        return len(self.sequences)
    
    def __getitem__(self, index):
        x, y = self.sequences[index]
        return torch.tensor(x), torch.tensor(y)
    

class StocksLSTM(nn.Module):
    def __init__(self, hidden_size, num_layers, input_size):
        super().__init__()
        self.lstm = nn.LSTM(input_size=input_size, hidden_size=hidden_size, num_layers=num_layers, batch_first=True)
        self.h2o = nn.Linear(hidden_size, 1)

    def forward(self, input):
        lstm_out, hidden = self.lstm(input)
        last_output = lstm_out[:, -1, :]
        last_output = self.h2o(last_output)
        return last_output
    
