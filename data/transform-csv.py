import pandas as pd
from data.DataHandlerNumberOfEarth import DataHandlerNumberOfEarth
from data.DataHandlerNumberOfEarth import Record


#
# Settings
#
fillna = False                  # Fill NaN values with 0 if True, otherwise keep values as NaN

data = DataHandlerNumberOfEarth()


# -------------------------------------------------------------------------------------------------
# create number-of-earth-all.csv
# -------------------------------------------------------------------------------------------------

#
# prepare empty data frame
#
index   = data.read_country_names()
columns = data.years
df      = pd.DataFrame(index=index, columns=columns)
if fillna:
    df = df.fillna(0) # with 0s rather than NaNs

#
# create df and csv file
#
#   Country,                1961,   1962,   1963,   1964,   ...     2014,   2015,   2016
#   Afghanistan,            0.39,   0.38,   ____,   ____,   ...     ____,   ____,   ____
#   Antigua and Barbuda,    ,       ,       ,       0.52,   ...     ____,   ____,   ____
#   ...
#   Zimbabwe                0.58,   0.58,   0.59,   0.64,   ...     ____,   ____,   ____
#

for year in data.years:
    entries = data.read_json(year)
    for entry in entries:
        rec = Record(entry)
        if not rec.is_country():
            continue
        if (rec.name in df.index):
            df.at[rec.name, year] = rec.value

data.write_csv(df)

# -------------------------------------------------------------------------------------------------
# create number-of-earth-world.csv
# -------------------------------------------------------------------------------------------------

#
# prepare empty data frame
#
index   = ["World"]
columns = data.years
df      = pd.DataFrame(index=index, columns=columns)
if fillna:
    df = df.fillna(0) # with 0s rather than NaNs

#
# create df and save as csv file
#
#   Country,                1961,   1962,   1963,   1964,   ...     2014,   2015,   2016
#   World,                  0.39,   0.38,   ____,   ____,   ...     ____,   ____,   ____
#
for year in data.years:
    entries = data.read_json(year)
    for entry in entries:
        rec = Record(entry)
        if not rec.is_world():
            continue
        if (rec.name in df.index):
            df.at[rec.name, year] = rec.value

file = data.get_transform_file("world", extension=".csv")
data.write_csv(df, file)

