var DigitalSensor = require('../digitalSensor');

var LedSensor = (function(){
    function LedSensor(pin, messageBroker, config){
        DigitalSensor.call(this,config);
        this._sensor = 'LED';
        
        this.addAction('BLINKON', this.blinkOn);
        this.addAction('BLINKOFF', this.blinkOff);        
    };
    
    LedSensor.prototype = new DigitalSensor();
    LedSensor.constructor = LedSensor;
    
    LedSensor.prototype.blinkOn = function() {
        console.log(this._sensor + ' BLINK-ON');  
        var that = this;
        var count = 0;
        this._loopInterval = setInterval(function(){
            that._value = count % 2;
            that._pin.write(that._value);
            count = (count > 2 ? 0 : count+1);            
        },500);
    };

    LedSensor.prototype.blinkOff = function() {
        console.log(this._sensor + ' BLINK-OFF');
        if(this._loopInterval) {
            clearInterval(this._loopInterval);
        }
        this._pin.write(0);
    };    
    
    return LedSensor;
    
})();

module.exports = LedSensor;