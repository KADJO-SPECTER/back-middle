const express = require('express');
const { ListsOfUsers, ListsOfTransactions } = require('../controllers/userControllers');



const router = express.Router();

router.get('/lists', ListsOfUsers);
router.get('/transaction/:userId', ListsOfTransactions);  // Route pour la liste des transactions


module.exports = router;
