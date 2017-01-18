/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var users = {};

function userLib() {
};

userLib.prototype.addUser = function(userid, userdetails) {
    users[userid] = userdetails;
};

userLib.prototype.setUserName = function(userid, username) {
    for (var key in users) {
        if (key === userid) {
            users[key]['username'] = username;
        }
    }
//    console.log(users);
//    return this.getAllUserNameAndID();
};

userLib.prototype.getAllUserNameAndID = function() {
    var allUsers = [];
    for (var key in users) {
//        console.log(key + " : " + users[key]['username']);
        allUsers.push({'userid': key, 'username': users[key]['username']});// = 
    }
    return allUsers;
};

userLib.prototype.findUserByName = function(name) {
    for (var i = 0; i < usernames.length; i++) {
        if (usernames[i] === name) {
            return i;
        }
    }
    return -1;
};

userLib.prototype.findUserByID = function(ID) {
    for (var i = 0; i < subscribers.length; i++) {
        if (subscribers[i] === ID) {
            return i;
        }
    }
    return -1;
};

module.exports = userLib;