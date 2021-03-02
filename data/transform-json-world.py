import pandas as pd
import numpy as np
from data.DataHandlerNumberOfEarth import DataHandlerNumberOfEarth
from data.DataHandlerNumberOfEarth import Record


# -------------------------------------------------------------------------------------------------
# init settings and data handler
# -------------------------------------------------------------------------------------------------

#
# Settings
#
fillna = False                  # Fill NaN values with 0 if True, otherwise keep values as NaN

#
# Data Handler
#
dataHandler = DataHandlerNumberOfEarth()

# -------------------------------------------------------------------------------------------------
# create data frame of all countries
# -------------------------------------------------------------------------------------------------

#
# prepare empty data frame
#
index   = ["World"]
columns = dataHandler.years
df      = pd.DataFrame(index=index, columns=columns)
if fillna:
    df = df.fillna(0) # with 0s rather than NaNs

#
# create data frame
#
#   Country,                1961,   1962,   1963,   1964,   ...     2014,   2015,   2016
#   World,                  0.39,   0.38,   ____,   ____,   ...     ____,   ____,   ____
#
for year in dataHandler.years:
    entries = dataHandler.read_json(year)
    for entry in entries:
        rec = Record(entry)
        if rec.is_world() and (rec.name in df.index):
            df.at[rec.name, year] = rec.value

print(df)

#
# create dict
#
countries = []
for country, row in df.iterrows():
    # init
    data = []
    fromValue = 100
    toValue = 0
    # create data list
    for year, value in row.iteritems():
        if np.isnan(value):
            continue;
        data.append({'year': year, 'value': value});
        if (fromValue > value):
            fromValue = value;
        if (toValue < value):
            toValue = value;
    # create and append country record
    fromYear = data[0]['year']
    toYear = data[len(data) - 1]['year']
    countries.append({
        'country' : country,
        'year'    : {'from': fromYear,  'to': toYear,  'min': fromYear,  'max': toYear},
        'value'   : {'from': fromValue, 'to': toValue, 'min': 0,         'max': toValue},
        'data'    : data
    })

print(countries)

#
# create and save json file
#
json = { 'countries' : countries }
file = dataHandler.get_transform_file("world", extension=".json")
dataHandler.write_json(json, file)
