class DecisionTree:
    def __init__(self, min_tree_split=2, max_tree_depth=100, n_features=None):
        self.min_tree_split = min_tree_split
        self.max_tree_depth = max_tree_depth
        self.n_features = n_features
        self.root = None

    def fit(self, x, y):


    def grow_tree(self, x, y):
            

    def predict():
        

class Node:
    def __init__(self, feature=None, threshold=None, left=None, right=None, value=None):
        self.feature = feature
        self.threshold = threshold
        self.left = left
        self.right = right
        self.value = value
    def isLeafNode(self):
        if self.value is None: return True
        return False


# we want to minimize the gini impurity
# how will the data be formatted?
def gini_impurity_calc():
