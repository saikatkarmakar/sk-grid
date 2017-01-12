var connect = require('connect');
var serveStatic = require('serve-static');
var open = require('open');
var PORT = 8080;

connect().use(serveStatic(__dirname)).listen(PORT);
open('http://localhost:'+PORT);
console.log('Listening '+PORT);