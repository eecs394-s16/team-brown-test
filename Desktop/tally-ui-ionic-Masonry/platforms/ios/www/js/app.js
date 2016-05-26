// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform, $rootScope, $state, $location, UserService) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    console.log("state change: from state: " + fromState.name + " to state: " + toState.name);
    console.log(UserService.cookieSet());
        if  (toState.name !== 'app.login' && !UserService.cookieSet()){
          console.log("test")
          console.log(UserService.getUser());
            // $state.go('app.login', {'toState': toState.name, 'toParams': toParams});
            $state.transitionTo('app.login');
            event.preventDefault();
            // $location.url('/collection');
        }
        // else if (UserService.cookieSet()){
        //   console.log(fromState.name);
        //   $state.go('app.collections');
        //   // event.default();
        // }
    });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'CollectionsCtrl'
  })

  // .state('app.login', {
  //   url:'/login',
  //   views: {
  //     'menuContent': {
  //       templateUrl: 'templates/login.html',
  //       controller: 'AppCtrl'
  //     }
  //   }
  // })

  .state('app.collection', {
    url: '/collection/:collectionId',
    views: {
      'menuContent': {
        templateUrl: 'templates/collection.html',
        controller: 'CollectionCtrl'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html',
          controller: 'InteractCtrl'
        }
      }
    })
    .state('app.login', {
      url: '/login',
      params: {
        'toState' : 'collection',
        'toParams' : {}
      },
      views: {
        'menuContent': {
          templateUrl: 'templates/login.html',
          controller: 'LoginCtrl'
        }
      }
    })
    // .state('app.collection', {
    //   url: '/collection',
    //   views: {
    //     'menuContent': {
    //       templateUrl: 'templates/collection.html',
    //       controller: 'CollectionCtrl'
    //     }
    //   }
    // })
  // .state('app.playlists', {
  //     url: '/playlists',
  //     views: {
  //       'menuContent': {
  //         templateUrl: 'templates/playlists.html',
  //         controller: 'CollectionCtrl'
  //       }
  //     }
  //   })

  .state('app.collections', {
    url: '/collection',
    views: {
      'menuContent': {
        templateUrl: 'templates/collections.html',
        controller: 'CollectionsCtrl'
      }
    }
  })

  // .state('app.single', {
  //   url: '/playlists/:playlistId',
  //   views: {
  //     'menuContent': {
  //       templateUrl: 'templates/playlist.html',
  //       controller: 'PlaylistCtrl'
  //     }
  //   }
  // })
  .state('app.item', {
    url: '/collection/:collectionId/:itemId',
    views: {
      'menuContent': {
        templateUrl: 'templates/item.html',
        controller: 'ItemCtrl'
      }
    }
  })
  ;
  // if none of the above states are matched, use this as the fallback

  // $urlRouterProvider.otherwise('/app/collection');

  // $urlRouterProvider.otherwise('/app/search');
// ======
  $urlRouterProvider.otherwise('/app/collection');
});
