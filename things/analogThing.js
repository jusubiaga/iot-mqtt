'use strict';

var Thing = require('./thing');

var AnalogThing = (function(){
    function AnalogThing(pin, messageBroker, config){
        Thing.call(this, pin, messageBroker, config);
        this._thing = 'ANALOG_THING';
    };
    
    AnalogThing.prototype = new Thing();
    AnalogThing.constructor = AnalogThing;
    
    AnalogThing.prototype.startSensing = function(){
        console.log(this._thing + ' [' + this._name + '] START SENSING ...');
        var that = this;
        this._loopInterval = setInterval(function(){
            var currentValue;
            if (that._sensingFunction instanceof Function) {                
                currentValue = that._sensingFunction.call(that, that._pin.read());
            } else {
                currentValue = that._pin.read();
            }

            if (currentValue !== that._value) {                
                that._value = currentValue;
                console.log('Read value', that._value);
                that.sendMessage(that._value.toString());
            }
        },this._sensingTime);
    };
    
    AnalogThing.prototype.stopSensing = function(){
        console.log(this._thing  + ' [' + this._name + '] STOP SENSING.');
        if(this._loopInterval) {
            clearInterval(this._loopInterval);
        }
    };
    
    return AnalogThing;
    
})();


module.exports = AnalogThing;