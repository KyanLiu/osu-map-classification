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

#insert_db(test_data)

#build_db()
#res = cur.execute("SELECT name FROM sqlite_master")
#res = cur.execute("SELECT * FROM osu_raw_data")
#print(res.fetchone())
