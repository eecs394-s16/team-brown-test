  var myapp = angular.module("myapp", []);

  var searchStr = "";

  myapp.filter('searchFor', function(){

  // All filters must return a function. The first parameter
  // is the data that is to be filtered, and the second is an
  // argument that may be passed with a colon (searchFor:searchString)

    return function(arr, searchString){
      if (!!searchString)
        searchStr = searchString.split(' ').join('+');
      return arr;
    };
  });

  myapp.config(['$httpProvider', function ($httpProvider) {
            $httpProvider.defaults.useXDomain = true;
            delete $httpProvider.defaults.headers.common['X-Requested-With'];
        }]);

  myapp.controller("InstantSearchController",function($scope, $http){

    $scope.updateResult = function() {
      if (!!searchStr) {
        $http.get("https://api.spotify.com/v1/search?q="+searchStr+"&limit=15&type=track").then(function(response){
          $scope.items = response.data.tracks.items;
        });
      }
    }

    $scope.addSong = function(trackID) {
      $http.get("https://api.spotify.com/v1/tracks/"+trackID).then(function(response){
        var trackToAdd = response.data;
        console.log(trackToAdd.id)
        var new_song = {
          "Title" : trackToAdd.name,
          "Artist" : trackToAdd.artists[0].name,
          "Album" : trackToAdd.album.name,
          "Spotify_id" : trackToAdd.id
        };

        var playlist_id = "2";

        $http.post("http://45.55.146.198:3000/playlists/"+playlist_id+"/songs", new_song).success(function(){
          // Pop up "{trackName} is added to the Playlist!"
              // $mdDialog.show(
              //   $mdDialog.alert()
              //     .parent(angular.element(document.querySelector('#popupContainer')))
              //     .clickOutsideToClose(true)
              //     .title(trackToAdd.name + " is Added to Queue!")
              //     // .textContent('You can specify some description text in here.')
              //     // .ariaLabel('Alert Dialog Demo')
              //     .ok('Got it!')
              //     // .targetEvent(ev)
              // );
          window.alert(new_song.Title + " is added to the Playlist!");
        })
      });
    }
  });