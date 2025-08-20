const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = 'blogDB';
const collectionName = 'blog_posts';

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  cachedDb = db;
  return db;
}

module.exports = { connectToDatabase, collectionName };