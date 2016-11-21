#!/usr/bin/env node

'use strict'

var fs = require('fs');
var program = require('commander');
var ThingsLoader = require('../devices/thingsLoader');
var ThingsServer = require('../devices/server');

var loader = null;
var options = null;

function main(){
  // Command Line
  program
    .version('0.0.1')
    .usage('[options] <file>')
    .option('-l, --load <file>', 'load things into the device given a json descriptor file.')
    .option('-w, --watch <file>', 'watch for changes in the descriptor file')
    .option('-s, --server', 'start rest service')    
    .option('-t, --test', 'test mode. Use this flag if you want simulate the hardware')
    .parse(process.argv);

  options = {test: program.test};
  loader = new ThingsLoader(options);


  if(program.load) {
    load(program.load);
  }

  if(program.watch) {
    watch(program.watch);
  }

  if(program.server) {
    server(program.server);
  }
}

function load(file){
  console.log('Loadding things from ' + file);  
  loader.load(file);
}

function watch(file){
  console.log('Watching ' +  file);
  loader.load(file);
  fs.watch(file, function(curr, prev){
    loader.clean();
    loader.load(file);
  });
}

function server() {
  var server = new ThingsServer(options);
}

main();

