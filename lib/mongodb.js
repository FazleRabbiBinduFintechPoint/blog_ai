// lib/mongodb.js
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = "blogDB";
const collectionName = "blog_posts";

async function connectToDatabase() {
  if (!client.isConnected?.()) {
    await client.connect();
  }
  return client.db(dbName);
}

module.exports = { connectToDatabase, collectionName };