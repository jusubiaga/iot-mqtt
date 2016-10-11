'use strict';

var fs = require('fs');
var MqttMessageBroker = require('../messageBroker/mqttMessageBroker.js');

var ThingsLoader = (function(options){
    function ThingsLoader(options) {
        options = options || {};
        this._things = {};        

        this._mqttMessageBroker = null;

        // Pins
        var DigitalPin = null;
        var AnalogPin = null;        
        if(!options.test) {
            DigitalPin = require('../ioDriver/digitalPinMraa.js');
            AnalogPin = require('../ioDriver/analogPinMraa.js');            
        }

        var DigitalPinSim = require('../ioDriver/digitalPinMock.js');
        var AnalogPinSim = require('../ioDriver/analogPinMock.js');
        
        // Things
        var DigitalThing = require('../things/digitalThing.js');
        var AnalogThing = require('../things/analogThing.js');
        var TempThing = require('../things/custom/tempThing.js');
        //var DisplayThing = require('../custom/DisplayThing.js');

        this._pinFactory = {
            'DigitalPin': DigitalPin,
            'AnalogPin': AnalogPin,
            'DigitalPinSim': DigitalPinSim,
            'AnalogPinSim': DigitalPinSim    
        };

        this._thingFactory = {
            'DigitalThing': DigitalThing,
            'AnalogThing': AnalogThing,
            'TempThing': TempThing,
        //    'LcdSensor': LcdSensor
        };

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

        var deviceId = data.id;
        this._mqttMessageBroker = new MqttMessageBroker(data.messageBroker.endpoint,data.messageBroker.options);

        for (var i=0; i<data.things.length; i++) {
            if (!data.things[i].skip) {
                var thing = this._createThing(deviceId, data.things[i]);
                if (thing) {
                    thing.init();
                    this._things[thing.Name] = thing;
                }
            }
        }
    }

    ThingsLoader.prototype._createThing = function(deviceId, config){

        var pinCreator = this._pinFactory[config.pin.type];
        var thingCreator = this._thingFactory[config.type];
        
        if (pinCreator && thingCreator) {
            var pin = new pinCreator();
            var pinDir = config.pin.dir === 'out' ? 1 : 0;
            pin.connect(config.pin.number, pinDir);
            return new thingCreator(pin, this._mqttMessageBroker, {
                name:config.name, 
                topicIn: deviceId + '/' + config.topicIn, 
                topicOut: deviceId + '/' + config.topicOut, 
                sensingTime: config.sensingTime, 
                startSensing: config.startSensing} );
        }
    }

    ThingsLoader.prototype.clean = function() {
        var thingsNames = Object.keys(this._things);
        for(var i=0; i<thingsNames.length; i++) {
            this._things[thingsNames[i]].destroy();
        }
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