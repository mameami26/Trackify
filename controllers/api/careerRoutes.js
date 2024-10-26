const router = require('express').Router();
const { Career } = require('../../models');
const withAuth = require('../../utils/auth'); // Ensure withAuth middleware is correctly imported

// GET all career entries for the logged-in user
router.get('/', withAuth, async (req, res) => {
  try {
    const careerData = await Career.findAll({
      where: { user_id: req.session.user_id }
    });

    const careers = careerData.map(career => career.get({ plain: true }));
    res.status(200).json(careers); // Return JSON response or render a view if desired
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST route to add a new career entry
router.post('/', withAuth, async (req, res) => {
  try {
    const newCareer = await Career.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(201).json(newCareer);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
