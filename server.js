var net = require('net'),
  watch = require('watch'),
  path = require("path"),
  mysql =  require('mysql'),
  dateFormat = require('dateformat');

var connection = mysql.createConnection({
  host : "localhost",
  user : "root",
  password: "qaz123",
  port : 3306,
  database: 'watcher'
});

connection.connect(function(err){
  if(err !== null) {
    console.log('Error connecting to mysql:' + err+'\n');
  }
});

var clients = [];
var filesToWatch = process.argv.slice(2);
var re = new RegExp(filesToWatch[0] + "$", 'g');

watch.createMonitor(__dirname, function (monitor) {
  monitor.on("created", function (f, stat) {
    if (!f.match(re))
      return;

    broadcast(buildMessage(f, "create"));
  });

  monitor.on("removed", function (f, stat) {
    if (!f.match(re))
      return;

    broadcast(buildMessage(f, "remove"));
  });

  monitor.on("changed", function (f, curr, prev) {
    if (!f.match(re))
      return;

    broadcast(buildMessage(f, "change"));
  });
});

function buildMessage(filename, type) {
  return {
    file: path.basename(filename),
    type: type,
    changed: new Date()
  };
}

function broadcast(message) {
  clients.forEach(function (client) {
    console.log(client.name + " > " + JSON.stringify(message));
    client.write(JSON.stringify(message));
  });

  connection.query('INSERT INTO changes SET change_type = ?, filename = ?, created_at = ?',
    [message.type, message.file, dateFormat(message.changed, "yyyy-mm-dd h:MM:ss")],
    function(error, rows) {
      if (error) {
        var err = "error on insert" + error;
        console.error(err);
    }
  });
}

net.createServer(function (socket) {
  socket.name = socket.remoteAddress + ":" + socket.remotePort;
  clients.push(socket);

  socket.on('end', function () {
    clients.splice(clients.indexOf(socket), 1);
  });
}).listen(1337);