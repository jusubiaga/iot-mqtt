"use strict";

var mqtt = require('mqtt');

var MqttMessageBroker = (function(){
    function MqttMessageBroker(connectionString, opts){
        this._connectionString = connectionString;
        this._opts = opts;
    };
    
    MqttMessageBroker.prototype.connect = function(){
        return mqtt.connect (this._connectionString, this._opts);
    }
    
    MqttMessageBroker.prototype.close = function(){}
    
    return MqttMessageBroker;
})();

module.exports = MqttMessageBroker;