"use strict";

var MessageBrokerProxy = (function(){
    function MessageBrokerProxy(broker, connectionString, opts){
        this._connectionString = connectionString;
        this._opts = opts;
    };
    
    MessageBrokerProxy.prototype.connect = function(){
        retunr broker.connect (this._connectionString, this._opts);
    }
    
    MessageBrokerProxy.prototype.close = function(){}
    
    return MessageBrokerProxy;
})();

module.exports = MessageBrokerProxy;