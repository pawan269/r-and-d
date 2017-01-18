/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function RedisLib() {
};

application.prototype.createChannel = function(_packet) {
    subscriber.subscribe(_packet.message);
    bothusers = _packet.message.split("-");
    var secondSubscriber = getRedisSubscriberByID(bothusers[1]);
    secondSubscriber.subscribe(_packet.message);
//    console.log(bothusers);
};

application.prototype.getRedisSubscriberByID = function(userid) {
    for (var key in users) {
        if (key === userid) {
            return users[key]['client'];
        }
    }
    return -1;
};