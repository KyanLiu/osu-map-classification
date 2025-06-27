import sqlite3
import numpy as np
con = sqlite3.connect("osu_class_data.db")
cur = con.cursor()

#test_data = ['HIKARI (TV Size)',
        #4.0, 9.3, 9.4, 1.8, 1.0, 0.4792243767313019, 208.68268391046013, 209.99999999999977, 0.8205271883670865, 86857, 0.004156256835948743, 0.0, 0.0, 0, 0.008310249307479225]

def flatten_data(data):
    return list(map(lambda i: i[1] if isinstance(i, list) else i, data))
'''
def standard_deviation_calc():
    cur.execute("""
        SELECT
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
    #print("Here are the averages:", averages)
    #print("Here are the squared_averages:", squared_averages)
    standard_deviation = np.sqrt(np.array(squared_averages) - (np.array(averages))**2)
    return [list(averages), standard_deviation]
'''

def build_db():
    cur.execute("""
        CREATE TABLE osu_raw_data (
            BeatmapID INTEGER PRIMARY KEY,
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
    cur.execute("""
        CREATE TABLE osu_tags_data (
                map_type TEXT,
                beatmap_id INTEGER
            )
                """)


def exists_db(beatmap_id):
    cur.execute("""SELECT * FROM osu_raw_data
        WHERE BeatmapID = ? LIMIT 1
    """, 
    (beatmap_id,))
    return cur.fetchone() is not None


def insert_data_db(data):
    #print(data)
    flat_data = flatten_data(data)
    cur.executemany("INSERT INTO osu_raw_data VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [tuple(flat_data)])
    con.commit()

def insert_tag_db(tag, beatmap_id):
    cur.execute("""
        SELECT * FROM osu_tags_data
        WHERE map_type = ? AND beatmap_id = ?
    """, [tag, beatmap_id])
    result = cur.fetchone()
    if result:
        return
    cur.execute("INSERT INTO osu_tags_data VALUES(?, ?)", [tag, beatmap_id])
    con.commit()

def get_tags_db():
    # returns a map of all catagories and their beatmap ids
    cur.execute("SELECT * FROM osu_tags_data")
    rows = cur.fetchall()
    data = [list(row) for row in rows]
    cata = {}
    for i in data:
        if i[1] not in cata:
            cata[i[1]] = [i[0]]
        else:
            cata[i[1]].append(i[0])
    return cata
'''
def standardize_data(standard_deviation, mean):
    #print(standard_deviation, mean)
    cur.execute("SELECT * FROM osu_raw_data")
    rows = cur.fetchall()
    data = [list(row) for row in rows]
    numbers = [row[2:] for row in data]  
    standard_deviation[standard_deviation == 0] = 1
    standardized_numbers = (np.array(numbers) - np.array(mean)) / np.array(standard_deviation)
    new_data = standardized_numbers.tolist()
    for i, row in enumerate(data):
        data[i][2:] = new_data[i]
    return data
'''

def get_data_db():
    print("test")
    res = cur.execute("SELECT * FROM osu_raw_data")
    rows = cur.fetchall()
    names = [list(row)[:2] for row in rows]  
    data = [list(row)[2:] for row in rows]  
    unordered_tags = get_tags_db()
    tags = []
    for i in names:
        tags.append(unordered_tags[i[0]])
    return [names, data, tags]




#insert_db(test_data)
#standardize_data()
#res = cur.execute("SELECT name FROM sqlite_master")
#res = cur.execute("SELECT * FROM osu_raw_data")
#res = cur.execute("SELECT * FROM osu_tags_data")
#print(res.fetchone())
#print(res.fetchall())
#cur.execute("DROP TABLE osu_raw_data")
#cur.execute("DROP TABLE osu_tags_data")
#build_db()
#get_tags_db()
