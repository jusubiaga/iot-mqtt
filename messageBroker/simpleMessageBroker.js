"use strict";

// var SimpleMessageBroker = require('./simpleMessageBroker.js') 
// var simpleMessageBroker = new SimpleMessageBroker();
// var client1 = simpleMessageBroker.connect();
//
// client1.subscribe('topic1'); 

// var client2 = simpleMessageBroker.connect();
//
// client2.subscribe('topic2');

// client1.publish('topic2','hello');

var SimpleClient = require('./simpleClient.js');
var _ = require('underscore');

var SimpleMessageBroker = (function(){
    function SimpleMessageBroker(connectionString, opts){
        this._connectionString = connectionString;
        this._opts = opts;
        this._topicSubscribers = {};
    };
    
    SimpleMessageBroker.prototype.connect = function(){
        var that = this;
        var client = new SimpleClient(this);
        // TODO handle error (try/catch)
        setTimeout(function(){
            client.connect(that._connectionString, that._opts);            
        },0)
        return client;
    };
    
    SimpleMessageBroker.prototype.subscribe = function(client,topic){
        var clients = this._topicSubscribers[topic];
        if (!(clients instanceof Object)) {
            clients = [];
        }
        
        if (clients.indexOf(client) === -1) {
            clients.push(client);
            this._topicSubscribers[topic] = clients;            
        }
    };
    
    SimpleMessageBroker.prototype.publish = function(client, topic,msg){
        var clients = this._topicSubscribers[topic];
        if (clients instanceof Array) {
            for (var i=0; i < clients.length; i++){
                clients[i].receiveMessage(topic,msg);
            }
        }
    };
    
    SimpleMessageBroker.prototype.close = function(){}
    
    return SimpleMessageBroker;
})();

module.exports = SimpleMessageBroker;