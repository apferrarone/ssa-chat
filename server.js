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

app.use(express.static(path.join(__dirname, 'public')));

// serve client app over http
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Let's go
httpServer.listen(process.env.PORT || 6969);
