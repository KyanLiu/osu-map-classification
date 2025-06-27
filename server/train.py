from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
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
    names, X, y = get_data_db()
    print(names)
    print(X)
    print(y)
    #scaler = StandardScaler()
    #scaler.fit(X_train)


    #mean, standard_deviation = standard_deviation_calc()
    #standardized_data = standardize_data(mean, standard_deviation)
    # this returns the data needed
    #new_train_data = connect_tags(standardized_data)
    #new_test_data = shape_predict_data(1860169, mean, standard_deviation)
    #print(new_test_data)
    #clf = KNearestNeighbors()
    #clf.fit(new_train_data)
    #print(clf.predict(new_test_data))
train()
