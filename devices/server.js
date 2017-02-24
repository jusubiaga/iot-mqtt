'use strict';
var bodyParser = require('body-parser');
var Device = require('./device');
var express = require('express');
var http = require('http');
var iocli = require('socket.io-client');

var Server = (function(){
    var DEFAULT_PORT = 3001;
    function Server(options){

        this._app = express();
        this._http = http.Server(this._app);
        this._socketio = iocli.connect('ws://ec2-54-214-112-170.us-west-2.compute.amazonaws.com:3000');
        this._options = options;
        this._device = null;

        var that = this;
        
        this._port = this._options && this._options.port ? this._options.port : DEFAULT_PORT;

        this._socketio.on('error', function(e){
            console.log(e);
        });

        this._socketio.on('connect', function(){
            console.log('Connected!');
        });

        this._socketio.on('event', function(data){
            console.log('Event!');
            console.log(data);
        });

        this._socketio.on('initdevice', function(data){
            console.log('Initializing device');
            console.log(data);
            that._initDevice(data);
        });

        this._socketio.on('pushtodevice', function(data){
            console.log('configuring program!');
            console.log(data);
            that._configureThings(data.things);
        });

        this._socketio.on('disconnect', function(){
            console.log('Disconected!');
        });

        this._middlewares();
        this._routes();

        this._listen();
    }

    Server.prototype._middlewares = function() {
        this._app.use(bodyParser.json());
        this._app.use(bodyParser.urlencoded({ extended: false }));
    }

    Server.prototype._routes = function() {
        var that = this;

        this._app.get('/', function(req, res, next){
            if (!that._device) {
                return res.status(404).json({error: 'The device has not been configured yet'});
            }

            return res.json(that._device);
        });

        this._app.post('/', function(req, res, next){
            that._initDevice(req.body);
            res.sendStatus(201);            
        });

        this._app.post('/things', function(req, res, next){
            that._configureThings(req.body.things);
            res.status(201).json({status: 'Thing Created'});
        });

        this._app.get('/things', function(req, res, next){
            if (!that._device) {
                return res.status(404).json({error: 'The device has not been configured yet'});
            }
            var things = that._device.getThings();
            var keys = Object.keys(things);
            var result = [];

            for(var i=0; i<keys.length; i++) {
                var thing = things[keys[i]]; 
                result.push({
                    id: thing.Id,
                    name: thing.Name,
                    pin: thing.Pin,
                    topicIn: thing.TopicIn,
                    topicOut: thing.TopicOut,
                    value: thing.Value
                })
            } 

            res.json(result);
        });

        this._app.get('/things/:id', function(req, res, next){
            var thing = that._device.getThing(req.params.id);
            if (thing) {
                res.json( {
                    id: thing.Id,
                    name: thing.Name,
                    pin: thing.Pin,
                    topicIn: thing.TopicIn,
                    topicOut: thing.TopicOut,
                    value: thing.Value
                } )    
            } else {
                res.sendStatus(400);
            }
        });

        this._app.put('/things/:id', function(req, res, next){
            var thing = that._device.getThing(req.params.id);
            if (thing) {
                thing.Value = req.body.value;
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
            }
            
        });
        
    }

    Server.prototype._configureThings = function(data) {
        this._device.cleanAllThings();
        var things = data;
        // Create Things into device
        for (var i=0; i<things.length; i++) {
            this._device.createThing(things[i]);
        }        
    }

    Server.prototype._initDevice = function(data) {
        this._device = new Device(data.id, 
            {
                "name": data.name,
                "messageBroker": data.messageBroker,
                "test": this._options && this._options.test
            }
        )
    }

    Server.prototype._listen = function() {
        var that = this;
        this._http.listen(this._port, function(){
            console.log('listening on ' +  that._port);
        });
    }

    return Server;
})();

module.exports = Server;

// var app = require('express')();
// var http = require('http').Server(app);
// var io = require('socket.io')(http);
// var MessageBroker = require('./utils/messageBroker');
// var bodyParser = require('body-parser');
// var config = require('./config');

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// var MQTT_TOPIC = 'notify/client';
// var WEBSOCKET_EVENT = 'event';
// var SERVICE_NAME = 'NOTIFICATION';

// // Message broker
// var messageBroker = new MessageBroker();

// messageBroker.addMessageHandler(function(topic, message){
//   io.emit(WEBSOCKET_EVENT, 'event : ' + topic + ' payload: ' + message);
// });

// messageBroker.subscribe(MQTT_TOPIC);

// messageBroker.connect({host:config.mqtt.host, port: config.mqtt.port});

// app.get('/', function(req, res){
//   //res.sendFile(__dirname + '/index.html');
//   res.send('Hello');
// });

// app.post('/sendEvent', function(req, res){
//   var topic = req.body.topic;
//   var message = req.body.payload;

//   var payload = {
//     service: SERVICE_NAME,
//     message: message
//   };

//   messageBroker.sendMessage(MQTT_TOPIC, JSON.stringify(payload));
//   res.status(201).send('Event created');
// });

// io.on('connection', function(socket){
//   console.log('Client connected !');
//   socket.on(WEBSOCKET_EVENT, function(msg){
//     io.emit(WEBSOCKET_EVENT, msg);
//   });
// });

// http.listen(3000, function(){
//   console.log('listening on *:3000');
// });