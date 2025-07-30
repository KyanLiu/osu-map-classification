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

def shapePredictData(beatmap_id):
    data = download_osu_data(beatmap_id)
    details = parse_osu_file(data, beatmap_id)
    just_val = [i[1] for i in details[2:]]
    return just_val

#shapePredictData(2654458)

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

        knn = KNeighborsClassifier(n_neighbors=3)
        knn.fit(X_scaled_lim, y_bin)

        # save models
        model_package = {
            'rfc': rfc,
            'lr': lr,
            'svm': svm,
            'knn': knn,
            'mul': mul,
            'scaler': scaler,
            'select': select
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
        rfc = self.model['rfc']
        lr = self.model['lr']
        svm = self.model['svm']
        knn = self.model['knn']
        mul = self.model['mul']
        scaler = self.model['scaler']
        select = self.model['select']

        X_scaled = scaler.transform(X)
        X_scaled_lim = select.transform(X_scaled)

        '''
        print(rfc.predict(X_scaled_lim))
        print(lr.predict(X_scaled_lim))
        print(svm.predict(X_scaled_lim))
        print(knn.predict(X_scaled_lim))
        '''
        pred_rfc = list(mul.inverse_transform(rfc.predict(X_scaled_lim))[0])
        pred_lr = list(mul.inverse_transform(lr.predict(X_scaled_lim))[0])
        pred_svm = list(mul.inverse_transform(svm.predict(X_scaled_lim))[0])
        pred_knn = list(mul.inverse_transform(knn.predict(X_scaled_lim))[0])
        total = [pred_rfc, pred_lr, pred_svm, pred_knn]
        print(total)
        return total

    def find_map(self, X):
        if self.model is None:
            self.load()
        rfc = self.model['rfc']
        lr = self.model['lr']
        svm = self.model['svm']
        knn = self.model['knn']
        mul = self.model['mul']
        scaler = self.model['scaler']
        select = self.model['select']

        X_scaled = scaler.transform(X)
        X_scaled_lim = select.transform(X_scaled)

        names, X_tot, y_tot = get_data_osu_db()

        dist, ind = knn.kneighbors(X_scaled_lim, n_neighbors=3, return_distance=True)
        # this function should filter out if it is the same map
        maps_knn = []
        for i in range(len(ind[0])):
            if dist[0][i] == 0:
                # remove the same map
                continue
            val = ind[0][i]
            maps_knn.append(names[val])

        print(maps_knn)
        total = [maps_knn]
        return total


#osu_model = OsuModel()
#osu_model.load()




#X_temp = [[4.0, 8.2, 9.6, 2.3, 1.0, 0.24292845257903495, 105.77073719529389, 175.81999999999996, 1.039817193344276, 163889, 0.007334232315774701, 0.415973377703827, 0.1497504159733777, 0.498, 0.6938435940099834]]
#osu_model.find_map(X_temp)