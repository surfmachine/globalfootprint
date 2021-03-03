import requests
import json
import os
from pathlib import Path


class Record():
    """Handling of the number of earth record, delivered as dict in the following format:

        Sample: {
            'id': 155669,
            'version': None,
            'year': 2016,
            'countryCode': 1,
            'countryName':
            'Armenia',
            'shortName': 'Armenia',
            'isoa2': 'AM',
            'record': 'Earths',
            'cropLand': 0.35456978611178225,
            'grazingLand': 0.13362213298238312,
            'forestLand': 0.15097321373575417,
            'fishingGround': 0.003232686466268826,
            'builtupLand': 0.036819877613515586,
            'carbon': 0.5080190790726989,
            'value': 1.1872367759824043,
            'score': '3A'
        }
    """

    def __init__(self, entry):
        self.code = entry['countryCode']
        self.name = entry['shortName']
        self.value = entry['value']
        self.iso = entry['isoa2']
        # fix missing iso code for Sudan
        if (self.code == 206):
            self.iso = 'SD'
        # fix flagged shortName of World entry
        if (self.code == 5001):
            self.name = "World"
        # shorten names
        if (self.code == 37):
            self.name = "Cent. African Rep."
        if (self.code == 56):
            self.name = "Dominican Rep."
        if (self.code == 61):
            self.name = "Equat. Guinea"
        if (self.code == 80):
            self.name = "Bosnia Herzegovina"
        if (self.code == 193):
            self.name = "Sao Tome Principe"
        if (self.code == 220):
            self.name = "Trinidad Tobago"
        if (self.code == 225):
            self.name = "Arab Emirates"
        # override name for regions, since the short name has special characters
        if self.code >= 1000:
            self.name = entry['countryName']
        if (self.code == 1000):
            self.name = "Australia/New Zealand"
        if (self.code == 1015):
            self.name = "SouthEast Asia"
        if (self.code == 2003):
            self.name = "Latin America/Caribbean"

    def is_country(self):
        if self.code >= 1000:
            return False
        return True

    def is_mainregion(self):
        if self.code >= 2000:
            return True
        return False

    def is_subregion(self):
        if self.code >= 1000 and self.code < 2000:
            return True
        return False

    def is_world(self):
        if self.code == 5001:
            return True
        return False


class DataHandlerNumberOfEarth():
    """Handling of the number of earth data records (download and aggregate as needed)."""

    def __init__(self):
        # request api
        self.referer = 'http://data.footprintnetwork.org/'
        self.url = 'https://api.footprintnetwork.org/v1/data/all/{year}/earth'
        self.years = range(1961,2018,1)
        # request session
        self.session = requests.Session()
        self.session.headers.update({'referer': self.referer})
        # files
        self.path = "download"
        self.transform_path = "transform"
        self.filename = "number-of-earth-{year}"

    def get_url(self, year):
        url = self.url.replace("{year}", str(year))
        return url

    def get_filname(self, year, extension=".json"):
        filename = self.filename.replace("{year}", str(year))
        return (filename + extension)

    def get_file(self, year, extension=".json"):
        filename = self.get_filname(year, extension)
        file = Path(self.path)/filename
        return file

    def get_transform_file(self, name, extension=".json"):
        filename = self.get_filname(name, extension)
        file = Path(self.transform_path)/filename
        return file

    def download(self):
        for year in self.years:
            url = self.get_url(year)
            file = self.get_file(year)
            if os.path.exists(file):
                print("year " + str(year) + " skip download, file already exists")
            else:
                print("year " + str(year) + " download from: " + url)
                resp = self.session.get(url)
                json_content = resp.content.decode('UTF-8')
                content  = json.loads(json_content)
                self.write_json(content, year)

    def write_json(self, data, year, file=None, encoding="utf-8"):
        if file == None:
            file = self.get_file(year)
        with open(file, 'w', encoding=encoding) as outfile:
            json.dump(data, outfile)

    def read_json(self, year, file=None, encoding="utf-8"):
        if file == None:
            file = self.get_file(year)
        with open(file) as infile:
            data = json.load(infile)
        return data

    def read_country_names(self, year=2017, filter=[]):
        entries = self.read_json(year)
        names = []
        for entry in entries:
            rec = Record(entry)
            if rec.is_country() and not rec.iso in filter:
                names.append(rec.name)
        names.sort()
        return names

    def read_country_and_main_region_names(self, year=2017, filter=[]):
        entries = self.read_json(year)
        names = []
        for entry in entries:
            rec = Record(entry)
            if rec.is_country() and not rec.iso in filter:
                names.append(rec.name)
                continue
            if rec.is_mainregion():
                names.append(rec.name)
        names.sort()
        return names

    def read_region_names(self, year=2017, filter=[]):
        entries = self.read_json(year)
        names = []
        for entry in entries:
            rec = Record(entry)
            if not rec.is_country() and not rec.iso in filter:
                names.append(rec.name)
        names.sort()
        return names

    def write_csv(self, dfData, file=None, index_label="Country"):
        if file == None:
            file = self.get_transform_file("all", extension=".csv")

        if os.path.exists(file):
            print("\nReport exists already:", file)
        else:
            dfData.to_csv(file, index_label=index_label)
            print("\nReport saved to:", file)

    def write_json(self, dictData, file=None):
        if file == None:
            file = self.get_transform_file("all", extension=".json")
        if os.path.exists(file):
            print("\nReport exists already:", file)
        else:
            with open(file, 'w') as outfile:
                json.dump(dictData, outfile)
            print("\nReport saved to:", file)

