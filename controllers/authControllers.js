const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../services/tokenServices');

const prisma = new PrismaClient();

// Inscription
const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        balance: 10000, // Attribuer 10 000 par défaut
      },
    });
    res.status(201).json({ success: true, message: 'Utilisateur créé avec succès', user: newUser });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Échec de la création de l’utilisateur' });
  }
};


// Connexion
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }
    const token = generateToken(user);
    res.json({ token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        balance: user.balance
      }
     });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = { register, login };
