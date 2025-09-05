from models import UserInDB
import sqlite3
con = sqlite3.connect("./db/osu_class_data.db")
cur = con.cursor()

def build_submit_db():
    cur.execute("""
        CREATE TABLE authTable (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            email TEXT UNIQUE,
            password_hashed TEXT,
            is_admin INTEGER DEFAULT 0,
            is_active INTEGER DEFAULT 1
        )
        """) 

def user_exists(catagory: str, value: str):
    cur.execute(f"""
        SELECT FROM authTable WHERE {catagory} = ?
                """, [value])
    res = cur.fetchone()
    return res

def get_user(username: str):
    cur.execute(f"""
        SELECT username, email, password_hashed, is_admin FROM authTable WHERE username = ?
                """, [username])
    res = cur.fetchone()
    print(res)
    if res:
        return UserInDB(username=res[0], email=res[1], is_admin=int(res[3]), hashed_password=res[2])
    return None
#   get_user("kyanliu9")

def create_user(username: str, email: str, hashed_password: str):
    cur.execute(f"INSERT INTO authTable (username, email, password_hashed) VALUES(?, ?, ?)", [username, email, hashed_password])
    con.commit()

#cur.execute("INSERT INTO authTable (username, email, password_hashed, is_admin) VALUES (?, ?, ?, ?)", ["kyanliu9", "kyanliu9@gmail.com", "$2b$12$Kart7M0Jqm7LbOCSb6cvluY8CQu4BxBDucMtDleJYQ4d4exX7wtt6", 1])
#con.commit()
    
#build_submit_db()

#cur.execute("DROP TABLE authTable")
#res = cur.execute("SELECT * FROM authTable")
#print(res.fetchall())