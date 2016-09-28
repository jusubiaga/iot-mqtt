var AnalogSensor = require('../analogSensor');

var TempSensor = (function(){
    var B = 3975; // Value of the thermisor
    function TempSensor(pin, messageBroker, config){
        AnalogSensor.call(this, pin, messageBroker, config);
        this._sensor = 'TEMPERATURE';
        
        this._sensingFunction = this._calcTemperature;
        this._sensingTime = 1000;
    };
    
    TempSensor.prototype = new AnalogSensor();
    TempSensor.constructor = TempSensor;
    
    TempSensor.prototype._calcTemperature = function(data){    
        
        // var temp = Math.log(10000.0*((1024.0/data-1))); 
        // temp = 1 / (0.001129148 + (0.000234125 + (0.0000000876741 * temp * temp ))* temp );
        // temp = temp - 273.15;            // Convert Kelvin to Celcius
        //Temp = (Temp * 9.0)/ 5.0 + 32.0; // Convert Celcius to Fahrenheit        
            
        var resistance = (1023-data)*10000/data; //get the resistance of the sensor;
        var temperature = 1/(Math.log(resistance/10000)/B+1/298.15)-273.15; //convert to temperature via datasheet&nbsp;;
        // var temperature = ((data / 1024.0) * 5000)/10;
        return temperature;
    };
    
    // TODO Add new actions to set threshold
    // TempSensor.prototype.setThreshold = function(threshold) {
    //     console.log('Set Thresshold to ', threshold);
    // };
    
    return TempSensor;
    
})();

module.exports = TempSensor;