const express = require('express');
const router = express.Router();
const partController = require('../controllers/partController');

router.get('/', partController.getAllParts);
router.get('/car/:carId', partController.getPartsByCar);
router.post('/', partController.addPart);
router.delete('/:id', partController.deletePart);

module.exports = router;
