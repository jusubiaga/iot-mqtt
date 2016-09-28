"use strict";

var Pin = require('./pin.js');

var DigitalPinMock = (function(){
    function DigitalPinMock(){
        Pin.call(this);
        
        this._onChangeCallback = null; 
    };
    
    DigitalPinMock.prototype = new Pin();
    DigitalPinMock.constructor = DigitalPinMock;

    DigitalPinMock.prototype.connect = function(pinNumber, pinDir) {
        this._pin = {pinNumber: pinNumber, pinDir: pinDir};
    };
    
    DigitalPinMock.prototype.read = function(){
        return this._value;    
    };
    
    DigitalPinMock.prototype.write = function(value) {
        if (this._value !== value) {
            this._value = value;
            if (this._onChangeCallback instanceof Function) {
                this._onChangeCallback.call(this);
            }
        }
    };
    
    DigitalPinMock.prototype.onChange = function(handler) {
        this._onChangeCallback = handler;
    };
    
    DigitalPinMock.prototype.clearOnChange = function() {
        this._onChangeCallback = null;
    }
    
    return DigitalPinMock;
})();

module.exports = DigitalPinMock;