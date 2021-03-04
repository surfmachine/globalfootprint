import pandas as pd
import numpy as np
from data.DataHandlerNumberOfEarth import DataHandlerNumberOfEarth
from data.DataHandlerNumberOfEarth import Record


# -------------------------------------------------------------------------------------------------
# load region map with country/region name and code
# -------------------------------------------------------------------------------------------------

df = pd.read_excel ('region/regionmap.xlsx', sheet_name='regions')

rmap = {}
for index, row in df.iterrows():
    code = str(row['code'])[0:4]
    name = row['name']
    rmap[name] = code

def lookupRegionMap(name):
    regionCode = None
    try:
        regionCode = rmap[name]
    except:
        print("lookupRegionCode failed for: [" + name + "]")
    return regionCode

regionNames = ["Africa","Asia","Europe","Latin America/Caribbean", "North America", "Oceania", "World"];

# -------------------------------------------------------------------------------------------------
# init settings and data handler
# -------------------------------------------------------------------------------------------------

#
# Settings
#

# Fill NaN values with 0 if True, otherwise keep values as NaN
fillna = False

# Filter out countries with insufficient or little data
# Belize (BZ), Cook Islands (CK), Montserrat (MS), Solomon Islands (SB), Sudan (SD), South Sudan (SS), Georgia (GE),
# British Virgin Islands (VG), Palestine (PS), St. Vincent and Grenadines (VC)
countryFilter = ["BZ","CK","MS","SB", "SD", "SS", "GE", "VG", "PS", "VC"];


#
# Data Handler
#
dataHandler = DataHandlerNumberOfEarth()

# -------------------------------------------------------------------------------------------------
# create data frame of all countries
# -------------------------------------------------------------------------------------------------

#
# prepare overall settings
#
minYear = dataHandler.years[0]
maxYear = dataHandler.years[len(dataHandler.years) - 1]

minValue = 0
maxValue = 0

#
# prepare empty data frame
#
index   = dataHandler.read_country_and_main_region_names(filter=countryFilter)
columns = dataHandler.years
df      = pd.DataFrame(index=index, columns=columns)
if fillna:
    df = df.fillna(0) # with 0s rather than NaNs

#
# create data frame
#
#   Country,                1961,   1962,   1963,   1964,   ...     2014,   2015,   2016
#   Afghanistan,            0.39,   0.38,   ____,   ____,   ...     ____,   ____,   ____
#   Antigua and Barbuda,    ,       ,       ,       0.52,   ...     ____,   ____,   ____
#   ...
#   Zimbabwe                0.58,   0.58,   0.59,   0.64,   ...     ____,   ____,   ____
#
for year in dataHandler.years:
    entries = dataHandler.read_json(year)
    for entry in entries:
        rec = Record(entry)
        # filter out sub regions but not the main regions and the world!
        if rec.is_subregion():
            continue
        if rec.iso in countryFilter:
            continue;
        if (rec.name in df.index):
            df.at[rec.name, year] = rec.value
            if (maxValue < rec.value):
                maxValue = rec.value

#
# create dict
#
# { "countries": [
#   { "country" : "Switzerland",
#     'year'  : {'from': 1986, 'to': 2017, 'min': 1961, 'max': 2017},
#     'value' : {'from':   0.6, 'to': 3.1, 'min':    0, 'max': 10.5},
#     'data'  : [{'year': year, 'value': value}, ..., {...}]
#   }
# ]}
#
# with the following fields:
# - countries = list of country records
# - country   = name of the country
# - year      = the ranges of the years
#   from/to   = range of the current country
#   min/max   = overall range of all countries
# - value     = the ranges of values
#   from/to   = range of the current country
#   min/max   = overall range of all countries
#   last      = the volue of the last available year
#   avg       = the average value of the from/to range
# - data      = list of all data records (dict with year and value) of the current country
# - region    = information for the region order. CAUTION: this field is only in the region file available
#   code      = the region code, used to sort the records
#   chart     = flag indication if it is the region chart (True) or one of the regions countries (False)
#
countries = []
for country, row in df.iterrows():
    # init
    data = []
    fromValue = maxValue
    toValue   = minValue
    sum = 0
    cnt = 0;
    # create data list
    for year, value in row.iteritems():
        if np.isnan(value):
            continue;
        data.append({'year': year, 'value': value});
        if (fromValue > value):
            fromValue = value;
        if (toValue < value):
            toValue = value;
        sum = sum + value;
        cnt = cnt + 1;
    # create and append country record
    fromYear = data[0]['year']
    toYear   = data[len(data) - 1]['year']
    lastValue=  data[len(data) - 1]['value']
    avgValue = sum/cnt
    regionCode = lookupRegionMap(country)
    regionChart= True if country in regionNames else False
    countries.append({
        'country' : country,
        'year'    : {'from': fromYear,  'to': toYear,  'min': minYear,  'max': maxYear},
        'value'   : {'from': fromValue, 'to': toValue, 'min': minValue, 'max': maxValue, 'last': lastValue, 'avg': avgValue},
        'data'    : data,
        'region'  : {'code': regionCode,'chart': regionChart }
    })

#
# create and save json file
#

print("")
print("-------------------- Best --------------------")
countries.sort(key=lambda c: (c['region']['code'], not c['region']['chart'], c['country']), reverse=False)
for c in countries:
    if c['region']['chart']:
        print("---")
    print(c['region']['code'], " : ", c['country'])

json = { 'countries' : countries }
file = dataHandler.get_transform_file("all-region", extension=".json")
dataHandler.write_json(json, file)



