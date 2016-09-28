"use strict";

var Pin = require('./pin.js');

var AnalogPinMock = (function(){
    function AnalogPinMock(){
        Pin.call(this);
    };

    AnalogPinMock.prototype = new Pin();
    AnalogPinMock.constructor = AnalogPinMock;
    
    AnalogPinMock.prototype.connect = function(pinNumber) {
        this._pin = {pinNumber:pinNumber};
    };
    
    AnalogPinMock.prototype.read = function(){
        return this._value;
    };

    AnalogPinMock.prototype.write = function(value){
        this._value = value;
    };
    
    return AnalogPinMock;
})();

module.exports = AnalogPinMock;