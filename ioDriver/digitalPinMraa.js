"use strict";

var mraa = require('mraa');
var Pin = require('./pin.js');

var DigitalPinMraa = (function(){
    function DigitalPinMraa(){
        Pin.call(this);
    };

    DigitalPinMraa.prototype.connect = function(pinNumber, pinDir) {
        this._pin = new mraa.Gpio(pinNumber);
        this._pin.dir(pinDir === 1 ? mraa.DIR_IN : mraa.DIR_OUT);
        console.log('pin %s connected', pinNumber);        
    };
    
    DigitalPinMraa.prototype.read = function(){
        this._value = this._pin.read();
        return this._value;    
    };
    
    DigitalPinMraa.prototype.write = function(value) {
        this._pin.write(value); 
        this._value = value;
        if (this._onChangeCallback instanceof Function) {
            this._onChangeCallback.call(this);
        }
    };
    
    DigitalPinMraa.prototype.onChange = function(handler) {
        this._pin.isr(mraa.EDGE_BOTH, handler);
    };
    
    DigitalPinMraa.prototype.clearOnChange = function() {
        this._pin.isrExit();
    }
    
    return DigitalPinMraa;
})();

module.exports = DigitalPinMraa;