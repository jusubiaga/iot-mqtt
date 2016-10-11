// Sensor recipe
// This file is use to create sensors using Sensor creator
var BLUEMIX_BROKER = 'mqtt://quickstart.messaging.internetofthings.ibmcloud.com:1883';
var MOSQUITTO_BROKER = 'mqtt://test.mosquitto.org:1883';
var MOSQUITTO_LOCAL_BROKER = 'mqtt://localhost:1883';

// Message broker.
var MqttMessageBroker = require('../../messageBroker/mqttMessageBroker.js');
var mqttMessageBroker = new MqttMessageBroker(MOSQUITTO_LOCAL_BROKER,{}); 

// Pin
var DigitalPin = require('../../ioDriver/digitalPinMraa.js');
var AnalogPin = require('../../ioDriver/analogPinMraa.js');
var DigitalPinSim = require('../../ioDriver/digitalPinMock.js');

// Sensor
var DigitalSensor = require('../digitalSensor.js');
var AnalogSensor = require('../analogSensor.js');
var TempSensor = require('../custom/tempSensor.js');
var LcdSensor = require('../custom/lcdSensor.js');

// Configure Device
var sensorList = {};
var pin;
var sensor;
var clientId = '90b68602ab53'; 

// temperature
pin = new AnalogPin();
pin.connect(0);
sensor = new TempSensor(pin, mqttMessageBroker, {name:'Temperature', topicIn: 'sensor/temp/in', topicOut: 'sensor/temp/out', sensingTime: 1000, startSensing: true});
sensor.init();
sensorList[sensor.Name] = sensor;

// Button
pin = new DigitalPin();
pin.connect(2,1)
sensor = new DigitalSensor(pin, mqttMessageBroker, {name:'Button', topicIn: 'sensor/button/in', topicOut: 'sensor/button/out', startSensing: true});
sensor.init();
sensorList[sensor.Name] = sensor;

// Relay
pin = new DigitalPin();
pin.connect(3,0)
sensor = new DigitalSensor(pin, mqttMessageBroker, {name:'Relay', topicIn: 'sensor/relay/in', topicOut: 'sensor/relay/out', startSensing: false});
sensor.init();
sensorList[sensor.Name] = sensor;

// Led
pin = new DigitalPin();
pin.connect(4,0)
sensor = new DigitalSensor(pin, mqttMessageBroker, {name:'Led', topicIn: 'sensor/led/in', topicOut: 'sensor/led/out', startSensing: false});
sensor.init();
sensorList[sensor.Name] = sensor;

pin = new AnalogPin();
pin.connect(0,0)
sensor = new LcdSensor(pin, mqttMessageBroker, {name:'Display', topicIn: 'sensor/display/in', topicOut: 'sensor/display/out', startSensing: false});
sensor.init();
sensorList[sensor.Name] = sensor;


module.exports = sensorList; 

// Device description

var device = {
    id: '90b68602ab53',
    name: 'Edison',
    messageBroker: {
        endpoint: 'mqtt://localhost:1883',
        options: {} 
    },
    
    sensors: [
        {
            name:'Temperature', 
            type: 'TempSensor',
            pin: {
                type: 'AnalogPin',
                number: 0,
                dir: 'out'
            },
            topicIn: 'sensor/temp/in',
            topicOut: 'sensor/temp/out',
            startSensing: true
        },
        {
            name:'Button', 
            type: 'DigitalSensor',
            pin: {
                type: 'DigitalPin',
                number: 2,
                dir: 'out'
            },
            topicIn: 'sensor/button/in',
            topicOut: 'sensor/button/out',
            startSensing: true
        },
        {
            name:'Relay', 
            type: 'DigitalSensor',
            pin: {
                type: 'DigitalPin',
                number: 3,
                dir: 'in'
            },
            topicIn: 'sensor/relay/in',
            topicOut: 'sensor/relay/out',
            startSensing: false
        },
        {
            name:'Led', 
            type: 'DigitalSensor',
            pin: {
                type: 'DigitalPin',
                number: 4,
                dir: 'in'
            },
            topicIn: 'sensor/led/in',
            topicOut: 'sensor/led/out',
            startSensing: false
        },
        {
            name:'Display', 
            type: 'LcdSensor',
            pin: {
                type: 'AnalogPin',
                number: 3,
                dir: 'in'
            },
            topicIn: 'sensor/display/in',
            topicOut: 'sensor/display/out',
            startSensing: false
        }
    ]
}


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
