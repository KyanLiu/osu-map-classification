import sqlite3
con = sqlite3.connect("osu_class_data.db")
cur = con.cursor()

#test_data = ['HIKARI (TV Size)',
        #4.0, 9.3, 9.4, 1.8, 1.0, 0.4792243767313019, 208.68268391046013, 209.99999999999977, 0.8205271883670865, 86857, 0.004156256835948743, 0.0, 0.0, 0, 0.008310249307479225]

def flatten_data(data):
    return list(map(lambda i: i[1] if isinstance(i, list) else i, data))

def build_db():
    cur.execute("""
        CREATE TABLE osu_raw_data (
            MapName varchar(255),
            CircleSize FLOAT,
            OverallDifficulty FLOAT,
            ApproachRate FLOAT,
            SliderMultiplier FLOAT,
            SliderTickRate FLOAT,
            SliderObjectRatio FLOAT,
            AvgNoteDist FLOAT,
            AvgBPM FLOAT,
            AvgSliderVelocity FLOAT,
            MapLength FLOAT,
            MapDensity FLOAT,
            StreamDensity FLOAT,
            BurstDensity FLOAT,
            SpacedStreamDensity FLOAT,
            FlowAimDensity FLOAT
                )
                """)

def insert_db(data):
    flat_data = flatten_data(data)
    cur.executemany("INSERT INTO osu_raw_data VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [tuple(flat_data)])
    con.commit()

def standardize_data():
    cur.execute("""
        SELECT
            AVG(MapName),
            AVG(CircleSize),
            AVG(OverallDifficulty),
            AVG(ApproachRate),
            AVG(SliderMultiplier),
            AVG(SliderTickRate),
            AVG(SliderObjectRatio),
            AVG(AvgNoteDist),
            AVG(AvgBPM),
            AVG(AvgSliderVelocity),
            AVG(MapLength),
            AVG(MapDensity),
            AVG(StreamDensity),
            AVG(BurstDensity),
            AVG(SpacedStreamDensity),
            AVG(FlowAimDensity)
        FROM osu_raw_data
""")
    averages = cur.fetchone()
    cur.execute("""
        SELECT
            AVG(MapName * MapName),
            AVG(CircleSize * CircleSize),
            AVG(OverallDifficulty * OverallDifficulty),
            AVG(ApproachRate * ApproachRate),
            AVG(SliderMultiplier * SliderMultiplier),
            AVG(SliderTickRate * SliderTickRate),
            AVG(SliderObjectRatio * SliderObjectRatio),
            AVG(AvgNoteDist * AvgNoteDist),
            AVG(AvgBPM * AvgBPM),
            AVG(AvgSliderVelocity * AvgSliderVelocity),
            AVG(MapLength * MapLength),
            AVG(MapDensity * MapDensity),
            AVG(StreamDensity * StreamDensity),
            AVG(BurstDensity * BurstDensity),
            AVG(SpacedStreamDensity * SpacedStreamDensity),
            AVG(FlowAimDensity * FlowAimDensity)
        FROM osu_raw_data
""")
    squared_averages = cur.fetchone()
    print("Here are the averages:", averages)
    print("Here are the squared_averages:", squared_averages)
    standard_deviation = []
    for i in range(len(averages)):
        standard_deviation.append((squared_averages[i] - (averages[i] ** 2)) ** 0.5)
    print("Here is the standard deviation for each", standard_deviation)
#insert_db(test_data)
standardize_data()
#build_db()
#res = cur.execute("SELECT name FROM sqlite_master")
#res = cur.execute("SELECT * FROM osu_raw_data")
#print(res.fetchone())
