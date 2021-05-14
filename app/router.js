const express = require('express');
const signIn = require('./controllers/signIn');
const signInController = require('./controllers/signIn');

const router = express.Router();

router.post('/salt', signInController.getSalt);
router.post('/login', signInController.tryLogin);
router.post('/auth', signInController.doubleAuthLogin);
router.post('/manager', signInController.getUserInfos);
router.post('/cards', signInController.getCards);


module.exports = router;