const express = require('express');
const router = express.Router();
var prove08Controller = require('../../controllers/prove08');

router.get('/prove08', prove08Controller.processJson)
      .post('/prove08', prove08Controller.getIndex);
      
module.exports = router;