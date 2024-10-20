const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost', // ou l'adresse de votre serveur MySQL
  user: 'root',
  password: '',
  database: 'money_base',
});

connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion : ' + err.stack);
    return;
  }
  console.log('Connecté en tant que ' + connection.threadId);
});

module.exports = connection;
