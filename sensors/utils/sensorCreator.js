"use strict";

var PinCreator = require('./pinCreator.js');

var SensorCreator = (function(){
    function SensorCreator(config){
        this._messageBroker = config.messageBroker;
        this._pinFactory = config.pinCreator;
        this._supportedSensors = config.supportedSensors;
    };
    
    SensorCreator.SENSOR_TYPE = {
        DIGITAL: 1,
        ANALOG: 2            
    };
     
    SensorCreator.prototype.create = function(config){
        // Create Pin
        var pinConfig = {
            pinNumber: config.pinNumber,
            pinDir: config.pinDir
        }
        var pin = this._pinFactory.create(config.type, pinConfig);
        
        // Create Sensor
        var Creator = this._supportedSensors[config.type];
        var sensor = null;
        if (Creator instanceof Function) {
            var sensorConfig = {
                name: config.name,
                topicIn: config.topicIn,
                topicOut: config.topicOut
            }
            sensor = new Creator(pin, this._messageBroker, sensorConfig);
            if (sensor) {
                sensor.init();
            }
        }
        return sensor;
    };
    
    return SensorCreator;
})();

module.exports = SensorCreator;