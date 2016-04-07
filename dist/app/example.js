angular.module('example', [
  // Declare here all AngularJS dependencies that are shared by the example module.
  'supersonic'
]);

angular
  .module('example')
  .controller('LearnMoreController', function($scope, supersonic) {

    $scope.navbarTitle = "Learn More";

  });

angular
  .module('example')
  .controller('SettingsController', function($scope, supersonic) {
    $scope.navbarTitle = "Settings";
  });

function TodoCtrl($scope) {
  
  $scope.todos = [
    {text: 'Jumpman-Drake', done:false, votes: 3},         
    {text: 'American Idiot-Green Day', done:false, votes: 4},
    {text: 'Hey Jude-John Holt', done:false, votes: 7}
  ];
  
  $scope.getTotalTodos = function () {
    return $scope.todos.length;
  };
  
  $scope.upVote = function(song){
    song.votes++;
  };

  $scope.downVote = function(song){
    song.votes--;
    if(song.votes==-5){
        var index = $scope.todos.indexOf(song);
        $scope.todos.splice(index,1);
        }
  };

  $scope.addTodo = function () {
    $scope.todos.push({text:$scope.formTodoText, done:false, votes: 1});
    $scope.formTodoText = '';
  };
  
    $scope.clearCompleted = function () {
        $scope.todos = _.filter($scope.todos, function(todo){
            return !todo.done;
        });
    };
}