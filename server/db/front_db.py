import sqlite3
import numpy as np
con = sqlite3.connect("osu_class_data.db")
cur = con.cursor()

def add_submission(possible_tag, beatmap_id):
    cur.execute("""
        SELECT * FROM submissions_data
        WHERE possible_map_type = ? AND beatmap_id = ?
    """, [possible_tag, beatmap_id])
    result = cur.fetchone()
    if result:
        return
    cur.execute("INSERT INTO submissions_data VALUES(?, ?)", [tag, beatmap_id])
    con.commit()

def build_submit_db():
    cur.execute("""
        CREATE TABLE submissions_data (
            possible_map_type TEXT,
            beatmap_id INTEGER
        )
        """) 

def retrieve_submissions():
    cur.execute("SELECT * FROM submissions_data")
    rows = cur.fetchall()
    data = [list(row) for row in rows]
    cata = {}
    for i in data:
        if i[1] not in cata:
            cata[i[1]] = [i[0]]
        else:
            cata[i[1]].append(i[0])
    return cata
