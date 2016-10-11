var DigitalThing = require('../digitalThing');

var TouchThing = (function(){
    function TouchThing(pin, messageBroker, config){
        DigitalThing.call(this,config);
        this._thing = 'TOUCH';           
    };
    
    TouchThing.prototype = new DigitalThing();
    TouchThing.constructor = TouchThing;

    // TODO implement functions like double touch 
        
    return TouchThing;
    
})();

module.exports = TouchThing;