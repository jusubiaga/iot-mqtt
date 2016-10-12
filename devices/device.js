'use strict';

var fs = require('fs');
var uuid = require('uuid');
var MqttMessageBroker = require('../messageBroker/mqttMessageBroker.js');


/**
 * Device
 * 
 * Note: pass config.test=true in order to use the Mock Pins.
 */
var Device = (function(){
    function Device(id, config){
        this._id = id;
        this._name = config.name;
        this._mqttMessageBroker = new MqttMessageBroker(config.messageBroker.endpoint,config.messageBroker.options);
        
        this._things = {};

        // Pins
        var DigitalPin = null;
        var AnalogPin = null;        
        if(!config.test) {
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
        
    };

    Device.prototype.addThing = function(thing) {
        if (thing) {
            thing.init();
            this._things[thing.id] = thing;
        }        
    };

    Device.prototype.removeThing = function(thingId) {
        var thing = this._things[thingId];
        if (thing) {
            thing.destroy();
            delete(this._things[thingId]);
        }
    };

    Device.prototype.getThing = function(thingId) {
        return this._things[thingId];
    };

    Device.prototype.getThings = function() {
        return this._things;
    };

    Device.prototype.createThing = function(config){

        var thing = null;

        if (!config.skip) {

            var pinCreator = this._pinFactory[config.pin.type];
            var thingCreator = this._thingFactory[config.type];
            
            if (pinCreator && thingCreator) {
                var pin = new pinCreator();
                var pinDir = config.pin.dir === 'out' ? 1 : 0;
                var thingId = uuid.v1();
                pin.connect(config.pin.number, pinDir);
                thing = new thingCreator(pin, this._mqttMessageBroker, {
                    id: thingId,
                    name: config.name, 
                    topicIn: config.topicIn ? this._id + '/' + config.topicIn : this._id + '/' + thingId + '/in', 
                    topicOut: config.topicOut ? this._id + '/' + config.topicOut : this._id + '/' + thingId + '/out', 
                    sensingTime: config.sensingTime, 
                    startSensing: config.startSensing} );

                if (thing) {
                    thing.init();
                    this._things[thingId] = thing;
                }

            }

        } else {
            console.log('Things skiped !');
        }

        return thing;
    };

    Device.prototype.cleanAllThings = function() {
        var thingsIds = Object.keys(this._things);
        for(var i=0; i<thingsIds.length; i++) {
            this._things[thingsIds[i]].destroy();
        }
        this._things = {}; // clean things
    };

    return Device;
})();

module.exports = Device;