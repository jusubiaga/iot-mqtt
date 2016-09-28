var DigitalSensor = require('../digitalSensor');

var TouchSensor = (function(){
    function TouchSensor(pin, messageBroker, config){
        DigitalSensor.call(this,config);
        this._sensor = 'TOUCH';           
    };
    
    TouchSensor.prototype = new DigitalSensor();
    TouchSensor.constructor = TouchSensor;

    // TODO implement functions like double touch 
        
    return TouchSensor;
    
})();

module.exports = TouchSensor;