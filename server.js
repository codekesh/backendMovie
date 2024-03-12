const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ extended: false }));

// Body parser middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://201117:2hBXn0qDeu1BYI51@oppenheimer.q1gi6xf.mongodb.net/?retryWrites=true&w=majority&appName=Oppenheimer",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Define Movie schema
const MovieSchema = new mongoose.Schema({
  name: String,
  director: String,
  releaseYear: Number,
  language: String,
  rating: Number,
});

const Movie = mongoose.model("Movie", MovieSchema);

// Routes
// Add a New Movie
app.post("/api/movies", async (req, res) => {
  const { name, director, releaseYear, language, rating } = req.body;
  try {
    const newMovie = new Movie({
      name,
      director,
      releaseYear,
      language,
      rating,
    });
    const saveMovie = await newMovie.save();
    res.status(201).json(saveMovie);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Show all Movies
app.get("/api/movies", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/movies/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const movieData = await Movie.findById(id);
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      movieData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting single product",
      error,
    });
  }
});

// Update a Movie's Details
app.put("/api/movies/:id", async (req, res) => {
  const { id } = req.params;
  const { name, director, releaseYear, language, rating } = req.body;
  try {
    const updatedMovies = await Movie.findByIdAndUpdate(
      id,
      { name, director, releaseYear, language, rating },
      { new: true }
    );
    if (!updatedMovies) {
      return res.status(404).json({ error: "Movie not found" });
    }
    res.json(updatedMovies);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a Movie
app.delete("/api/movies/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedMovie = await Movie.findByIdAndDelete(id);
    if (!deletedMovie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    res.json({ message: "Movie deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
