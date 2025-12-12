const express = require('express');
const { PrismaClient } = require('@prisma/client');
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Endpoint now accepts string ID (ObjectId)
app.get('/users/:id', async (req, res) => {
  const id = req.params.id;
  // No parseInt check needed for ObjectId strings

  const user = await prisma.user.findUnique({
    where: { id: id },
    include: { orders: true }
  });
  res.json(user);
});

// Create Order
app.post('/orders', async (req, res) => {
  const { userId, itemIds } = req.body;
  // userId should be a string now
  const order = await prisma.order.create({
    data: {
      userId: userId, // Passed directly as string
      items: {
        create: itemIds.map(id => ({ itemId: id })) // Item IDs also strings
      }
    }
  });
  res.json(order);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
