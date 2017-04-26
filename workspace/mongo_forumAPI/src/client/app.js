// var username = $('#user').html();
// console.log(username);


var thisView = angular.module('rbac', ['ngRoute'])

thisView.config(function($routeProvider) {
  // $routeProvider.when('/', {
  //   templateUrl: '/client/index.html',
  //   controller: 'topicCtrl'
  // });
  $routeProvider.when('/topics', {
    templateUrl: './partialtemplates/topic.html',
    controller: 'topicCtrl'
  });
  $routeProvider.when('/comments/show/:topic_id/:post_id', {
    templateUrl: '/template/comment.html',
    controller: 'commentCtrl'
  });
  $routeProvider.when('/login', {
    templateUrl: './login.html',
    controller: 'loginCtrl'
  });
  $routeProvider.when('/signup', {
    templateUrl: './signup.html',
    controller: 'signUpCtrl'
  });
  
  $routeProvider.when('/posts/show/:topic_id', {
    templateUrl: './partialtemplates/comment.html',
    controller: 'commentCtrl'
  });
  $routeProvider.when('/comments/show/:topic_id/:post_id', {
    templateUrl: './partialtemplates/comment.html',
    controller: 'commentCtrl'
  });
  // $routeProvider.when('/profile/', {
  //   controller: 'profileCtrl'
  // });
});

// thisView.controller('profileCtrl', ['$scope', '$http', function($scope, $http)
//   var user = $scope.user;
//   console.log(user);

// }
// ]);

thisView.controller('topicCtrl', ['$scope', '$http', 'authFuncs', function($scope, $http, authFuncs) {
    //$scope.username = username;
    $scope.user = authFuncs.getUser();
    $scope.topics = [];
    $http.get("/forum/topics").success(function(topics){
      // $scope.topics = topics;
      if(topics.success){
        topics.results.map(function(object){
          $scope.topics.push(object)
        })
      }
    });
    
    $scope.buttonEditMode = function(){
      if($scope.user.role == 'ADMIN'){
        return true;
      }else{
        return false;
      }
    }
    
    // $http.get("/profile").success(function(req,res) {
    //     $scope.username = res.body.username;
    // })
    // console.log($scope.username);
    $scope.savetopic = function(topic){
      if (topic.hasOwnProperty('_id')){
        $http.put("/forum/"+topic._id, topic).success(function(topic){
          console.log("topic saved: ",topic);
        });
      }
    };
    
    $scope.toggleEditMode = function(repeatScope){
      if (!!repeatScope.editMode){
        repeatScope.editMode = false;
      } else {
        repeatScope.editMode = true;
      }
    };
    
    $scope.destroy = function(topic){
      if (topic.hasOwnProperty('_id')){
        $http.delete("/forum/"+topic._id).success(function(){
          var index = $scope.topics.indexOf(topic);
          if (index > -1){
            $scope.topics.splice(index, 1);
          }
        });
      }
    };
    
    $scope.addtopic = function(){
      var newtopic = {topic: $scope.topic || "null"};
      newtopic.createdBy = $scope.user.id
      $http.post("/forum", newtopic).success(function(topic){
        $scope.topics.push(topic.results);
        $scope.topic = '';
      });
    };
}]);


// thisView.controller('postCtrl', ['$scope', '$http','$routeParams', function($scope, $http, $routeParams) {
//     $scope.topic_id = $routeParams.topic_id;
//     $scope.posts = [];
//     $scope.user = user;
//     // show topic name
//     $http.get("/forum/"+ $scope.topic_id).success(function(response){
//       if(response.success){
//         $scope.topic_name = response.results.topic
//         console.log(response.results)
//         $scope.username = response.results.createdBy.username
//         $scope.posts = response.results.comments.map(function(comment){
//           'use strict'
//           let thisComment = comment;
//           thisComment.title = comment.comment
//           thisComment.author = comment.user == null ? "DELETED" : comment.user.username
//           thisComment.date = comment.createdAt
//           return thisComment;
//         })
//       }
//     });
    
//     $scope.showVar = false;
//     $scope.formshow = function(){
//       $scope.showVar = !$scope.showVar;
//       if($scope.showVar == false){
//         $('textarea').val('');
//       }
//     }
//     $scope.buttonEditMode = function(){
//       if($scope.username == 'admin' || $scope.username == 'moderator' || $scope.username == 'author'){
//         return true;
//       }else{
//         return false;
//       }
//     }
    
//     $scope.createPost = function(){
//       var newpost = {
//         topic_id: $scope.topic_id,
//         title: $scope.title,
//         content: $scope.content,
//         author:$scope.username
//       };
//       $http.post("/posts/show/"+$scope.topic_id, newpost).success(function(post){
//         $scope.posts.push(post);
//         $scope.title = '';
//         $scope.content = '';
//       });
      
//     };
    
//     $scope.deletePost = function(post){
//       if (post.hasOwnProperty('_id')){
        
//         $http.delete('/posts/show/'+ $scope.topic_id+'/'+post._id).success(function(document){
//           var index = $scope.posts.indexOf(post);
//           if (index > -1){
//             $scope.posts.splice(index, 1);
//           }
//         });
//         // $scope.posts=[];
//       }
//     };
// }]);

thisView.controller('loginCtrl', ['$scope', '$http','$location', '$window', 'authFuncs', function($scope, $http, $location, $window, authFuncs){
  $scope.userModel = {};
  authFuncs.reset()
  $scope.onLogin = function(isValid){
    'use strict'
    if(isValid){
      console.log("Valid user")
      let authUser = $scope.userModel
      $http.post("/user/login",authUser)
      .then(function success(response) {
          var thisUser = {}
          thisUser.username = $scope.userModel.username
          thisUser.role = response.data.role
          thisUser.id = response.data.id
          authFuncs.saveAuth(thisUser, response.data.token)
          $location.path('/topics')//Redirect to topics
        },
      function error(response){
        delete $window.sessionStorage.token
        delete $window.sessionStorage.user
        console.log(response.data)
      })
    }
  }
}]);

// thisView.controller('signupCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
//     $scope.newUserModel = {};
//     console.log($routeParams, $http)
    
//     $scope.onSignup = function(isValid){
//       'use strict'
//       if(isValid){
//         console.log("Valid user")
//         let authUser = $scope.newUserModel
//         // $http.post("https://mongo-forum-ekhaemba.c9users.io/user/register", authUser, function(res){
//         //   console.log("hi")
//         //   console.log(res)
//         // })
//         // $scope.newUserModel.password = '';
//         // $scope.newUserModel.username = '';
//         $http.get("https://mongo-forum-ekhaemba.c9users.io/user/authenticated")
//         .then(function(response) {
//           return response;
//         })
//         .catch(function(response) {
//           console.log(response);
//         });
//       }
//     }
// }]);

thisView.controller('signUpCtrl', function($scope, $http){
  $scope.showSuccessAlert = false;
  $scope.switchBool = function(boolVal){
    $scope[boolVal] = !$scope[boolVal]
  }
  $scope.successAlertText = 'Registered!'
  $scope.newUserModel = {};
  $scope.onSignup = function(isValid){
    'use strict'
    if(isValid){
      console.log("Valid user")
      let authUser = $scope.newUserModel
      $http.post("/user/register",authUser)
      .then(function(response) {
        $scope.newUserModel.password = '';
        $scope.newUserModel.username = '';
        let thisResponse = response.data
        if(thisResponse.success){
          $scope.showSuccessAlert = true;
        }
      })
      .catch(function(response) {
        console.log(response);
      });
    }
  }
});

thisView.controller('commentCtrl', ['$scope', '$http','$routeParams','authFuncs', function($scope, $http, $routeParams, authFuncs) {
    $scope.topic_id = $routeParams.topic_id;
    $scope.user = authFuncs.getUser()
    
    $scope.comments = [];
    // show topic name
    $http.get("/forum/"+ $scope.topic_id).success(function(response){
      'use strict'
      if(response.success){
        let thisResults = response.results;
        $scope.title = thisResults.topic
        $scope.userCreated = thisResults.createdBy.username
        $scope.date = thisResults.createdAt
        $scope.comments = thisResults.comments.map(function(comment){
          'use strict'
          let thisComment = comment;
          thisComment.comment = comment.comment
          thisComment.username = comment.user == null ? "DELETED" : comment.user.username
          thisComment.date = comment.createdAt
          thisComment.id = comment._id
          return thisComment;
        })
      }
    });
    
    $scope.buttonEditMode = function(comment){
      if($scope.user.role == 'ADMIN' || $scope.user.username == comment.username){
        return true;
      }else{
        return false;
      }
    }
    
    $scope.createComment = function(){
      'use strict'
      let thiscomment = {
        comment: $scope.newcomment,
        user: $scope.user.id
      };
      
      $http.post("/forum/"+$scope.topic_id+'/newComment', thiscomment).success(function(response){
        'use strict'
        let comment = response.results
        let thisComment = {}
        thisComment.comment = comment.comment
        thisComment.username = comment.user == null ? "DELETED" : comment.user.username
        thisComment.date = comment.createdAt
        thisComment.id = comment._id
        $scope.comments.push(thisComment);
        $scope.newcomment = '';
      });
    };
    
    $scope.deleteComment = function(comment){
      if (comment.hasOwnProperty('id')){
        $http.delete('/forum/'+$scope.topic_id+'/comment/'+comment.id).success(function(document){
          var index = $scope.comments.indexOf(comment);
          if (index > -1){
            $scope.comments.splice(index, 1);
          }
        });
      }
    };
}]);

thisView.factory('authInterceptor', ['$rootScope', '$q', '$window','authFuncs',function ($rootScope, $q, $window, authFuncs) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers.Authorization = 'JWT ' + $window.sessionStorage.token;
      }
      return config;
    },
    responseError: function(rejection) {
            if (rejection.status === 401) {
                // Something like below:
                authFuncs.failedAuth()
            }
            return $q.reject(rejection);
        }
  };
}]);

thisView.factory('authFuncs', [ '$location', '$window', function($location, $window) {
    return {
        failedAuth: function() {
            delete $window.sessionStorage.token
            delete $window.sessionStorage.user
            $location.path("/login")
        },
        saveAuth : function(user, token){
            $window.sessionStorage.setItem('user', JSON.stringify(user));
            $window.sessionStorage.setItem('token', token);
        },
        confirmSession : function(){
          return !!$window.sessionStorage.token  && !!$window.sessionStorage.user
        },
        getUser : function(){
          return $window.sessionStorage.user ? JSON.parse($window.sessionStorage.user) : "";
        },
        reset : function(){
          delete $window.sessionStorage.token
          delete $window.sessionStorage.user
        }
    };
}]);

thisView.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});
