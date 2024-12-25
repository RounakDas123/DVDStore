const express= require('express');
const router = express.Router();

const usersController = require('../controllers/users-controller');

router.post('/signup', usersController.signup);

router.post('/login', usersController.login);

router.patch('/updateprofile/:uid', usersController.updateProfile);

module.exports = router;

