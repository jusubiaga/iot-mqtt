var DigitalThing = require('../digitalThing');

var LedThing = (function(){
    function LedThing(pin, messageBroker, config){
        DigitalThing.call(this, pin, messageBroker, config);
        this._thing = 'LED';
        
        this.addAction('BLINKON', this.blinkOn);
        this.addAction('BLINKOFF', this.blinkOff);        
    };
    
    LedThing.prototype = new DigitalThing();
    LedThing.constructor = LedThing;
    
    LedThing.prototype.blinkOn = function() {
        console.log(this._thing + ' BLINK-ON');  
        var that = this;
        var count = 0;
        this._loopInterval = setInterval(function(){
            that._value = count % 2;
            that._pin.write(that._value);
            count = (count > 2 ? 0 : count+1);            
        },500);
    };

    LedThing.prototype.blinkOff = function() {
        console.log(this._thing + ' BLINK-OFF');
        if(this._loopInterval) {
            clearInterval(this._loopInterval);
        }
        this._pin.write(0);
    };    
    
    return LedThing;
    
})();

module.exports = LedThing;