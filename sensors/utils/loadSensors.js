var fs = require('fs');
var program = require('commander');

// var BLUEMIX_BROKER = 'mqtt://quickstart.messaging.internetofthings.ibmcloud.com:1883';
// var MOSQUITTO_BROKER = 'mqtt://test.mosquitto.org:1883';
// var MOSQUITTO_LOCAL_BROKER = 'mqtt://localhost:1883';

// WS BlueMix ws://jusu-iotdemo.mybluemix.net/ws/sensors
// https://quickstart.internetofthings.ibmcloud.com/

// Command Line
program
  .version('0.0.1')
  .usage('[options] <file>')
  .option('-f, --file <file>', 'device descriptor file')
  .parse(process.argv);

var sensorList = {};

// Message broker.
var MqttMessageBroker = require('../../messageBroker/mqttMessageBroker.js');
//var MqttMessageBroker = require('../../messageBroker/simpleMessageBroker.js'); 
var mqttMessageBroker = null;

// Pin
var DigitalPin = require('../../ioDriver/digitalPinMraa.js');
var AnalogPin = require('../../ioDriver/analogPinMraa.js');
// var DigitalPin = require('../../ioDriver/digitalPinMock.js');
// var AnalogPin = require('../../ioDriver/analogPinMock.js');

var DigitalPinSim = require('../../ioDriver/digitalPinMock.js');

// Sensor
var DigitalSensor = require('../digitalSensor.js');
var AnalogSensor = require('../analogSensor.js');
var TempSensor = require('../custom/tempSensor.js');
var LcdSensor = require('../custom/lcdSensor.js');

var PinFactory = {
    'DigitalPin': DigitalPin,
    'AnalogPin': AnalogPin,
    'DigitalPinSim': DigitalPinSim
};

var SensorFactory = {
    'DigitalSensor': DigitalSensor,
    'AnalogSensor': AnalogSensor,
    'TempSensor': TempSensor,
    'LcdSensor': LcdSensor
};

function loadFile(){
    var file = program.args[0];
    var data = fs.readFileSync(file, 'utf8');
    try {
        parseData(JSON.parse(data));
    } catch(e) {
        console.log(e)
    }
    
    //console.log(data);
}

function parseData(data) {

    mqttMessageBroker = new MqttMessageBroker(data.messageBroker.endpoint,data.messageBroker.options);
    var clientId = data.id;

    for (var i=0; i<data.sensors.length; i++) {
        if (!data.sensors[i].skip) {
            var sensor = createSensor(data.sensors[i]);
            if (sensor) {
                sensor.init();
                sensorList[sensor.Name] = sensor;
            }
        }
    }
}

function createSensor(config){

    var pinCreator = PinFactory[config.pin.type];
    var sensorCreator = SensorFactory[config.type];
    var sensor = null;
    
    if (pinCreator && sensorCreator) {
        var pin = new pinCreator();
        var pinDir = config.pin.dir === 'out' ? 1 : 0;
        pin.connect(config.pin.number, pinDir);
        sensor = new sensorCreator(pin, mqttMessageBroker, {name:config.name, topicIn: config.topicIn, topicOut: config.topicOut, sensingTime: config.sensingTime, startSensing: config.startSensing} );
    }

    return sensor;

};

function getSensorList() {
    return sensorList;
}

module.exports = getSensorList; 

loadFile();

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
