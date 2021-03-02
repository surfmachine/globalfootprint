import json
import os
import pandas as pd
from pathlib import Path

class DataHandlerOvershootDay():
    """Handling of the earth overshoot day."""

    MONTH = ["January","February","March","April","May","June","July","August","September","October","November","December"]
    DEFAULT_YEAR = 2021
    DEFAULT_START_DAY = "01.01.2021"

    def __init__(self):
        self.path = "download"
        self.transform_path = "transform"
        self.filename = "overshoot-day-{year}"

    def get_filname(self, year=DEFAULT_YEAR, extension=".json"):
        filename = self.filename.replace("{year}", str(year))
        return (filename + extension)

    def get_file(self, year=DEFAULT_YEAR, extension=".json"):
        filename = self.get_filname(year, extension)
        file = Path(self.path)/filename
        return file

    def get_transform_file(self, name, extension=".json"):
        filename = self.get_filname(name, extension)
        file = Path(self.transform_path)/filename
        return file

    def transform_download_file(self):
        file = self.get_file(extension=".xlsx")
        df = pd.read_excel(file)
        for row in df.iterrows():
            country = row[1]['Country']
            long_date = row[1]['Overshoot Day']
            # transform date to format: dd.mm.yyyy
            short_date, iso_date = self.transform_date(long_date)
            row[1]['Overshoot Day'] = short_date
        return df

    def transform_date(self, long_date):
        """ Transform date to short and iso format.
        Transform the long date format 'Month day, year' to the following two formats:
          - Short format: 'dd.mm.yyyy'
          - ISO format  : 'yyyy-mm-dd' if
        Sample:
          The date 'February 9, 20210' will be transformed to: ['09.02.2021', 2021-02-09]
        """
        month_token, day_token, year = long_date.split();
        # transform day
        index = int(day_token[:-1])
        day = "{:02d}".format(index)
        # transform month
        index = 1 + DataHandlerOvershootDay.MONTH.index(month_token)
        month = "{:02d}".format(index)
        # create and return result
        short_date = day + "." + month + "." + year
        iso_date = year + "-" + month + "-" + day
        return [short_date, iso_date]


    def write_csv(self, dfData, file=None, index_label="Index"):
        if file == None:
            file = self.get_transform_file(DataHandlerOvershootDay.DEFAULT_YEAR, extension=".csv")

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
