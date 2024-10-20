const express = require('express');
const { transfer, getBalance } = require('../controllers/transactionControllers');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

router.post('/transfer/:id', authenticate, transfer);  // Route pour le transfert
router.get('/balance/:id', authenticate, getBalance);  // Route pour consulter le solde

module.exports = (io) => {
  return router;
};
