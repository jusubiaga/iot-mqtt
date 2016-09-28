var Sensor = require('./sensor');

var I2CSensor = (function(){
    function I2CSensor(pin, messageBroker, config){
        Sensor.call(this,pin, messageBroker, config);
        this._sensor = 'I2C_SENSOR';
    };
    
    I2CSensor.prototype = new Sensor();
    I2CSensor.constructor = I2CSensor;
    
    return I2CSensor;
    
})();


module.exports = I2CSensor;