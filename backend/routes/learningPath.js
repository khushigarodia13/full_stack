const express = require('express');
const auth = require('../middleware/auth');
const LearningPath = require('../models/LearningPath');
const Company = require('../models/Company');
const router = express.Router();

// Default learning path
router.get('/', auth, async (req, res) => {
  const learningPath = await LearningPath.findOne();
  res.json({ learningPath });
});

// Company-specific learning path
router.get('/company/:companyName', auth, async (req, res) => {
  const { companyName } = req.params;
  const learningPath = await LearningPath.findOne();
  const company = await Company.findOne({ name: companyName });

  if (!learningPath) return res.status(404).json({ message: "No learning path found" });

  // Apply company customizations if available
  let nodes = [...learningPath.nodes];
  if (company && company.customizations && company.customizations.extraModules) {
    company.customizations.extraModules.forEach(module => {
      if (!nodes.find(n => n.title === module)) {
        nodes.push({
          title: module,
          description: `Special module for ${companyName}`,
          prerequisites: [],
          resources: [],
          faangCustomizations: {},
        });
      }
    });
  }

  res.json({ learningPath: { ...learningPath.toObject(), nodes } });
});

module.exports = router;