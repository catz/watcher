var net = require('net');

var client = new net.Socket();
client.connect(1337, '127.0.0.1', function() {
  console.log('Connected');
});

var chunk = "";

client.on('data', function(data) {

  chunk += data.toString();
  var index = chunk.indexOf('}');

  while (index > -1) {
    try {
      string = chunk.substring(0, index + 1);
      json = JSON.parse(string);
      console.log(JSON.stringify(json, null, 2));
    } catch(e) {
      console.log("ERROR: " + e.toString());
    }
    chunk = chunk.substring(index + 1);
    index = chunk.indexOf('}');
  }
});

client.on('close', function() {
  console.log('Connection closed');
});