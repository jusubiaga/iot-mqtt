"use strict";

var PinCreator = (function(){
    function PinCreator(config){
        this._supportedPins = config ? config.supportedPins :  null;
    };
    
    PinCreator.prototype.create = function(type,opts){
        var Pin = this._supportedPins[type];
        if (Pin instanceof Function) {
            var pin = new Pin();
            pin.connect(opts.pinNumber, opts.pinDir);
            return pin;
        }
        
        return null;        
    };
    
    return PinCreator;
})();

module.exports = PinCreator;