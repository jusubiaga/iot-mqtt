var I2CSensor = require('../I2CSensor');
var mraa = require('mraa');
var jsUpmI2cLcd = require('jsupm_i2clcd');
var LcdTextHelper = require('./lcd_text_helper');

var LcdSensor = (function(){
    function LcdSensor(pin, messageBroker, config){
        I2CSensor.call(this,pin, messageBroker, config);
        this._sensor = 'LCD';
        
        // Initialize the LCD.
        this._lcd = new jsUpmI2cLcd.Jhd1313m1(6, 0x3E, 0x62);
        this._lcdText = new LcdTextHelper(this._lcd);
        this._lcdText.set(['Ready','']);
        
        this.addAction('WRITE', this.write);
        
    };
    
    LcdSensor.prototype = new I2CSensor();
    LcdSensor.constructor = LcdSensor;
    
    LcdSensor.prototype.write = function(text1, text2) {
        
        this._lcdText.set([text1.text, text2.text]);
        console.log(this._sensor, text1.text + ' ' + text2.text);
    };
    
    return LcdSensor;
    
})();

module.exports = LcdSensor;