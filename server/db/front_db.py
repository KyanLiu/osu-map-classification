import sqlite3
con = sqlite3.connect("./db/osu_class_data.db")
cur = con.cursor()

def build_submit_db(table_name):
    cur.execute(f"""
        CREATE TABLE {table_name} (
            possible_map_type TEXT,
            beatmap_id INTEGER
        )
        """) 

def add_submission(table_name, possible_tag, beatmap_id):
    cur.execute(f"""
        SELECT * FROM {table_name}
        WHERE possible_map_type = ? AND beatmap_id = ?
    """, [possible_tag, beatmap_id])
    result = cur.fetchone()
    if result:
        return
    cur.execute(f"INSERT INTO {table_name} VALUES(?, ?)", [possible_tag, beatmap_id])
    con.commit()

def retrieve_submissions(table_name):
    cur.execute(f"SELECT * FROM {table_name}")
    rows = cur.fetchall()
    data = [list(row) for row in rows]
    cata = {}
    fn = []
    for i in data:
        if i[1] not in cata:
            cata[i[1]] = [i[0]]
        else:
            cata[i[1]].append(i[0])
    for i in cata:
        fn.append([i, cata[i]])
    return fn

def delete_submission(table_name, beatmap_id):
    cur.execute(f"""
        DELETE FROM {table_name} WHERE beatmap_id = ?
                """, [beatmap_id])
    con.commit()

#build_submit_db('staged_data')
#cur.execute("DROP TABLE submissions_data")
#res = cur.execute("SELECT * FROM submissions_data")
#print(res.fetchall())
#delete_submission('submissions_data', 4904540)

