const express = require('express');
const Resource = require('../models/Resource');
const router = express.Router();

router.get('/:id', async (req, res) => {
  const resource = await Resource.findById(req.params.id);
  if (!resource) return res.status(404).json({ message: "Not found" });
  res.json({ resource });
});

module.exports = router;