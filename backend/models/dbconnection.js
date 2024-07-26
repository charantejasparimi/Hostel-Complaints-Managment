const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(process.env.MONGO_URI);

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit process with failure
  }
}

connectToMongoDB();

const db = client.db("cum"); // Replace with your database name
const collection = db.collection("login"); // Replace with your collection name

module.exports = { db, collection };
