import sklearn
import joblib
import numpy as np
from pathlib import Path
from sklearn.preprocessing import StandardScaler, MultiLabelBinarizer
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, hamming_loss
from sklearn.multioutput import MultiOutputClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_selection import SelectFromModel
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
    def load(self):
        if self.model is None:
            try:
                self.model = joblib.load('osu_model_package.pkl')
                print('Loaded model from osu_model_package')
            except FileNotFoundError:
                self.train()
    
    def train(self):
        names, X, y = get_data_osu_db()
        # only choose the best 7 features based on tested data
        mul = MultiLabelBinarizer()
        y_bin = mul.fit_transform(y)
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)

        select = SelectFromModel(RandomForestClassifier(n_estimators=20), max_features=7)
        X_scaled_lim = select.fit_transform(X_scaled, y_bin)

        rfc = RandomForestClassifier(n_estimators=20)
        rfc.fit(X_scaled_lim, y_bin)

        lr = MultiOutputClassifier(LogisticRegression(C=0.1, penalty='l2', solver='liblinear', max_iter=1000))
        lr.fit(X_scaled_lim, y_bin)

        svm = MultiOutputClassifier(SVC(C=10, gamma=0.01, kernel='rbf'))
        svm.fit(X_scaled_lim, y_bin)

        # save models
        model_package = {
            'rfc': rfc,
            'lr': lr,
            'svm': svm
        }
        joblib.dump(model_package, 'osu_model_package.pkl')
        self.model = model_package
        print('The model has been trained and saved to osu_model_package')

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

    def predict_class(self, X):
        if self.model is None:
            self.load()
        rfc = self.model.rfc 
        lr = self.model.lr
        svm = self.model.svm

        print(rfc.predict(X))

        #print('Here is where i will predict using the already loaded models')
        # X is just an array of standardized features?
        # now we need to to test for it to return features

osu_model = OsuModel()
osu_model.load()

X_temp = []
#osu_model.predict_class(X)