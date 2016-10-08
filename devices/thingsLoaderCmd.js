var fs = require('fs');
var program = require('commander');
var ThingsLoader = require('./thingsLoader');

function main(){
  // Command Line
  program
    .version('0.0.1')
    .usage('[options] <file>')
    .option('-l, --load <file>', 'load things into the device given a json descriptor file.')
    .option('-w, --watch <file>', 'watch for changes in the descriptor file')
    .parse(process.argv);

  if(program.load) {
    load(program.load);
  }

  if(program.watch) {
    watch(program.watch);
  }
}

function load(file){
  console.log('Loadding things from ' + file);
  var loader = new ThingsLoader(); 
  loader.load(file);
}

function watch(file){
  console.log('watch ' +  file);
}

main();

