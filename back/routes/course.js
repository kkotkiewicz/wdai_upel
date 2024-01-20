const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Course = require("../models/Course");
const User = require("../models/User");
const Comment = require("../models/Comment");
const Rating = require("../models/Rating");
const mongooseConnect = require('../lib/mongoose');

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Brak tokena" });

  try {
    const decoded = jwt.verify(token, "wdai_project");
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Nieprawidłowy token" });
  }
};

const isAdmin = (req, res, next) => {
  mongooseConnect();
  const decodedPayload = jwt.decode(req.header("Authorization"));

  const userId = decodedPayload.user.id;

  User.findById(userId)
    .then(user => {
      if (!user || user.user_role !== true) {
        return res.status(403).json({ message: "Brak uprawnień administratora" });
      }
      next();    
    })
    .catch(err => {
      return res.status(403).json({ message: "Brak uprawnień administratora" });
    });
};

router.get("", async (req, res) => {
  try {
    mongooseConnect();
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Wystąpił błąd podczas pobierania kursów" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    mongooseConnect();
    const { id } = req.params;
    const course = await Course.findById(id).populate("comments").populate("ratings");
    if (!course) {
      return res.status(404).json({ message: "Kurs nie znaleziony" });
    }
    res.status(200).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Wystąpił błąd podczas pobierania kursu" });
  }
});

router.post("/:id/comments", verifyToken, async (req, res) => {
  try {
    mongooseConnect();
    const { id } = req.params;
    const { text } = req.body;

    const decodedPayload = jwt.decode(req.header("Authorization"));

    const userId = decodedPayload.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Użytkownik nie znaleziony" });
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Kurs nie znaleziony" });
    }

    const newComment = new Comment({
      user: userId,
      course: id,
      text,
    });

    const savedComment = await newComment.save();
    course.comments.push(savedComment._id);
    await course.save();

    res.status(201).json({ message: "Komentarz dodany", comment: savedComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Wystąpił błąd podczas dodawania komentarza" });
  }
});

router.post("/:id/ratings", verifyToken, async (req, res) => {
  try {
    mongooseConnect();
    const { id } = req.params;
    const { rating } = req.body;

    const decodedPayload = jwt.decode(req.header("Authorization"));
    const userId = decodedPayload.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Użytkownik nie znaleziony" });
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Kurs nie znaleziony" });
    }

    const existingRating = await Rating.findOne({ user: userId, course: id });

    if (existingRating) {
      existingRating.rating = rating;
      const updatedRating = await existingRating.save();
      return res.status(200).json({ message: "Ocena zaktualizowana", rating: updatedRating });
    } else {
      const newRating = new Rating({
        user: userId,
        course: id,
        rating,
      });

      const savedRating = await newRating.save();
      course.ratings.push(savedRating._id);
      await course.save();

      return res.status(201).json({ message: "Ocena dodana", rating: savedRating });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Wystąpił błąd podczas dodawania oceny" });
  }
});


router.post("", isAdmin, verifyToken, async (req, res) => {
  try {
    mongooseConnect();

    const newCourse = new Course(req.body);
    const savedCourse = await newCourse.save();

    res.status(201).json({ message: "Kurs dodany", course: savedCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Wystąpił błąd podczas dodawania kursu" });
  }
});

router.put("/:id", isAdmin, verifyToken, async (req, res) => {
  try {
    mongooseConnect();

    const { id } = req.params;
    const updatedCourse = await Course.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedCourse) {
      return res.status(404).json({ message: "Kurs nie znaleziony" });
    }

    res.status(200).json({ message: "Kurs zaktualizowany", course: updatedCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Wystąpił błąd podczas aktualizacji kursu" });
  }
});

router.delete("/:id", isAdmin, verifyToken, async (req, res) => {
  try {
    mongooseConnect();

    const { id } = req.params;
    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res.status(404).json({ message: "Kurs nie znaleziony" });
    }

    res.status(200).json({ message: "Kurs usunięty", course: deletedCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Wystąpił błąd podczas usuwania kursu" });
  }
});

module.exports = router;
