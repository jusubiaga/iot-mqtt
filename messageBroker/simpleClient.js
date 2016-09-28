"use strict";

var SimpleClient = (function(){
    function SimpleClient(messageBroker){
        this._messageBroker = messageBroker;
        this._actions = {};
    };

    SimpleClient.prototype.on = function(action,handler) {
        this._actions[action] = handler;
    };
    
    SimpleClient.prototype.connect = function() {
      var onConnect = this._actions['connect'];
        if(onConnect instanceof Function) {
            onConnect.call(this);
        }
    };

    SimpleClient.prototype.subscribe = function(topic) {
        this._messageBroker.subscribe(this, topic);
    };
    
    SimpleClient.prototype.publish = function(topic, msg) {
        this._messageBroker.publish(this,topic,msg);
    };
    
    SimpleClient.prototype.receiveMessage = function(topic, msg) {
        var onMessage = this._actions['message'];
        if (onMessage instanceof Function) {
            onMessage.call(this, topic, msg);
        }
    };
    
    return SimpleClient;
})();

module.exports = SimpleClient;