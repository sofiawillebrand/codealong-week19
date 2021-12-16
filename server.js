import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/post-codealong";
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.Promise = Promise;

const Task = mongoose.model("Task", {
  text: {
    type: String,
    required: true,
    minlength: 5,
  },
  complete: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello world");
});

// sort makes sure that they are sent back in descending order (des)
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find()
    .sort({ createdAt: "desc" })
    .limit(20)
    .exec();
  res.json(tasks);
});

app.post("/tasks", async (req, res) => {
  const { text, complete } = req.body;

  try {
    const task = await new Task({ text, complete }).save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({
      message: "Could not save task to database",
      error: error.errors,
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
