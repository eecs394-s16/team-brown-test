from sklearn.svm import SVR
from sklearn.model_selection import cross_val_score
import numpy as np

# Training
features = np.loadtxt(open("audio_features.csv", "rb"), delimiter=",", skiprows=1, usecols=range(2,11))
labels = np.loadtxt(open("labels.csv", "rb"), delimiter=",", skiprows=1)
arousal = labels[:,1]
valence = labels[:,0]

clf_A = SVR(C=1.0, cache_size=200, coef0=0.0, degree=2, epsilon=0.2, gamma='auto',
    kernel='linear', max_iter=-1, shrinking=True, tol=0.001, verbose=False)
clf_A.fit(features, arousal)

clf_V = SVR(C=1.0, cache_size=200, coef0=0.0, degree=2, epsilon=0.5, gamma='auto',
    kernel='linear', max_iter=-1, shrinking=True, tol=0.001, verbose=False)
clf_V.fit(features, valence)

print('Arousal Training R^2: %0.3f' % clf_A.score(features, arousal))
print('Valence Training R^2: %0.3f' % clf_V.score(features, valence))

# Cross Validation
scores_A = cross_val_score(clf_A, features, arousal, cv=5, scoring='neg_mean_squared_error')
print("Arousal CV MSE: %0.2f (+/- %0.2f)" % (-scores_A.mean(), scores_A.std() * 2))

scores_V = cross_val_score(clf_V, features, valence, cv=5, scoring='neg_mean_squared_error')
print("Valence CV MSE: %0.2f (+/- %0.2f)" % (-scores_V.mean(), scores_V.std() * 2))

# Prediction
unlabeled_features = np.loadtxt(open("unlabeled_audio_features.csv", "rb"), delimiter=",", skiprows=1, usecols=range(2,11))

pred_A = clf_A.predict(unlabeled_features)
pred_V = clf_V.predict(unlabeled_features)
preds = np.column_stack((pred_V, pred_A))

np.savetxt("predictions.csv", preds, delimiter=",")

# Classify
# bi_class = np.round(preds).astype(int)
# classes = bi_class[:,0]*10+bi_class[:,1]
# np.savetxt("classes.csv", classes, delimiter=",")