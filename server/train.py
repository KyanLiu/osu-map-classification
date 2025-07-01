import sklearn
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from db import get_data_db, insert_tag_db, exists_db, insert_data_db
from parse import parse_osu_file
from data import download_osu_data

# this will download and parse osu data and store it in the database
def insertDataById(beatmap_id, typ):
    insert_tag_db(typ, beatmap_id)
    if exists_db(beatmap_id):
        print("Beatmap ID", beatmap_id, "is already in the database.")
        return
    data = download_osu_data(beatmap_id)
    if data is None:
        return
    map_osu_details = parse_osu_file(data, beatmap_id)
    insert_data_db(map_osu_details)

def train():
    # split train test
    names, X, y = get_data_db()
    X_train, X_test, y_train, y_test, names_train, names_test = train_test_split(X, y, names, test_size = 0.2)
    print("Train:")
    print(X_train, y_train, names_train)
    print("Test:")
    print(X_test, y_test, names_test)
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    print(X_train_scaled)
    print(X_test_scaled)

    clf = KNeighborsClassifier(n_neighbors=1)
    clf.fit(X_train_scaled, y_train)
    print(clf.predict(X_test))
    # this returns the data needed
    #new_train_data = connect_tags(standardized_data)
train()
