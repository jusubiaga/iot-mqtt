'use strict';

var Thing = require('./thing');

var I2CThing = (function(){
    function I2CThing(pin, messageBroker, config){
        Thing.call(this,pin, messageBroker, config);
        this._thing = 'I2C_THING';
    };
    
    I2CThing.prototype = new Thing();
    I2CThing.constructor = I2CThing;
    
    return I2CThing;
    
})();


module.exports = I2CThing;