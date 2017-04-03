// Copyright IBM Corp. 2014,2015. All Rights Reserved.
// Node module: loopback-example-user-management
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

var dsConfig = require('../datasources.json');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var auth = require('../auth/auth.service');
var path = require('path');

module.exports = function(app) {
  var User = app.models.user;

  //user sign up
  app.post('/things/users', function (req, res) {
    console.log('requestuser=>', req.body);
    var newUser = {};
    newUser.email = req.body.email.toLowerCase();
    newUser.username = req.body.name;
    newUser.password = req.body.password;
    newUser.provider = 'local';
    newUser.role = 'user';

    User.create(newUser, function(err, user) {
      if (err) {
        console.log('--error--', err.message);
        return res.redirect('createfailed');
      } else {
        console.log('user successfully created');
        var token = jwt.sign({_id: user.id }, 'checkphish', { expiresIn: 60*5 });
        res.json({ token: token, success: true });
      }

    });
  });

  //get current user
  app.get('/things/users/me',  auth.isAuthenticated(app), function(req, res, next) {
    User.findById(req.user.id, function(err, user) {
      console.log('created and retrieved user for "-me-"==> ', user);
      res.json(user);
    });
  });
  app.put('/:id/password', auth.isAuthenticated(app), function(req, res, next) {
      var userId = req.user.id;
      var oldPass = String(req.body.oldPassword);
      var newPass = String(req.body.newPassword);
      console.log('changepassword===> ',oldPass, '-new-', newPass );
      // User.findById(userId, function (err, user) {
      //   if(user.authenticate(oldPass)) {
      //     user.password = newPass;
      //     user.save(function(err) {
      //       if (err) return validationError(res, err);
      //       res.send(200);
      //     });
      //   } else {
      //     res.send(403);
      //   }
      // });
  });

  //auth
  app.use('/auth', require('../auth')(app));

var absolutePath =  path.normalize(__dirname + '/../../..') + '/loopback-example-user-management/client';
 // app.route('/*')
 //    .get(function(req, res) {
 //      res.sendFile(absolutePath + '/index.html');
 //    });
  //login




















  

  //login page
  // app.get('/', function(req, res) {
  //   var credentials = dsConfig.emailDs.transports[0].auth;
  //   res.render('login', {
  //     email: credentials.user,
  //     password: credentials.pass
  //   });
  // });

  // //verified
  // app.get('/verified', function(req, res) {
  //   res.render('verified');
  // });

  // //log a user in
  // app.post('/login', function(req, res) {
  //   User.login({
  //     email: req.body.email,
  //     password: req.body.password
  //   }, 'user', function(err, token) {
  //     if (err) {
  //       res.render('response', {
  //         title: 'Login failed',
  //         content: err,
  //         redirectTo: '/',
  //         redirectToLinkText: 'Try again'
  //       });
  //       return;
  //     }

  //     res.render('home', {
  //       email: req.body.email,
  //       accessToken: token.id
  //     });
  //   });
  // });

  // //log a user out
  // app.get('/logout', function(req, res, next) {
  //   if (!req.accessToken) return res.sendStatus(401);
  //   User.logout(req.accessToken.id, function(err) {
  //     if (err) return next(err);
  //     res.redirect('/');
  //   });
  // });

  // //send an email with instructions to reset an existing user's password
  // app.post('/request-password-reset', function(req, res, next) {
  //   User.resetPassword({
  //     email: req.body.email
  //   }, function(err) {
  //     if (err) return res.status(401).send(err);

  //     res.render('response', {
  //       title: 'Password reset requested',
  //       content: 'Check your email for further instructions',
  //       redirectTo: '/',
  //       redirectToLinkText: 'Log in'
  //     });
  //   });
  // });

  // //show password reset form
  // app.get('/reset-password', function(req, res, next) {
  //   if (!req.accessToken) return res.sendStatus(401);
  //   res.render('password-reset', {
  //     accessToken: req.accessToken.id
  //   });
  // });

  // //reset the user's pasword
  // app.post('/reset-password', function(req, res, next) {
  //   if (!req.accessToken) return res.sendStatus(401);

  //   //verify passwords match
  //   if (!req.body.password ||
  //       !req.body.confirmation ||
  //       req.body.password !== req.body.confirmation) {
  //     return res.sendStatus(400, new Error('Passwords do not match'));
  //   }

  //   User.findById(req.accessToken.userId, function(err, user) {
  //     if (err) return res.sendStatus(404);
  //     user.updateAttribute('password', req.body.password, function(err, user) {
  //     if (err) return res.sendStatus(404);
  //       console.log('> password reset processed successfully');
  //       res.render('response', {
  //         title: 'Password reset success',
  //         content: 'Your password has been reset successfully',
  //         redirectTo: '/',
  //         redirectToLinkText: 'Log in'
  //       });
  //     });
  //   });
  // });
};