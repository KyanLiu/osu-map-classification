import sklearn
import joblib
import numpy as np
from pathlib import Path
from sklearn.preprocessing import StandardScaler, MultiLabelBinarizer
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, hamming_loss
from sklearn.neighbors import KNeighborsClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_selection import SequentialFeatureSelector
from db import get_data_osu_db, insert_tag_osu_db, exists_osu_db, insert_data_osu_db
from parse import parse_osu_file
from data import download_osu_data

# this will download and parse osu data and store it in the database
def insertDataById(beatmap_id, typ):
    insert_tag_osu_db(typ, beatmap_id)
    if exists_osu_db(beatmap_id):
        print("Beatmap ID", beatmap_id, "is already in the database.")
        return
    data = download_osu_data(beatmap_id)
    if data is None:
        return
    map_osu_details = parse_osu_file(data, beatmap_id)
    insert_data_osu_db(map_osu_details)

class OsuModel:
    def __init__(self):
        self.model = None
        self.scalar = None
    
    def train(self):
        names, X, y = get_data_osu_db()
        # only choose the best 7 based on tested data
        mul = MultiLabelBinarizer()
        y_bin = mul.fit_transform(y)
        # take only the 7 features

        #scaler = StandardScaler()
        #X_scaled = scaler.fit_transform(X)



        #clf = RandomForestClassifier(n_estimators=10, random_state=0)
        #clf.fit(X_scaled, y_bin)
        #select = SelectFromModel(clf, max_features=7)
        #X_train_lim = select.fit_transform(X_train_scaled, y_train_bin)


    def test(self):
        names, X, y = get_data_osu_db()
        X_train, X_test, y_train, y_test, names_train, names_test = train_test_split(X, y, names, test_size=0.3, random_state=0)
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        mul = MultiLabelBinarizer()
        y_train_bin = mul.fit_transform(y_train)
        y_test_bin = mul.transform(y_test)
        clf = RandomForestClassifier(n_estimators=10, random_state=0) # which classifier?, maybe include the classifier name as a param
        clf.fit(X_train_scaled, y_train_bin)
        print('Average fraction of incorrect labels: ', hamming_loss(clf.predict(X_test_scaled), y_test_bin))
    def predict_class():
        #if not model_trained()
        print('Here is where i will predict using the already loaded models')

osu_model = OsuModel()
osu_model.train()

'''
def train():
    # this will train and save to the model


    #clf = KNeighborsClassifier(n_neighbors=3)


    sfs = SequentialFeatureSelector()


    importances = clf.feature_importances_
    indices = np.argsort(importances)[::-1]
    for f in range(X_train_scaled.shape[1]):
        print(conv[indices[f]], [importances[indices[f]]])
    
    # time to test with less features
    

    
    #print(clf.predict(X_test))
    # this returns the data needed
    #new_train_data = connect_tags(standardized_data)

    # from sklearn.metrics import accuracy_score
    # accuracy_score(y_test, y_pred)
#train()
def load_model():
'''

