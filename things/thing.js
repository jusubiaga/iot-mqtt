'use strict';

var MQTT_CONNECTION_STRING = 'mqtt://127.0.0.1:1883';
//var MQTT_CONNECTION_STRING = 'mqtt://test.mosquitto.org';


var Thing = (function(){
    var LOOP_INTERVAL_TIME = 100; // millieconds
    function Thing(pin, messageBroker, config){
        this._thing = 'GENERIC';

        this._id = null;
        this._deviceId = null;
        this._name = null;
        this._type = null;
        this._topicIn = null;
        this._topicOut = null;
        this._value = 0;
        
        this._loopInterval = null;
        this._sensingTime;
        this._sensingFunction = null;
        this._startSensing = false;

        this._interval = null;
        this._actions = [];
                
        this._pin = pin;
        this._messageBroker = messageBroker;
        this._messageBrokerClient = null;
        
        if(config) {
            this._configure(config);
        }
        
    };

    Object.defineProperties(Thing.prototype,{
        Id: {
            get: function() {
                return this._id;
            }
        },
        Pin:{
          get: function(){
              return this._pin;
          }  
        },
        Name: {
            get: function() {
                return this._name;
            }
        },
        Type: {
            get: function() {
                return this._type;
            }
        },
        TopicIn: {
            get: function(){
                return this._topicIn;
            }
        },
        TopicOut: {
            get: function(){
                return this._topicOut;
            }
        },
        Value: {
            get: function(){
                return this._value;
            }
        }
    });

    Thing.prototype._configure = function(config) {
        this._id = config.id;
        this._deviceId = config.deviceId;
        this._name = config.name;
        this._type = config.type;
        this._topicIn = config.topicIn;
        this._topicOut = config.topicOut;
        this._sensingTime = config.sensingTime || LOOP_INTERVAL_TIME;
        this._sensingFunction = config.sensingFunction;
        this._startSensing = !!config.startSensing;
        
        this.addAction('STARTSENSING', this.startSensing);
        this.addAction('STOPSENSING', this.stopSensing);
    }

    Thing.prototype.init = function(){
        var that = this;

        // Message Broker connection (MQTT)    
        this._messageBrokerClient  = this._messageBroker.connect();

        // Set Listening topic
        this._messageBrokerClient.on('connect', function () {
            console.log(that._thing + ' [' + that._name + '] ' + 'connected to MQTT broker. ' + 'TOPIC: [' + 'IN:' + that._topicIn + ', OUT:' + that._topicOut + ']');
            // add for bluemix {clientId: 'd:quickstart:jusu-iotdemo:90b68602ab53'}
            that._messageBrokerClient.subscribe(that._topicIn);
            that.sendMessage('Thing is Ready');
        });

        // Messages
        this._messageBrokerClient.on('message', function (topic, message) {
            console.log('Thing [' + that._name + '] receiving message: %s %s', topic, message);
            var action=null;
            var params=null;
            try {
                var jsonMsg = JSON.parse(message);
                action = jsonMsg.action;
                params = jsonMsg.params;
            }catch(e) {
                action = message.toString().trim();
            }
            
            that.executeAction(action, params);
        });
        
        this._messageBrokerClient.on('close',function(){
            console.log('stop thing');
        });
        
        // Auto start
        if (this._startSensing) {
            this.startSensing();
        }

    };
    
    Thing.prototype.sendMessage = function(payload){
        // TODO build the event message.
        // { "topic": "iot-2/type/nodered-version0.13.4-git/id/90b68602ab53/evt/update/fmt/json", "payload": { "d": { "temp": 17, "humidity": 55, "location": { "longitude": -98.49, "latitude": 29.42 } } }, "deviceId": "90b68602ab53", "deviceType": "nodered-version0.13.4-git", "eventType": "update", "format": "json", "_msgid": "69a7a1f.f96586" }        
        var msg = {
            msgid: 'TBD',
            thingId: this._id,
            deviceId: this._deviceId,
            deviceType: 'NA',
            eventType: 'update',
            topic: this._topicOut,
            payload: {data: payload},
            format: 'json'
        };
        this._messageBrokerClient.publish(this._topicOut, JSON.stringify(msg));
        console.log('Thing [' + this._name + '] sending message: %s %s', this._topicOut, msg);
    };
    
    Thing.prototype.startSensing = function(){
        console.log('startSensing is not implemented.');
    };
    
    Thing.prototype.stopSensing = function(){
        console.log('stopSensing not implemented.');
    };
        
    Thing.prototype.addAction = function(action, handler){
        this._actions[action] = handler;
    };

    Thing.prototype.executeAction = function(action, args) {
        var action = this._actions[action];
        if(action instanceof Function) {
            action.apply(this,args);
        }
    };

    Thing.prototype.destroy = function() {
        this._messageBrokerClient.end();
        console.log('Destroying thing ' + this._name);
    };
        
    return Thing;
    
})(); 
    
module.exports = Thing;