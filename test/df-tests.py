import pandas as pd
import numpy as np
from pathlib import Path

index = ['A', 'B', 'C']
columns = range(1,6,1)

df = pd.DataFrame(index=index, columns=columns)
#df = df.fillna(0) # with 0s rather than NaNs
# print(df)

df.at["B",3] = 66
if "D" in df.columns:
    df.at["D",3] = 99
print(df)

# file = Path()/"dummy.csv"
# df.to_csv(file)
# print("\nReport saved to:", file)

