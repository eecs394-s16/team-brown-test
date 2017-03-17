# AUTHOR: Benjamin Kalish
import numpy as np
import pandas as pd
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

CLIENT_ID = '0e6b495236434fdcb11b1fad2ede1c5a'
CLIENT_SECRET = 'fa74825cc2c64320ad5c53fb7de589d4'

TRACK_IDS = open("remaining_songs_final.txt", "rb").readlines()
TRACK_IDS = [t[14:-1] for t in TRACK_IDS]

output = pd.DataFrame(TRACK_IDS, columns=['ID'])
output.to_csv('track_ids.csv')

# TRACK_IDS = ['0EYOdF5FCkgOJJla8DI2Md', '40riOy7x9W7GXjyGp4pjAv', '0QeI79sp1vS8L3JgpEO7mD', '5dhQCqONiQji7k4RkhIcjq', '4eLn7z31zqzEdlKSgesohf', '3yrSvpt2l1xhsV9Em88Pul', '4x3SQvTgvqSTU3nOL1urZh', '0eKyHwckh9vQb8ncZ2DXCs', '69pwmeyvQMuHMtkCmpEWhQ', '5rpRzNcJZqKQXk9PIjreB6']

client_credentials_manager = SpotifyClientCredentials(CLIENT_ID, CLIENT_SECRET)
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

chunks = [TRACK_IDS[x:x+50] for x in xrange(0, len(TRACK_IDS), 50)]

features = []
for chunk in chunks: # spotipy takes max 50 songs at a time
	features += sp.audio_features(chunk)

output_array = np.zeros((len(features), 10), dtype='object')
columns = ['id', 'tempo', 'key', 'loudness', 'mode', 'danceability', 'speechiness', 'acousticness', 'instumentalness', 'liveness']
for i, track in enumerate(features):
	output_array[i] = np.array([track['id'], track['tempo'], track['key'], track['loudness'], track['mode'], track['danceability'], track['speechiness'], track['acousticness'], track['instrumentalness'], track['liveness']], dtype='object')
print output_array

output = pd.DataFrame(output_array, columns=columns)

output.to_csv('unlabeled_audio_features.csv')
