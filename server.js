var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
	res.sendFile(__dirname + '/canvas.js');
});

io.on('connection', function(socket){
	console.log('a user connected');
	io.emit('idrequest', "idrequest");
});

http.listen(8080, function(){
	console.log('listening on port *:8080');
});

