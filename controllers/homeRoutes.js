const router = require('express').Router();
const { User, Event, Career, ShoppingList, Vacation } = require('../models');
const withAuth = require('../utils/auth');

// Root route - Show welcome page if not logged in, otherwise show home page
// Root route - Show welcome page if not logged in, otherwise show home page
router.get('/', async (req, res) => {
  if (!req.session.logged_in) {
    return res.render('welcome'); // Show welcome page if not logged in
  }

  try {
    const careersData = await Career.findAll({ where: { user_id: req.session.user_id } });
    const vacationsData = await Vacation.findAll({ where: { user_id: req.session.user_id } });
    const shoppingListData = await ShoppingList.findAll({ where: { user_id: req.session.user_id } });
    const eventData = await Event.findAll({ where: { user_id: req.session.user_id } });

    const careers = careersData.map(career => career.get({ plain: true }));
    const vacations = vacationsData.map(vacation => vacation.get({ plain: true }));
    const shoppingLists = shoppingListData.map(list => list.get({ plain: true }));
    const events = eventData.map(event => event.get({ plain: true }));

    res.render('home', {
      careers,
      vacations,
      shoppingLists,
      events,
      logged_in: req.session.logged_in,
      user: { name: req.session.user_name } // Pass user name to display in handlebars
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Login route
router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    return res.redirect('/');
  }
  res.render('login');
});

// Logout route
router.get('/logout', (req, res) => {
  res.redirect('login');
});

// Register route
router.get('/register', (req, res) => {
  if (req.session.logged_in) {
    return res.redirect('/');
  }
  res.render('register');
});

// User profile route
router.get('/profile', withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id);
    if (!userData) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userData.get({ plain: true });
    res.render('profile', { user, logged_in: req.session.logged_in });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Events route
router.get('/events', withAuth, async (req, res) => {
  try {
    const eventData = await Event.findAll({
      where: {
        user_id: req.session.user_id,
      },
    });

    const events = eventData.map((event) => event.get({ plain: true }));

    res.render('events', {
      events,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Careers route
// Home route with data fetch for logged-in users
router.get('/', withAuth, async (req, res) => {
  try {
    const careerData = await Career.findAll({ where: { user_id: req.session.user_id } });
    const shoppingListData = await ShoppingList.findAll({ where: { user_id: req.session.user_id } });

    const careers = careerData.map(career => career.get({ plain: true }));
    const shoppingLists = shoppingListData.map(list => list.get({ plain: true }));

    res.render('home', { careers, shoppingLists, logged_in: req.session.logged_in });
  } catch (err) {
    res.status(500).json(err);
  }
});


// Shopping Lists route
router.get('/shoppingList', withAuth, async (req, res) => {
  try {
    const shoppingListData = await ShoppingList.findAll({
      where: {
        user_id: req.session.user_id,
      },
    });

    const shoppingLists = shoppingListData.map((list) => list.get({ plain: true }));

    res.render('shopping', {
      shoppingLists,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Vacations route
router.get('/vacations', withAuth, async (req, res) => {
  try {
    const vacationData = await Vacation.findAll({
      where: {
        user_id: req.session.user_id,
      },
    });

    const vacations = vacationData.map((vacation) => vacation.get({ plain: true }));

    res.render('vacations', {
      vacations,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;