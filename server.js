//  ________  _______   ________  ___      ___ _______   ________     
// |\   ____\|\  ___ \ |\   __  \|\  \    /  /|\  ___ \ |\   __  \    
// \ \  \___|\ \   __/|\ \  \|\  \ \  \  /  / | \   __/|\ \  \|\  \   
//  \ \_____  \ \  \_|/_\ \   _  _\ \  \/  / / \ \  \_|/_\ \   _  _\  
//   \|____|\  \ \  \_|\ \ \  \\  \\ \    / /   \ \  \_|\ \ \  \\  \| 
//     ____\_\  \ \_______\ \__\\ _\\ \__/ /     \ \_______\ \__\\ _\ 
//    |\_________\|_______|\|__|\|__|\|__|/       \|_______|\|__|\|__|
//    \|_________|                                                    
                   
const path = require('path');
const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const chatServer = require('socket.io')(httpServer);
const generateName = require('sillyname');
const log4js = require('log4js');

app.use(express.static(path.join(__dirname, 'public')));

// serve client app over http
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// keep a pool of sockets (this is like a chatroom)
const clients = {};
const EVENT_CHAT_MESSAGE = 'chat-message'
const EVENT_NOTIFICATION = 'notification'

// handle new chatServer connection
chatServer.on('connection', (client) => {
  // generate a random name for the client and add them to the pool
  client.name = generateName();
  clients[client.id] = client;

  // notify everyone about it
  chatServer.sockets.emit(EVENT_NOTIFICATION, client.name + ' has joined the server.')
  
	client.on(EVENT_CHAT_MESSAGE, (msg) => {
    for (var id in clients) {
      clients[id].emit(EVENT_CHAT_MESSAGE, `${id == client.id ? '👽 ': '💬 '}${client.name}: ${msg}`);
    }
	});

	client.on('disconnect', () => {
    // notify everyone and remove client from pool
		chatServer.sockets.emit(EVENT_NOTIFICATION, clients[client.id].name + ' has left the server.');
		delete clients[client.id];
	});
});

// Log errors
log4js.configure({
  appenders: { error: { type: 'file', filename: 'error.log' } },
  categories: { default: { appenders: ['error'], level: 'error' } }
});

const logger = log4js.getLogger('error');

chatServer.on('error', (err) => {
  logger.error(`Socket Error: ${err}`);
});

httpServer.on('error', (err) => {
  logger.error(`Server Error: ${err}`);
});

// Let's go
httpServer.listen(process.env.PORT || 6969);
