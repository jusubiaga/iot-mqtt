var I2CThing = require('../I2CThing');
var mraa = require('mraa');
var jsUpmI2cLcd = require('jsupm_i2clcd');
var LcdTextHelper = require('./lcd_text_helper');

var DisplayThing = (function(){
    function DisplayThing(pin, messageBroker, config){
        I2CThing.call(this,pin, messageBroker, config);
        this._thing = 'DISPLAY';
        
        // Initialize the Display.
        this._lcd = new jsUpmI2cLcd.Jhd1313m1(6, 0x3E, 0x62);
        this._lcdText = new LcdTextHelper(this._lcd);
        this._lcdText.set(['Ready','']);
        
        this.addAction('WRITE', this.write);
        
    };
    
    DisplayThing.prototype = new I2CThing();
    DisplayThing.constructor = DisplayThing;
    
    DisplayThing.prototype.write = function(text1, text2) {
        
        this._lcdText.set([text1.text, text2.text]);
        console.log(this._sensor, text1.text + ' ' + text2.text);
    };
    
    return DisplayThing;
    
})();

module.exports = DisplayThing;