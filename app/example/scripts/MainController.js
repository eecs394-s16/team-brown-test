var myapp = new angular.module("myapp", []);

myapp.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }]);

myapp.controller("MainCtl",  function($scope, $http){
  var len  = 0;

  $http.get("http://45.55.146.198:3000/songs").then(function(response){
    $scope.songs = response.data.songs;
    $scope.selected = $scope.songs[0];
    $http.delete("http://45.55.146.198:3000/songs/" + $scope.selected.ID).success(function(response){console.log(response);});
    len = response.data.songs.length;
    console.log(len);
  });

  var upvotedSongList = []
  for(var i=0; i<len; i++) upvotedSongList[i] = false;
  $scope.like = function(idx){
    if(!upvotedSongList[idx]){
       $http.put("http://45.55.146.198:3000/songs/" +$scope.songs[idx].ID+"/upvote").success(function(response){
        $scope.songs = response.songs;
        len = response.songs.length;
        console.log(len);
        upvotedSongList[idx] = true;
      })
    }
  }

  $scope.add = function(){
    var title = prompt("Enter the song's title.");
    if(title == null){
      return;
    }
    var artist = prompt("Enter the sons's artist.");
    if(artist == null){
      return;
    }
    var album = prompt("Enter the song's album.");

    var new_song = {
      "Title" : title,
      "Artist" : artist,
      "Album" : album
    };
    $http.post("http://45.55.146.198:3000/songs", new_song).success(function(response){
      $scope.songs = response.songs;
      len = response.songs.length;
      console.log(len);
    })
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
      heading:'@'
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
    scope: {
      type:'@',
      vertical:'@',
      justified:'@',
    },
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
      }

    }
  }
});
