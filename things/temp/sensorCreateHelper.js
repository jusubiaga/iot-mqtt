// SensorCreateHelper
// This file is use to create sensors using Sensor creator
// Should read the sensorDefinition.json and create the sensors in memory.
var BLUEMIX_BROKER = 'mqtt://quickstart.messaging.internetofthings.ibmcloud.com:1883';
var MOSQUITTO_BROKER = 'mqtt://test.mosquitto.org:1883';
var MOSQUITTO_LOCAL_BROKER = 'mqtt://127.0.0.1:1883';

// BlueMix Configuration
var MAC = '90b68602ab53';
var CLIENTID = 'd:quickstart:jusu-iotdemo:' + MAC;


// Options (for old MQTT servers )
// {
//     protocolId: 'MQIsdp',
//     protocolVersion: 3
// }
        
var options = {
	clientId: CLIENTID
}

// Message broker.
var MqttMessageBroker = require('../../messageBroker/mqttMessageBroker.js');
var mqttMessageBroker = new MqttMessageBroker(MOSQUITTO_LOCAL_BROKER,options); 

// Pin Creator
var DigitalPin = require('../../ioDriver/digitalPinMraa.js');
var AnalogPin = require('../../ioDriver/analogPinMraa.js');
var PinCreator = require('./pinCreator.js');
var pinCreator = new PinCreator(
    {supportedPins:
        {
            0:AnalogPin,
            1:DigitalPin
        }
    });

// Sensor Creator
var DigitalSensor = require('../digitalSensor.js');
var AnalogSensor = require('../analogSensor.js');
var SensorCreator = require('./sensorCreator.js')

var config = {
	messageBroker: mqttMessageBroker,
	pinCreator: pinCreator,
	supportedSensors:{
        0: AnalogSensor,
        1: DigitalSensor
	}
}

// Sensor creator instance
var sensorCreator = new SensorCreator(config);

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
module.exports = sensorCreator;