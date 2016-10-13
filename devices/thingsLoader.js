'use strict';

var fs = require('fs');
var Device = require('./device');

var ThingsLoader = (function(options){
    function ThingsLoader(options) {
        this._options = options;
        this._device = null;
    }

    ThingsLoader.prototype.load = function(file) {
        var data = fs.readFileSync(file, 'utf8');
        try {
            this._parseData(JSON.parse(data));
        } catch(e) {
            console.log(e)
        }
    };

    ThingsLoader.prototype._parseData = function(data) {
        // Create device
        this._device = new Device(data.id, 
            {
                "name": data.name,
                "messageBroker": {
                    "endpoint": data.messageBroker.endpoint,
                    "options": data.messageBroker.options
                },
                "test": this._options && this._options.test
            }
        )

        // Create Things into device
        for (var i=0; i<data.things.length; i++) {
            this._device.createThing(data.things[i]);
        }
    }

    ThingsLoader.prototype.clean = function() {
        if (this._device) {
            this._device.cleanAllThings();
        }
    };

    ThingsLoader.prototype.getDevice = function() {
        return this._device;
    }

    return ThingsLoader;

})();

module.exports = ThingsLoader;

// var loader = require('./thingsLoader.js');
// loader.load() 


// Heating system Example
// var sensorCreateHelper = require('./sensorCreateHelper.js');
// var tempSensor = sensorCreateHelper.create({name:'Temperature', type: 0, pinNumber: 0, pinDir: 0, topicIn: 'sensor/temp/in', topicOut: 'sensor/temp/out', autoStart: true});
// var buttonSensor = sensorCreateHelper.create({name:'Button', type: 1, pinNumber: 2, pinDir: 1, topicIn: 'sensor/button/in', topicOut: 'sensor/button/out', autoStart: true});
// var relaySensor = sensorCreateHelper.create({name:'Relay', type: 1, pinNumber: 3, pinDir: 0, topicIn: 'sensor/relay/in', topicOut: 'sensor/relay/out', autoStart: true});
// var ledSensor = sensorCreateHelper.create({name:'Led', type: 1, pinNumber: 4, pinDir: 0, topicIn: 'sensor/led/in', topicOut: 'sensor/led/out', autoStart: true});


// Example ...
// var sensorCreator = require('./createSensors.js');
// var tempSensor = sensorCreator.create({name:'Temperature', type: 0, pinNumber: 0, pinDir: 0, topicIn: 'sensor/temp/in', topicOut: 'sensor/temp/out', autoStart: true});
// var buttonSensor = sensorCreator.create({name:'Button', type: 1, pinNumber: 2, pinDir: 1, topicIn: 'sensor/button/in', topicOut: 'sensor/button/out', autoStart: true});

// button bluemix
//var buttonSensor = sensorCreator.create({name:'Button', type: 1, pinNumber: 2, pinDir: 1, topicIn: 'iot-2/type/+/id/90b68602ab53/evt/+/fmt/+', topicOut: 'iot-2/evt/status/fmt/json', autoStart: true});

// MAC: 90b68602ab53
// mosquitto_sub -h quickstart.messaging.internetofthings.ibmcloud.com -p 1883 -i a:quickstart:jusu-iotdemo_app -t iot-2/type/+/id/flobble/evt/+/fmt/+
// iot-2/type/+/id/90b68602ab53/evt/+/fmt/+
//module.exports = sensorCreator;


// Example Mock

// var DigitalPinSim = require('../../ioDriver/digitalPinMock.js');
// var pin = new DigitalPinSim();
// pin.connect(13, 'out');
// var DigitalThing = require('../digitalThing.js');
// var MqttMessageBroker = require('../../messageBroker/mqttMessageBroker.js');
// var mqttMessageBroker = new MqttMessageBroker('localhost:1883'); 
// var digitalThing = new DigitalThing(pin, mqttMessageBroker, {name:'digitalThing', topicIn: '/test/in', topicOut: '/test/out', sensingTime: 1000, startSensing: true});