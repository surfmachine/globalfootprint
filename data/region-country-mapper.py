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

# -------------------------------------------------------------------------------------------------
# load countries from 2017
# -------------------------------------------------------------------------------------------------

print("#")
print("# countries from 2017")
print("#")

dataHandler = DataHandlerNumberOfEarth()

entries = dataHandler.read_json(2017)
for entry in entries:
    rec = Record(entry)
    regionCode = lookupRegionMap(rec.name)
    print(regionCode, ":", rec.code, rec.name)



