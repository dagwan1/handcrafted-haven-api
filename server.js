const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const mongodb = require('./db/db');
const fileUpload = require('express-fileupload');

const port = process.env.PORT || 8080;
const app = express();

// Enable CORS for all routes
app.use(cors());

// Express session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default-secret',
    resave: false,
    saveUninitialized: false
  })
);

// Middleware for parsing JSON requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(fileUpload());

// Use routes defined in separate files
app.use('/', require('./routes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Initialize the database connection
mongodb.initDb((err) => {
  if (err) {
    console.error('Error initializing database:', err);
    process.exit(1); // Exit the process if DB initialization fails
  } else {
    app.listen(port, () => {
      console.log(`Running and listening on port ${port}`);
      console.log('Handcrafted Haven successfully initialized');
    });
  }
});
