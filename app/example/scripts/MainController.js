var myapp = new angular.module("myapp", []);

myapp.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }]);

myapp.controller("MainCtl",  function($scope, $http){

  var len  = 0;
  $scope.playlists = {};

  $scope.reloadSongs = function(playlist_id){
    $http.get("http://45.55.146.198:3000/playlists/" + playlist_id).then(function(response){
      $scope.songs = response.data.songs;
      $scope.selected = response.data.active_song;
      var playlist_name = response.data.name;
      var playlist_id = response.data.id;
      len = response.data.songs.length;
      console.log(len);

      $scope.playlists[playlist_id] = playlist_name;
      supersonic.logger.info("Reloaded songs for playlists :" + $scope.playlists);

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
      $scope.selected = response.data.active_song;

      supersonic.logger.info("Joined playlist: " + playlist_name + " id: " + playlist_id);
      $scope.playlists[playlist_id] = playlist_name;
    }, function (response){
      supersonic.logger.error("ERROR unable to join playlist: " + response.data);
    });
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

      supersonic.logger.info("Created playlist " + playlist_name + " id " + playlist_id);
      $scope.playlists[playlist_id] = playlist_name;
    }, function (response){
      supersonic.logger.error("ERROR Cannot Create Playlist: " + response.data);
    });
  }
  // $scope.deletePlaylist = function(playlist_id){
  //   var req = {
  //     method = 'DELETE',
  //     url: "http://45.55.146.198:3000/playlists/" + playlist_id
  //   }
  //   $http(req).then(function(response){
  //     console.log("Playlist delete response: " + response.data);
  //   });
  // }

  var upvotedSongList = []
  for(var i=0; i<len; i++) upvotedSongList[i] = false;
  $scope.like = function(idx){
    if(!upvotedSongList[idx]){
       $http.put("http://45.55.146.198:3000/songs/" +$scope.songs[idx].ID+"/upvote").success(function(response){
        $scope.songs = response.songs;
        len = response.songs.length;
        upvotedSongList[idx] = true;
      })
    }
  }

  $scope.add = function() {
    supersonic.logger.info("clicked add song");
  }

  var audio = new Audio();

  audio.src = "https://p.scdn.co/mp3-preview/c58f1bc9160754337b858a4eb824a6ac2321041d";
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
      // $parent.reloadSongs("2");

      }

    }
  }
});
