'use strict';

var Thing = require('./thing');

var DigitalThing = (function(){
    function DigitalThing(pin, messageBroker, config){
        Thing.call(this, pin, messageBroker, config);
        this._thing = 'DIGITAL_THING';
        
        this.addAction('ON', this.on);
        this.addAction('OFF', this.off);        
    };
    
    DigitalThing.prototype = new Thing();
    DigitalThing.constructor = DigitalThing;
    
    DigitalThing.prototype.startSensing = function(){
        console.log(this._thing + ' [' + this._name + '] START SENSING ...');
        var that = this;

        this._pin.onChange(function(){
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
            
            // that._value = that._pin.read();
            // console.log('Read value', that._value);
            // that.sendMessage(that._value.toString());
        });
    };
    
    DigitalThing.prototype.stopSensing = function(){
        console.log(this._thing  + ' [' + this._name + '] STOP SENSING.');
        this._pin.clearOnChange();
    };
    
    DigitalThing.prototype.on = function() {
        this._value = 1;
        this._pin.write(this._value);
        this.sendMessage(this._value.toString());
        console.log(this._thing  + ' [' + this._name + '] ON');
    };

    DigitalThing.prototype.off = function() {
        this._value = 0;
        this._pin.write(this._value);
        this.sendMessage(this._value.toString());
        console.log(this._thing + ' [' + this._name + '] OFF');
    };
    

    return DigitalThing;
    
})();


module.exports = DigitalThing;