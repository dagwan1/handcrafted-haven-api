const dotenv = require('dotenv');
dotenv.config();
const MongoClient = require('mongodb').MongoClient;

let _db;

// Initialize the database connection
const initDb = (callback) => {
  if (_db) {
    console.log('Database is already initialized!');
    return callback(null, _db);
  }

  MongoClient.connect(process.env.MONGODB_URI)
    .then((client) => {
      _db = client;
      console.log('Connected to MongoDB successfully.');
      callback(null, _db);
    })
    .catch((err) => {
      console.error('Error connecting to MongoDB:', err);
      callback(err);
    });
};

// Get the database instance
const getDb = () => {
  if (!_db) {
    throw Error('Database not initialized');
  }
  return _db;
};

module.exports = {
  initDb,
  getDb
};
