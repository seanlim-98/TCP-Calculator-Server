var net = require('net');
var client = new net.Socket();
client.connect(3000, 'localhost', () => {
	console.log('Connected!');
	client.write('Hi server!');
})