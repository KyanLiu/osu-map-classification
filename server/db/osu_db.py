import sqlite3
con = sqlite3.connect("./db/osu_class_data.db")
cur = con.cursor()

def flatten_data(data):
    return list(map(lambda i: i[1] if isinstance(i, list) else i, data))

def build_osu_db():
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


def exists_osu_db(beatmap_id):
    cur.execute("""SELECT * FROM osu_raw_data
        WHERE BeatmapID = ? LIMIT 1
    """, 
    (beatmap_id,))
    return cur.fetchone() is not None


def insert_data_osu_db(data):
    #print(data)
    flat_data = flatten_data(data)
    cur.executemany("INSERT INTO osu_raw_data VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [tuple(flat_data)])
    con.commit()

def insert_tag_osu_db(tag, beatmap_id):
    cur.execute("""
        SELECT * FROM osu_tags_data
        WHERE map_type = ? AND beatmap_id = ?
    """, [tag, beatmap_id])
    result = cur.fetchone()
    if result:
        return
    cur.execute("INSERT INTO osu_tags_data VALUES(?, ?)", [tag, beatmap_id])
    con.commit()

def get_tags_osu_db():
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

def get_data_osu_db():
    print("test")
    res = cur.execute("SELECT * FROM osu_raw_data")
    rows = cur.fetchall()
    names = [list(row)[:2] for row in rows]  
    data = [list(row)[2:] for row in rows]  
    unordered_tags = get_tags_osu_db()
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
#build_osu_db()
#get_tags_db()
