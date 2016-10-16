// How to use

var IOTMqtt = require('iot-mqtt');
var iotMqtt = new IOTMqtt('123', 
    {
        "name": 'MyDevice',
        "messageBroker": {
            "endpoint": 'mqtt://localhost:1883',
            "options": {}
        },
        "test": true
    }
)

iotMqtt.createThing(
        {
            "name":"Switch", 
            "type": "SwitchThing",
            "pin": {
                "type": "DigitalPinSim",
                "number": 2,
                "dir": "out"
            },
            "topicIn": "thing/switch/in",
            "topicOut": "thing/switch/out",
            "startSensing": true,
            "skip": false
        }
)

var things = iotMqtt.getThings();