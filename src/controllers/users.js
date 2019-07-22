import mongoose from 'mongoose';

import User from '../models/user';

const bcrypt = require('bcrypt');
const jwt = require ('jsonwebtoken');

require('dotenv').config();

class UsersControllers {
  static async signup (req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    await User.find({email: email})
      .exec()
      .then(user => {
          if (user.length >=1) {
              return res.status(409).json({
                  message: "User with that email already exists"
              });
          } else {
            bcrypt.hash(password, 5, (err, hash) => {
              if (err) {
                return res.status(500).json({
                  error: err
                });
              } else {
                const user = new User({
                  _id: new mongoose.Types.ObjectId(),
                  email: email,
                  password: hash
                });
                user.save()
                  .then(result =>{
                     console.log(result);
                     res.status(201).json({
                       user: {
                         email: result.email,
                         id: result._id
                       },
                       message: 'User created successfully'
                     }); 
                  })
                  .catch(err => {
                    console.log(err);
                    res.status(500).json({
                      error: err
                    });
                  });
              }
            });
            
          }
      })
  }

  static delete (req, res, next) {
    const id = req.params.userId;
    User.remove({_id: id})
      .exec()
      .then(result => {
          res.status(200).json({
            message: 'User deleted successfully'
          });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
  }

  static async login (req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    await User.find({email: email})
    .exec()
    .then(user =>{
      if (user.length <1) {
          return res.status(401).json({
            message: 'Auth failed'
          });
      }
      bcrypt.compare(password, user[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: 'Auth failed'
            });
          }
          if (result) {
            const token = jwt.sign({
                email: user[0].email,
                userId: user[0]._id
            }, process.env.JWT_SECRET_KEY, 
            {
              expiresIn:"1h"
            });
            return res.status(200).json({
              message: 'Auth successful',
              token: token
            });
          }
          res.status(401).json({
            message: 'Auth failed'
          });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err});
  });
}
}

export default UsersControllers;
