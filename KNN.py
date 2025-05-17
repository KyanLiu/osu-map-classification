import numpy as np
from collections import Counter

#works for n-dimensions
def euclidean_distance(a, b):
    return np.sqrt(np.sum((np.array(a) - np.array(b))**2))

class KNearestNeighbors:
    def __init__(self, k=3):
        self.k = k
        self.data = None

    def fit(self, data):
        # just use the data
        self.data = data
        
    def predict(self, new_point):
        dist = []
        for type in self.data:
            for val in self.data[type]:
                dist.append([euclidean_distance(val, new_point), type])
        sortDist = [i[1] for i in sorted(dist)]
        shortenedDist = sortDist[:self.k]
        return Counter(shortenedDist).most_common(1)[0][0]
    

#clf = KNearestNeighbors()
#clf.fit(ex)
#print(clf.predict(new_point))
