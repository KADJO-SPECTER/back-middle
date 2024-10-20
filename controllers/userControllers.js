const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const ListsOfUsers = async (req, res) => {
  try {
    const lists = await prisma.user.findMany();

    if (lists.length === 0) {
      return res.status(404).json({ message: "Aucun utilisateur trouvé." });
    }

    res.status(200).json(lists);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des utilisateurs" });
  }
};

const ListsOfTransactions = async (req, res) => {
  const userId = req.params.userId;

  if (!userId || isNaN(userId) || parseInt(userId) <= 0) {
    return res.status(400).json({ message: "ID utilisateur invalide." });
  }

  try {
    const lists = await prisma.transaction.findMany({
      where: {
        OR: [
          { senderId: parseInt(userId) },
          { receiverId: parseInt(userId) },
        ],
      },
    });

    if (lists.length === 0) {
      return res.status(404).json({ message: "Aucune transaction trouvée." });
    }

    res.status(200).json(lists);
  } catch (error) {
    console.error("Erreur lors de la récupération de la liste des transactions:", error);
    res.status(500).json({
      error: "Erreur lors de la récupération de la liste des transactions",
    });
  }
};




module.exports = { ListsOfUsers, ListsOfTransactions };
