const express = require("express");
const data = require("./data/notes");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb"); // Add this line to import ObjectId

const uri = "mongodb://localhost:27017"; // Replace with your MongoDB URI
const client = new MongoClient(uri);

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

app.use(bodyParser.json());
app.use(cors());
dotenv.config(); // to use the .env file
app.get("/", (req, res) => {
  res.send("Hello World");
});

// app.post("/complaints", (req, res) => {
//   const { email, complaint, serviced } = req.body;

//   // Process the complaint data (e.g., save to database)
//   console.log(email, complaint, serviced);

//   res.status(200).json({ message: "Complaint received successfully!" });
// });

app.post("/complaints", async (req, res) => {
  const { email, complaint, serviced } = req.body;
  console.log(email, complaint, serviced);
  // Access the database
  const db = client.db("cum"); // Replace with your database name
  const collection = db.collection("come"); // Replace with your collection name
  // Insert the complaint into MongoDB
  try {
    const result = await collection.insertOne({ email, complaint, serviced });
    res.status(200).json({ message: "Complaint received successfully!" });
  } catch (error) {
    console.error("Error inserting complaint:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/reg_complaints", async (req, res) => {
  const db = client.db("cum"); // Replace with your database name
  const collection = db.collection("come"); // Replace with your collection name
  const { serviced } = req.query;
  const { email } = req.query;
  const servicedBoolean = serviced === "true" ? true : false;
  try {
    const complaints = await collection
      .find({ serviced: servicedBoolean, email: email })
      .toArray();
    res.json(complaints);
  } catch (error) {
    console.error("Error teja fetching complaints:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  const db = client.db("cum"); // Replace with your database name
  const collection = db.collection("login");
  try {
    const user = await collection.findOne({ email: email, password: password });
    console.log(user);
    console.log("hotboy");
    if (user) {
      res.status(200).json({ message: "Login successful!" });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.post("/signin", async (req, res) => {
  const { email, password, fname, lname, room, hostel } = req.body;
  console.log(email, password);
  console.log("coolboy");
  const db = client.db("cum"); // Replace with your database name
  const collection = db.collection("login");
  // Insert the complaint into MongoDB
  try {
    const result = await collection.insertOne({
      fname,
      lname,
      room,
      hostel,
      email,
      password,
    });
    res.status(200).json({ message: "Complaint received successfully!" });
  } catch (error) {
    console.error("Error inserting complaint:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/user/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const db = client.db("cum"); // Replace with your database name
    const collection = db.collection("login");
    const user = await collection.findOne({ email });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/updateProfile", async (req, res) => {
  const { email, fname, lname, hostel, room, password } = req.body;
  try {
    const db = client.db("cum"); // Replace with your database name
    const collection = db.collection("login");
    const result = await collection.updateOne(
      { email },
      {
        $set: {
          fname,
          lname,
          hostel,
          room,
          password,
        },
      }
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Profile updated successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete a complaint by ID
app.delete("/complaints/:id", async (req, res) => {
  const { id } = req.params;
  const db = client.db("cum");
  const collection = db.collection("come");

  try {
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    console.log(result, "heel");
    if (result.deletedCount === 1) {
      res.status(200).json({ message: "Complaint deleted successfully" });
    } else {
      res.status(404).json({ message: "Complaint not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update a complaint to set serviced to true
app.put("/complaints/:id", async (req, res) => {
  console.log("backend", req);
  const { id } = req.params;
  const { serviced } = req.body;
  const db = client.db("cum");
  const collection = db.collection("come");
  console.log("super", id, serviced);
  console.log("super" + id);
  try {
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { serviced: true } }
    );
    console.log(result, "hi ra china");
    if (result && result.matchedCount == 1) {
      res.status(200).json({ message: "Complaint updated successfully" });
    } else {
      res.status(404).json({ message: "Complaint not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.get("/api/notes/t/:tt", (req, res) => {
  const n = data.find((tt) => tt.title === decodeURIComponent(req.params.tt));
  res.json(n);
  console.log("hel");
});
app.get("/api/notes/:id", (req, res) => {
  const n = data.find((n) => n._id === req.params.id);
  res.json(n);
  console.log("hel");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
