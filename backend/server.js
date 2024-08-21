const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const { db, collection } = require("./models/dbconnection");
const { ObjectId } = require("mongodb"); // Add this line to import ObjectId
const userlogin = require("./routes/user");

app.use(express.json()); // to parse the incoming requests with JSON payloads
app.use(bodyParser.json()); // to parse the incoming requests with JSON payloads
app.use(cors()); // to enable Cross-Origin Resource Sharing (CORS)
dotenv.config(); // to use the .env file

// user authentication setup
app.use("/api/user", userlogin);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/complaints", async (req, res) => {
  const { id, email, complaint, complainttype, serviced } = req.body;
  console.log(email, complaint, complainttype, serviced);
  const timestamp = new Date();
  // Access the database
  try {
    const result = await db
      .collection("come")
      .insertOne({ id, email, complaint, complainttype, serviced, timestamp });
    res.status(200).json({ message: "Complaint received successfully!" });
  } catch (error) {
    console.error("Error inserting complaint:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/reg_complaints", async (req, res) => {
  const { serviced } = req.query;
  const { id } = req.query;
  console.log(id, "apache");
  if (id === "admin") {
    try {
      const complaints = await db.collection("come").find({}).toArray();
      res.json(complaints);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    const servicedBoolean = serviced === "true" ? true : false;
    try {
      const complaints = await db
        .collection("come")
        .find({ serviced: servicedBoolean, id: id })
        .toArray();
      res.json(complaints);
    } catch (error) {
      console.error("Error teja fetching complaints:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

// Delete a complaint by ID
app.delete("/complaints/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const result = await db
      .collection("come")
      .deleteOne({ _id: new ObjectId(id) });
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
// app.get("/api/notes/t/:tt", (req, res) => {
//   const n = data.find((tt) => tt.title === decodeURIComponent(req.params.tt));
//   res.json(n);
//   console.log("hel");
// });
// app.get("/api/notes/:id", (req, res) => {
//   const n = data.find((n) => n._id === req.params.id);
//   res.json(n);
//   console.log("hel");
// });

port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// app.get("/user/:email", async (req, res) => {
//   const { email } = req.params;
//   try {
//     const db = client.db("cum"); // Replace with your database name
//     const collection = db.collection("login");
//     const user = await collection.findOne({ email });

//     if (user) {
//       res.status(200).json(user);
//     } else {
//       res.status(404).json({ message: "User not found" });
//     }
//   } catch (error) {
//     console.error("Error fetching user data:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// app.post("/updateProfile", async (req, res) => {
//   const { email, fname, lname, hostel, room, password } = req.body;
//   try {
//     const db = client.db("cum"); // Replace with your database name
//     const collection = db.collection("login");
//     const result = await collection.updateOne(
//       { email },
//       {
//         $set: {
//           fname,
//           lname,
//           hostel,
//           room,
//           password,
//         },
//       }
//     );

//     if (result.modifiedCount > 0) {
//       res.status(200).json({ message: "Profile updated successfully" });
//     } else {
//       res.status(404).json({ message: "User not found" });
//     }
//   } catch (error) {
//     console.error("Error updating profile:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });
