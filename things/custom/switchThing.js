var DigitalThing = require('../digitalThing');

var SwitchThing = (function(){
    function SwitchThing(pin, messageBroker, config){
        DigitalThing.call(this, pin, messageBroker, config);
        this._thing = 'SWITCH';
        this._status = 0;
        this._sensingFunction = this._switchHandler;
    };
    
    SwitchThing.prototype = new DigitalThing();
    SwitchThing.constructor = SwitchThing;

    SwitchThing.prototype._switchHandler = function(value){
        // Transform value
        if (value) {
            this._status = Number(!this._status);
        }
        return this._status;
    };
        
    return SwitchThing;
    
})();

module.exports = SwitchThing;