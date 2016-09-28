var Sensor = require('./sensor');

var DigitalSensor = (function(){
    function DigitalSensor(pin, messageBroker, config){
        Sensor.call(this, pin, messageBroker, config);
        this._sensor = 'DIGITAL_SENSOR';
        
        this.addAction('ON', this.on);
        this.addAction('OFF', this.off);        
    };
    
    DigitalSensor.prototype = new Sensor();
    DigitalSensor.constructor = DigitalSensor;
    
    Sensor.prototype.startSensing = function(){
        console.log(this._sensor + ' [' + this._name + '] START SENSING ...');
        var that = this;
        
        this._pin.onChange(function(){
            that._value = that._pin.read();
            console.log('Read value', that._value);
            that.sendMessage(that._value.toString());
        });
    };
    
    Sensor.prototype.stopSensing = function(){
        console.log(this._sensor  + ' [' + this._name + '] STOP SENSING.');
        this._pin.clearOnChange();
    };
    
    DigitalSensor.prototype.on = function() {
        this._value = 1;
        this._pin.write(this._value);
        this.sendMessage(this._value.toString());
        console.log(this._sensor  + ' [' + this._name + '] ON');
    };

    DigitalSensor.prototype.off = function() {
        this._value = 0;
        this._pin.write(this._value);
        this.sendMessage(this._value.toString());
        console.log(this._sensor + ' [' + this._name + '] OFF');
    };
    

    return DigitalSensor;
    
})();


module.exports = DigitalSensor;