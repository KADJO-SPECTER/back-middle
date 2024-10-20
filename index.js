const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/authRoutes');
const connection = require('./database/database');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionsRoutes');

const app = express();
const server = http.createServer(app);  // Crée le serveur HTTP
const io = new Server(server, {
  cors: {
    origin: "*",  
    methods: ["GET", "POST"]
  }
});

app.use(express.json());
app.use(cors());

// Connexion à la base de données
connection;

// Middleware pour ajouter Socket.IO à req
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/transactions', transactionRoutes(io));  
app.use('/user', userRoutes);  

// Gestion des événements Socket.IO
io.on('connection', (socket) => {
  console.log('Un utilisateur est connecté :', socket.id);

  socket.on('disconnect', () => {
    console.log('Un utilisateur est déconnecté :', socket.id);
  });
});

// Démarrer le serveur
server.listen(3000, () => {
  console.log('Serveur en marche sur le port 3000');
});
