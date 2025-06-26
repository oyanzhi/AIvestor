import torch
from torch import nn
from torch.utils.data import DataLoader, Subset

import numpy as np

from customclass import StockDataset, StocksLSTM

import pandas as pd

import joblib

np.set_printoptions(threshold=np.inf)


device =  torch.device("cuda") if torch.cuda.is_available() else torch.device("cpu")
torch.set_default_device(device)

key = ["Open", "Close", "High", "Low", "Volume"]


full_scaleddata = pd.read_csv("./ml/datasets/training_fulldata.csv")
training_fulldata = StockDataset(full_scaleddata, key=key)
test_indices = np.load("./ml/datasets/test_indices.npy")

test_set = Subset(training_fulldata, test_indices)

test_loader = DataLoader(dataset=test_set, batch_size=128)


def validation(model, dataset_loader, criterion=nn.MSELoss()):
    model.eval()
    validation_loss = 0.0
    predictedresult = []
    true_targets = []

    for factor_batch, target_batch in dataset_loader:
        factor_batch = factor_batch.to(device).float()
        target_batch = target_batch.to(device).float().unsqueeze(1)

        predict = model(factor_batch)
        sequence_loss = criterion(predict, target_batch)

        predictedresult.append(predict)
        true_targets.append(target_batch)
        validation_loss += sequence_loss.item()


    avg_validation_loss = validation_loss / len(dataset_loader)
    print(f"Avg Validation Loss: {avg_validation_loss}")
    return predictedresult, true_targets

model = StocksLSTM(hidden_size=128, num_layers=2, input_size=len(key))
model = torch.load("./ml/models/modelv1.pt", map_location=device, weights_only=False)
predictedresult, true_targets = validation(model=model, dataset_loader=test_loader, criterion=nn.MSELoss())

predictedresult = torch.cat(predictedresult).detach().numpy()
true_targets = torch.cat(true_targets).detach().cpu().numpy()
scaler = joblib.load("./ml/minmax_scalerv1.save")

def unscale(predictions, scaler):
    temp = np.zeros((len(predictions), len(key)))
    temp[:, 1] = predictions.squeeze()
    ret = scaler.inverse_transform(temp)
    ret = ret[:, 1]
    return ret

# res = unscale(predictedresult, scaler)
# print(res)

pred_unscaled = unscale(predictedresult, scaler)
true_unscaled = unscale(true_targets, scaler)

for p, t in zip(pred_unscaled[:10], true_unscaled[:10]):
    print(f"Predicted: {p:.2f}, Actual: {t:.2f}")

