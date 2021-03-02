from data.DataHandlerOvershootDay import DataHandlerOvershootDay

overshoot = DataHandlerOvershootDay()

# -------------------------------------------------------------------------------------------------
# create overshoot-day-2021.csv
# -------------------------------------------------------------------------------------------------

overshoot = DataHandlerOvershootDay()
df = overshoot.transform_download_file()

# create start day for each row
rows = len(df)
start_days = list(range(rows))
for i in start_days:
    start_days[i] = DataHandlerOvershootDay.DEFAULT_START_DAY

# insert new column with start day
df.insert(1, "Start Day", start_days)

# show and save df
print(df)
overshoot.write_csv(df)