
var myapp = new angular.module("myapp", []);

myapp.service('currentPlaylist', function () {
  var currentPlaylistID = 1;

  return {
      getProperty: function () {
          return currentPlaylistID;
      },
      setProperty: function(playlistID) {
          currentPlaylistID = playlistID;
      }
  };
});

myapp.service('searching', function () {
  var searching = false;

  return {
    isSearching: function () {
        // supersonic.logger.info(searching + " is returned.");
        return searching;
    },
    reverse: function () {
        supersonic.logger.info(searching + " is going to be reversed.");

        searching = ! searching;
        return searching;
    }
  };
});

myapp.service('queue', function () {
  var queue = [];
  return {
    getProperty: function () {
      return queue;
    },
    setProperty: function(newQueue) {
      queue = newQueue;
      // window.alert(queue[0].title)
    }
  };
});

myapp.service('likes', function () {
  // map playlist to lists
  // list has each song the user has voted for so far
  var likes = [];
  return {
    addPlaylist: function (playlist_id) {
      likes[playlist_id] = [];
    },
    addLike: function (playlist_id, spotify_id) {
      window.alert(spotify_id);
      if(likes[playlist_id].indexOf(spotify_id) == -1) {
        likes[playlist_id].push(spotify_id);
        return true;
      }
      return false;
    }
  };
});

myapp.config(['$httpProvider', function ($httpProvider) {
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);

myapp.controller("MainCtl",  function($scope, $http, currentPlaylist, searching, queue, likes){

  var len  = 0;
  $scope.playlists = {};
  $scope.songs = [];
  $scope.selected = null;

  $scope.searching = searching;
  $scope.admin = false;

  var audio = new Audio();
  audio.onended = function () {
    supersonic.logger.log($scope.selected.title + " has ended. A new song should be played next.");
    $http.put("http://45.55.146.198:3000/playlists/" + currentPlaylist.getProperty() + "/pop");
  }

  $scope.$on('reloadSongs', function (event, playlist_id){
    supersonic.logger.info("reloading songs now. playlist_id: " + playlist_id);

    if (!playlist_id) { return };

    $scope.reloadSongs(playlist_id);
    supersonic.logger.info("done reloading songs");
  });

  $scope.reloadSongs = function(playlist_id){
    $http.get("http://45.55.146.198:3000/playlists/" + playlist_id).then(function(response){
      $scope.songs = response.data.songs;
      $scope.selected = response.data.active_song;
      // $scope.selected = response.data.songs[0];
      var playlist_name = response.data.name;
      var playlist_id = response.data.id;
      len = response.data.songs.length;
      // console.log(len);
      // supersonic.logger.info(currentPlaylist.getProperty() + " should be null.");
      currentPlaylist.setProperty(playlist_id);
      queue.setProperty($scope.songs);
      // supersonic.logger.info("Current Playlist ID set to " + currentPlaylist.getProperty() + ".");
      $scope.playlists[playlist_id] = playlist_name;
      supersonic.logger.info("Reloaded songs for playlist :" + playlist_name);

    }, function(response){
      supersonic.logger.error("ERROR Could not reload songs. name: " + playlist_name + " id: " + playlist_id);
    });
  }

  // $scope.reloadSongs();

  $scope.joinPlaylist = function(playlist_id){

    $http.get("http://45.55.146.198:3000/playlists/" + playlist_id).then(function (response){
      playlist_id = response.data.id;
      playlist_name = response.data.name;
      $scope.songs = response.data.songs;
      if (response.data.active_song != null){
         $scope.selected = response.data.active_song;

      likes.addPlaylist(playlist_id);


      $http.get("https://api.spotify.com/v1/tracks/" + response.data.active_song.spotify_id).then(function(resp){
        audio.src = resp.data.preview_url;
        // supersonic.logger.info(audio.src);

        $http.get("https://api.spotify.com/v1/tracks/" + response.data.active_song.spotify_id).then(function(resp){
          audio.src = resp.data.preview_url;
          successfullypersonic.logger.info(audio.src);

        });
      }

      supersonic.logger.info("Joined playlist: " + playlist_name + " id: " + playlist_id);
      $scope.playlists[playlist_id] = playlist_name;
      currentPlaylist.setProperty(playlist_id);
      queue.setProperty($scope.songs);
      supersonic.logger.info("Current Playlist ID set to " + currentPlaylist.getProperty() + ".");
      window.alert(playlist_name + " joined.")
    }, function(response){
      window.alert("Playlist ID doesn't exist.");
      supersonic.logger.error("ERROR unable to join playlist: " + response.data);
    });

    var exampleSocket = new WebSocket("ws://45.55.146.198:3000/ws/playlists/"+playlist_id);

    exampleSocket.onmessage = function(response){
      console.log("we are in ws onmessage");
      var data = JSON.parse(response.data);
      // console.log(data.songs);
      $scope.$apply(function(){
        $scope.songs = data.songs;
        queue.setProperty($scope.songs);
        if(data.active_song.id != $scope.selected.id){
          $scope.selected = data.active_song;
          $http.get("https://api.spotify.com/v1/tracks/" + data.active_song.spotify_id).then(function(resp){
            audio.src = resp.data.preview_url;

            supersonic.logger.info(audio.src);

          });
        }
      })
    }
  }

  $scope.createPlaylist = function(playlist_name){
    var newPlaylist = {
      "name" : playlist_name
    };
    $http.post("http://45.55.146.198:3000/playlists", newPlaylist).then(function (response){
      var playlist_id = response.data.id;
      var playlist_name = response.data.name;


      $scope.songs = response.data.songs;
      $scope.selected = response.data.active_song;
      likes.addPlaylist(playlist_id);

      supersonic.logger.info("Created playlist " + playlist_name + " id " + playlist_id);
      $scope.playlists[playlist_id] = playlist_name;
      currentPlaylist.setProperty(playlist_id);
      queue.setProperty($scope.songs);
      supersonic.logger.info("Current Playlist ID set to " + currentPlaylist.getProperty() + ".");
      window.alert(playlist_name + " created. Join ID: " + playlist_id);

      var exampleSocket = new WebSocket("ws://45.55.146.198:3000/ws/playlists/"+playlist_id);

      exampleSocket.onmessage = function(response){
        console.log("we are in ws onmessage");
        var data = JSON.parse(response.data);
        // console.log(data.songs);
        $scope.$apply(function(){
          supersonic.logger.log($scope.active_song + " what is this?");
          if ($scope.selected == undefined && $scope.songs.length == 0 && data.songs.length == 1) {
            supersonic.logger.log("First song of this playlist is added.");
            $http.put("http://45.55.146.198:3000/playlists/" + currentPlaylist.getProperty() + "/pop").then(function(response){
              $http.get("https://api.spotify.com/v1/tracks/" + response.data.active_song.spotify_id).then(function(resp){
                audio.src = resp.data.preview_url;
                supersonic.logger.info(audio.src + "First audio src is set.");
                // audio.play();
              });
          });
            
            // supersonic.logger.info(audio.src);
            // $http.get("https://api.spotify.com/v1/tracks/" + data.active_song.spotify_id).then(function(resp){
            //   audio.src = resp.data.preview_url;
            //   supersonic.logger.info(audio.src + "First audio src is set.");
            //   audio.play();
            // });

            return;
          }

          $scope.songs = data.songs;
          $scope.reloadSongs(playlist_id);

          if($scope.selected != undefined && data.active_song.id != $scope.selected.id){
            $scope.selected = data.active_song;
            $http.get("https://api.spotify.com/v1/tracks/" + data.active_song.spotify_id).then(function(resp){
              audio.src = resp.data.preview_url;
              supersonic.logger.info(audio.src + "audio src is set with active.");
              audio.play();
              // $scope.player();
            });
          }
        })
      }

    }, function (response){
      window.alert("Error creating playlist.");
      supersonic.logger.error("ERROR Cannot Create Playlist: " + response.data);
    });
  }

  $scope.deletePlaylist = function(playlist_id){

    $http.delete("http://45.55.146.198:3000/playlists/" + playlist_id).then(function (response){
      currentPlaylist.setProperty(-1);
      queue.setProperty($scope.songs);
      supersonic.logger.info("Playlist " + response.data.deleted + " deleted successfully");
    }, function (response){
      supersonic.logger.error("ERROR Could not delete playlist");
    });
  }

  $scope.like = function(idx){
    var id;
    for( i = 0; i < $scope.songs.length; i++) {
      if($scope.songs[i].spotify_id == idx) {
        id = i;
        break;
      }
    }
    var added = likes.addLike(currentPlaylist.getProperty(), idx);
    if(added){
       $http.put("http://45.55.146.198:3000/songs/" +$scope.songs[id].id+"/upvote").success(function(response){
        $scope.songs = response.songs;
        queue.setProperty($scope.songs);
        len = response.songs.length;
      })
    }
  }

    $scope.$on("duplicateSong", function (event, idx) {
      $scope.like(idx);
    });

  

  $scope.add = function() {
    supersonic.logger.info("clicked add song");
  }

  // audio.src = "https://p.scdn.co/mp3-preview/c58f1bc9160754337b858a4eb824a6ac2321041d";
  $scope.player = function(){
    if($scope.play){
      $scope.play = false;
      audio.pause();
    }
    else{
      $scope.play = true;
      audio.play();
    }
  }

});

myapp.controller('NavCtrl', function($scope) {
  $scope.state = false;

  $scope.toggleState = function() {
    $scope.state = !$scope.state;
  };
});

myapp.directive('sidebarDirective', function() {
  return {
    link: function (scope, element, attr) {
      scope.$watch(attr.sidebarDirective, function(newVal) {
        if(newVal) {
          element.addClass('show');
          return;
        }
        element.removeClass('show');
      });
    }
  };
});

myapp.directive('tab', function() {
  return {
    restrict: 'E',
    transclude: true,
    template: '<div role="tabpanel" ng-show="active" ng-transclude></div>',
    require: '^tabset',
    scope: {
      heading:'@',
    },
    link: function(scope, elem, attr, tabsetCtrl) {
      scope.active = false

      scope.disabled = false
      if(attr.disable) {
        attr.$observe('disable', function(value) {
          scope.disabled = (value !== 'false')
        })
      }

      scope.playlistID = false
      if(attr.playlistid) {
        attr.$observe('playlistid', function(value) {
          scope.playlistID = value
        })
      }

      tabsetCtrl.addTab(scope)
    }
  }
});

myapp.directive('tabset', function() {
  return {
    restrict: 'E',
    transclude: true,
    // scope: {
    //   type:'@',
    //   vertical:'@',
    //   justified:'@',
    // },
    scope: false,
    templateUrl: 'tabset.html',
    bindToController: true,
    controllerAs: 'tabset',
    controller: function() {
      var self = this
      self.tabs = []
      self.addTab = function addTab(tab) {
        self.tabs.push(tab)

        if (self.tabs.length == 1) {
          tab.active = true;
        }
      }

      self.classes = {}
      if (self.type == 'pills') {
        self.classes['nav-pills'] = true
      } else {
        self.classes['nav-tabs'] = true
      }

      if (self.justified) {
        self.classes['nav-justified'] = true
      }
      if (self.vertical) {
        self.classes['nav-stacked'] = true
      }

      self.select = function(selectedTab) {

        if (selectedTab.disabled) { return }

        angular.forEach(self.tabs, function(tab){
          if(tab.active && tab != selectedTab) {
            tab.active = false;
          }
        })

      selectedTab.active = true;

      // self.$parent.reloadSongs(currentPlaylist.getProperty());

      }

    }
  }
});


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

  // myapp.config(['$httpProvider', function ($httpProvider) {
  //           $httpProvider.defaults.useXDomain = true;
  //           delete $httpProvider.defaults.headers.common['X-Requested-With'];
  //       }]);

  myapp.controller("InstantSearchController",function($scope, $http, currentPlaylist, searching, queue, likes){

    $scope.searching = searching;

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
        supersonic.logger.info(trackToAdd.id);
        var new_song = {
          "title" : String(trackToAdd.name),
          "artist" : String(trackToAdd.artists[0].name),
          "album" : String(trackToAdd.album.name),
          "album_art" : String(trackToAdd.album.images[0].url),
          "spotify_id" : String(trackToAdd.id)
        };
        var current_queue = queue.getProperty();
        var songExists = false;
        // window.alert("1")
        // // window.alert("current queue is " + current_queue)
        for (i = 0; i < current_queue.length; i++) {
          if (new_song.spotify_id == current_queue[i].spotify_id) {
            songExists = true;
          }
        }
        if (!songExists) {
          supersonic.logger.info(currentPlaylist.getProperty() + " is the current PlaylistID.");
          var playlist_id = currentPlaylist.getProperty();
          var post_url = "http://45.55.146.198:3000/playlists/"+playlist_id+"/songs";
          supersonic.logger.info("post url: " + post_url);
          $http.post(post_url, new_song).then(function(response){
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
            // var new_song = response.data;
            supersonic.logger.info("added song: " + String(new_song.title));
            window.alert(String(new_song.title) + " is added to the Playlist with ID " + currentPlaylist.getProperty() + ".");
            $http.get("http://45.55.146.198:3000/playlists/" + playlist_id).then(function(response){
              queue.setProperty(response.data.songs);
              // supersonic.logger.info("Reloaded songs for playlist :" + playlist_name);

            }, function(response){
              supersonic.logger.error("ERROR Could not reload songs after add");
            });
          }, function(response){
            var new_song = response.data;
            supersonic.logger.error("ERROR failed to add song: " + String(new_song.title));
          });
        } else {
          $scope.$emit("duplicateSong", new_song.spotify_id);
        }

      }, function(response){
        supersonic.logger.error("ERROR failed to get spotify track: " + response.data);
      });
    }
  });
