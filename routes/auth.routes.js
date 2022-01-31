const express = require('express');
const router = express.Router();

//Validation
const {
  validRegister,
  validLogin,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require('../helpers/valid');

//load controllers
const {
  registerController,
  activationController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
  googleController,
} = require('../controllers/auth.controller.js');

router.post('/register', validRegister, registerController);
router.post('/login', validLogin, loginController);
router.post(
  '/password/forget',
  forgotPasswordValidator,
  forgotPasswordController
);
router.put('/password/reset', resetPasswordValidator, resetPasswordController);
router.post('/activation', activationController);
router.post('/googlelogin', googleController);

module.exports = router;
