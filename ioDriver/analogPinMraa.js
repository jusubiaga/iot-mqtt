"use strict";

var mraa = require('mraa');
var Pin = require('./pin.js');

var AnalogPinMraa = (function(){
    function AnalogPinMraa(){
        Pin.call(this);
    };

    AnalogPinMraa.prototype = new Pin();
    AnalogPinMraa.constructor = AnalogPinMraa;
    
    AnalogPinMraa.prototype.connect = function(pinNumber) {
        this._pin = new mraa.Aio(pinNumber);
        console.log('pin %s connected', pinNumber);        
    };
    
    AnalogPinMraa.prototype.read = function(){
        this._value = this._pin.read();
        return this._value;
    };
    
    return AnalogPinMraa;
})();

module.exports = AnalogPinMraa;