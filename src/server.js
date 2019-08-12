const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const connectedUsers = {};

io.on('connection', socket => {
  const { dev } = socket.handshake.query;
  connectedUsers[dev] = socket.id;
});

mongoose.connect('mongodb://docker.local:27017/tindev', {
  useNewUrlParser: true
});

app.use((request, response, next) => {
  request.io = io;
  request.connectedUsers = connectedUsers;

  return next();
});

app.use(cors());
app.use(express.json());
app.use(routes);

app.use((err, request, response, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

server.listen(3333);
