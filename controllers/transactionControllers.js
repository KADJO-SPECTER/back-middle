const { PrismaClient } = require("@prisma/client");
const formatDate = require("../helpers/formatDate");
const prisma = new PrismaClient();

const transfer = async (req, res) => {
  const { amount, receiverEmail } = req.body;
  const { id } = req.params;

  const now = new Date();

  try {
    const sender = await prisma.user.findUnique({
      where: { id: parseInt(id, 10) },
    });

    // Vérifiez si le solde de l'expéditeur est suffisant
    if (sender.balance < amount) {
      return res.status(400).json({ message: "Solde insuffisant" });
    }

    const receiver = await prisma.user.findUnique({
      where: { email: receiverEmail },
    });

    // Vérifiez si le destinataire existe
    if (!receiver) {
      return res.status(404).json({ message: "Destinataire non trouvé" });
    }

    // Utiliser une transaction pour garantir l'atomicité
    await prisma.$transaction(async (tx) => {
      // Débiter le compte de l'expéditeur
      await tx.user.update({
        where: { id: sender.id },
        data: { balance: sender.balance - amount },
      });

      // Créditer le compte du destinataire
      await tx.user.update({
        where: { id: receiver.id },
        data: { balance: receiver.balance + amount },
      });

      // Enregistrer la transaction
      await tx.transaction.create({
        data: {
          amount,
          senderId: sender.id,
          receiverId: receiver.id,
          receiverName: receiver.name,
          email: sender.email,
          name: sender.name,
          date: formatDate(now),
          status: "succes",
        },
      });
    });

    // Envoyer l'information via Socket.IO si io est disponible
    if (req.io) {
      req.io.emit("transaction", {
        message: "Transfert effectué avec succès",
        amount,
        sender: sender.email,
        receiver: receiver.email,
      });
    }

    res.json({ message: "Transfert effectué avec succès" });
  } catch (error) {
    // Gérer les erreurs et rembourser si nécessaire
    console.error("Erreur lors du transfert:", error);

    // En cas d'erreur, nous devons rembourser
    if (error.message.includes("Connection failed")) {
      // Si c'est une erreur de connexion ou autre problème, remboursez le montant
      await prisma.user.update({
        where: { id: sender.id },
        data: { balance: { increment: amount } }, // Rembourser le montant à l'expéditeur
      });

      const receiver = await prisma.user.findUnique({
        where: { email: receiverEmail },
      });
  
      // Enregistrer la transaction comme échouée
      await prisma.transaction.create({
        data: {
          amount,
          senderId: sender.id,
          receiverId: receiver.id, 
          receiverName: receiver.name, 
          email: sender.email,
          name: sender.name,
          date: formatDate(now),
          status: "echoue",
        },
      });
    }

    res.status(500).json({ error: "Erreur lors du transfert." });
  }
};


const getBalance = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id, 10) },
    });
    res.json({ balance: user.balance });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération du solde" });
  }
};

module.exports = { transfer, getBalance };
