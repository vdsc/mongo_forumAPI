## Dependencies
* mongodb
* node
* nodemon `npm install -g nodemon`
## Installation
### Starting up mongodb
* `mongod --smallfiles --fork --syslog`
### Installing node dependencies
* `npm install`
### Running the project
* `npm start`
### Run with nodemon(Will continuously re-run upon file changes)
* `npm run watchman`
###
cat ~/.bash_aliases

PORT = 8080
Then go to: [your.domain:PORT/static]() to access the APP

|Endpoint|Description|HTTP Method|
|:-:|:-:|:-:|
|/user/authenticated|Returns a list of all of the users in the database|GET|
|/user/:userId|Returns the user with the id userId|GET|
|/user/:userId|Deletes the user with the id userId|DELETE|
|/user/:userId|Updates the user with the id userId|PUT|
|/user/:userId/setToMod|Sets the role of the user with the id userId to MODERATOR|PUT|
|/user/:userId/setToAdmin|Sets the role of the user with the id userId to ADMIN|PUT|
|/user/:userId/setToUser|Sets the role of the user with the id userId to USER|PUT|
|/comment/user/:userId|Gets all of the comments by the user with the id userId|GET|
|/comment/:commentId|Gets the comment specified by commentId|GET|
|/comment/:commentId|Updates the comment specified by commentId|PUT|
|/comment/:commentId|Deletes the comment specified by commentId|DELETE|
|/forum|Gets all of the forums in the database, including their comments and who made them|GET|
|/forum/:forumId|Gets the forum specified by forumId |GET|
|/forum/:forumId/comments|Gets the comments of the forum specified by forumId |GET|
|/forum|Creates a new forum and returns the forumId|POST|
|/forum/:forumId/newComment|Creates a new comment on the forum specified by forumId|POST|
|/forum/:forumId|Deletes the forum specified by forumId|DELETE|
|/forum/:forumId|Updates the topic of the forum specified by forumId|PUT|
|/forum/topics|Gets a list of forum topics|GET|