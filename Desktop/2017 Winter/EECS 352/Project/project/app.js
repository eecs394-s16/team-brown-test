(function(exports) {

	var g_name = '';
	var g_tracks = '';


	var getSpotifyTracks = function(id_list, callback) {
		var url = 'https://api.spotify.com/v1/tracks/?ids=' + id_list.join(',');
		console.log("API request: " + url);
		$.ajax(url, {
			dataType: 'json',
			success: function(r) {
				console.log('got tracks', r);
				callback(
					r.tracks.map(function(item) {
						var ret = {
							name: item.name,
							artist: 'Unknown',
							artist_uri: '',
							album: item.album.name,
							album_uri: item.album.uri,
							cover_url: '',
							uri: item.uri
						}
						if (item.artists.length > 0) {
							ret.artist = item.artists[0].name;
							ret.artist_uri = item.artists[0].uri;
						}
						if (item.album.images.length > 0) {
							ret.cover_url = item.album.images[item.album.images.length - 1].url;
						}
						return ret;
					})
				);
			},
			error: function(r) {
				callback({
					word: word,
					tracks: []
				});
			}
		});
	}


	var g_access_token = '';
	var g_username = '';

	var client_id = '';
	var redirect_uri = '';


	if (location.host == 'localhost:8000') {
		client_id = 'd37a9e88667b4fb3bc994299de2a52bd';
		redirect_uri = 'http://localhost:8000/callback.html';
	} else {
		client_id = '6f9391eff32647baa44b1a700ad4a7fc';
		redirect_uri = 'http://lab.possan.se/playlistcreator-example/callback.html';
	}

	var doLogin = function(callback) {
		var url = 'https://accounts.spotify.com/authorize?client_id=' + client_id +
			'&response_type=token' +
			'&scope=playlist-read-private%20playlist-modify%20playlist-modify-private' +
			'&redirect_uri=' + encodeURIComponent(redirect_uri);
		localStorage.setItem('createplaylist-tracks', JSON.stringify(g_tracks));
		localStorage.setItem('createplaylist-name', g_name);
		var w = window.open(url, 'asdf', 'WIDTH=400,HEIGHT=500');
	}

	var parseCSV = function(file, callback) {
		var td = [];
		$.get(file, function(data){
			td = $.csv.toArrays(data);
			console.log("inside parseCSV.get...");
			console.log(td);
		})
			.done(function(){
				console.log("inside parseCSV.done...");
				console.log(td);
				callback(td);
			});
	}

	// var trackdata = parseCSV("id_v_a.csv");
	// console.log("Trackdata 2:");
	// console.log(trackdata);

	var generatePlaylist = function(en, val){
		var trackdata = [];
		parseCSV("id_v_a.csv", function(td){
			trackdata = td;
			console.log("Trackdata:");
			console.log(trackdata);
			var energy = en / 20.0;
			var valence = val / 20.0;
			dist = [];
			trackdata.forEach(function(track, index){
				// Calculate euclidean distance between energy/valence
				dist[index] = Math.sqrt(Math.pow((valence - track[1]), 2) + Math.pow((energy - track[2]), 2));
			});

			var track_ids = [];
			// Find 10 smallest values in dist array
			for (var i = 0; i <10; i++){
				var min = Math.min.apply(null, dist);
				var track_num = dist.indexOf(min);
				track_ids[i] = trackdata[track_num][0];
				dist[track_num] = 10.0;
			}

			getSpotifyTracks(track_ids, function(tracks){
				console.log("Came back with tracks:");
				console.log(tracks);
				var txt = '';
				tracks.forEach(function(found){
					txt += '<div class="media">' +
						'<a class="pull-left" href="#"><img class="media-object" src="' + found.cover_url + '" /></a>' +
						'<div class="media-body">' +
						'<h4 class="media-heading"><a href="' + found.uri + '">' + found.name + '</a></h4>' +
						'Album: <a href="' + found.album_uri + '">' + found.album +
						'</a><br/>Artist: <a href="' + found.artist_uri + '">' + found.artist+'</a>' +
						'</div>' +
						'</div>\n';
				});

				$('#debug').html(txt);
			});
		});

		// txt += '<div class="media">' +
		// 				'<a class="pull-left" href="#"><img class="media-object" src="' + found.cover_url + '" /></a>' +
		// 				'<div class="media-body">' +
		// 				'<h4 class="media-heading"><a href="' + found.uri + '">' + found.name + '</a></h4>' +
		// 				'Album: <a href="' + found.album_uri + '">' + found.album +
		// 				'</a><br/>Artist: <a href="' + found.artist_uri + '">' + found.artist+'</a>' +
		// 				'</div>' +
		// 				'</div>\n';
	}

	exports.startApp = function() {
		console.log('start app.');
		$('#generate').click(function() {
			generatePlaylist($('#energy-slider').val(), $('#valence-slider').val());
		});
		$('#start').click(function() {
			doLogin(function() {});
		});
		$('#energy-slider').mouseup(function(){
			$('#energy-val').text($(this).val());
		});
		$('#valence-slider').mouseup(function(){
			$('#valence-val').text($(this).val());
		});
}

})(window);
