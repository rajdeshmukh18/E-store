const express = require('express');
const pool = require('../shared/pool');
const bcryptjs = require('bcryptjs');
const users = express.Router();
const jwtoken = require('jsonwebtoken');

// Function to generate JWT token
function generateToken(user) {
  return jwtoken.sign(
    { id: user.id, email: user.email },
    'estore-secret-key',
    { expiresIn: '1m' } // Access token expires in 1 minute
  );
}

// Function to generate refresh token
function generateRefreshToken(userId) {
  return jwtoken.sign(
    { id: userId },
    'refresh-secret-key',
    { expiresIn: '7d' } // Refresh token expires in 7 days
  );
}

users.post('/signup', (req, res) => {
  try {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let address = req.body.address;
    let city = req.body.city;
    let state = req.body.state;
    let pin = req.body.pin;
    let email = req.body.email;
    let password = req.body.password;

    pool.query(
      `select count(*) as count from users where email like '${email}'`,
      (error, resultCount) => {
        if (error) {
          res.status(500).send({
            error: error.code,
            message: error.message,
          });
        } else {
          if (resultCount[0].count > 0) {
            res.status(200).send({ message: 'Email already exists' });
          } else {
            bcryptjs.hash(password, 10).then((hashedPassword) => {
              const query = `Insert into users (email,firstName,lastName,address,city,state,pin,password)
                    values
                    ('${email}','${firstName}','${lastName}','${address}','${city}','${state}','${pin}','${hashedPassword}')`;
              pool.query(query, (error, result) => {
                if (error) {
                  res.status(401).send({
                    error: error.code,
                    message: error.message,
                  });
                } else {
                  res.status(201).send({ message: 'success' });
                }
              });
            });
          }
        }
      }
    );
  } catch (error) {
    res.status(400).send({
      error: error.code,
      message: error.message,
    });
  }
});

users.post('/login', (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;
    pool.query(
      `select * from users where email like '${email}'`,
      (error, result) => {
        if (error) {
          res.status(500).send({
            error: error.code,
            message: error.message,
          });
        } else {
          if (result.length > 0) {
            bcryptjs.compare(password, result[0].password).then((compareResult) => {
              if (compareResult) {
                const token = generateToken(result[0]);
                const refreshToken = generateRefreshToken(result[0].id);
                // You should store refreshToken in a secure place (e.g., database)
                res.status(200).send({
                  token: token,
                  refreshToken: refreshToken,
                  expiresInSeconds: 60, // Access token expires in 1 minute
                  user: {
                    id: result[0].id,
                    firstName: result[0].firstName,
                    lastName: result[0].lastName,
                    address: result[0].address,
                    city: result[0].city,
                    state: result[0].state,
                    pin: result[0].pin,
                  },
                });
              } else {
                res.status(401).send({
                  message: `Invalid password.`,
                });
              }
            });
          } else {
            res.status(401).send({
              message: `User doesn't exist.`,
            });
          }
        }
      }
    );
  } catch (error) {
    res.status(400).send({
      error: error.code,
      message: error.message,
    });
  }
});

users.post('/refresh-token', (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return res.status(401).send({ message: 'Refresh token is required.' });
  }
  try {
    // Verify the refresh token
    const decoded = jwtoken.verify(refreshToken, 'refresh-secret-key');
    // Assuming you have logic to check if the refresh token is valid (e.g., check against a database)
    // If valid, generate a new access token and return it
    const accessToken = generateToken({ id: decoded.id }); // Assuming you store user id in refresh token
    res.status(200).send({ token: accessToken });
  } catch (error) {
    return res.status(401).send({ message: 'Invalid refresh token.' });
  }
});

module.exports = users;
