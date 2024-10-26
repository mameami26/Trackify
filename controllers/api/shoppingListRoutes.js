const router = require('express').Router();
const { ShoppingList } = require('../../models');
const withAuth = require('../../utils/auth');

// GET all shopping list items for the logged-in user
router.get('/', withAuth, async (req, res) => {
  try {
    const shoppingListData = await ShoppingList.findAll({
      where: { user_id: req.session.user_id }
    });

    const shoppingLists = shoppingListData.map(item => item.get({ plain: true }));
    res.status(200).json(shoppingLists); // Return JSON response or render a view if desired
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST route to add a new shopping list item
router.post('/', withAuth, async (req, res) => {
  try {
    const newItem = await ShoppingList.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
