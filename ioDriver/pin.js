"use strict";

var Pin = (function(){
    /** @const */
    var DIR_IN = 1;
    var DIR_OUT = 0;
    
    function Pin(){
        this._pin = null;
        this._value = null;
    };

    Pin.prototype.connect = function(pinNumber) {
        console.log('connect is not implemented yet');
    };
    
    Pin.prototype.read = function(){
        console.log('read is not implemented yet');
    };

    Pin.prototype.write = function(){
        console.log('write is not implemented yet');
    };
    
    return Pin;
})();

module.exports = Pin;