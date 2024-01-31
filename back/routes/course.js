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

router.get("", (req, res) => {
  mongooseConnect()
    .then(() => Course.find())
    .then(courses => {
      const coursesPromises = courses.map(course =>
        Comment.find({ course: course._id }).populate("user")
          .then(comments => {
            const commentsArray = comments.map(comment => ({
              userId: comment.user._id,
              commentId: comment._id,
              name: comment.user.user_firstname + " " + comment.user.user_lastname,
              text: comment.text
            }));

            course.comments = commentsArray;

            return Rating.find({ course: course._id })
              .then(ratings_all => {
                const ratings = ratings_all.map(rating => rating.rating);
                const course_res = {...course, rating_avg: 0};
                if (ratings.length === 0) {
                  course_res.rating_avg = 0;
                }
                else {
                  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
                  course_res.rating_avg = sum / ratings.length;
                }
                return {...course_res._doc, rating_avg: course_res.rating_avg, comments_text: commentsArray};
              });
          })
      );

      return Promise.all(coursesPromises);
    })
    .then(coursesWithRatings => res.status(200).json(coursesWithRatings))
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: "Wystąpił błąd podczas pobierania kursów" });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  mongooseConnect()
    .then(() => Course.findById(id).populate("comments").populate("ratings"))
    .then(course => {
      if (!course) {
        return res.status(404).json({ message: "Kurs nie znaleziony" });
      }

      return Comment.find({ course: id }).populate("user")
        .then(comments => {
          const commentsArray = comments.map(comment => ({
            userId: comment.user._id,
            commentId: comment._id,
            name: comment.user.user_firstname + " " + comment.user.user_lastname,
            text: comment.text
          }));

          course.comments = commentsArray;

          return Rating.find({ course: id })
            .then(ratings_all => {
              const course_res = {...course, rating_avg: 0};
              const ratings = ratings_all.map(rating => rating.rating);
              if (ratings.length === 0) {
                course_res.rating_avg = 0;
              }

              const sum = ratings.reduce((acc, rating) => acc + rating, 0);
              course_res.rating_avg = sum / ratings.length;

              res.status(200).json({...course_res._doc, rating_avg: course_res.rating_avg, comments_text: commentsArray});
            });
        });
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: "Wystąpił błąd podczas pobierania kursu" });
    });
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

router.put("/:id/comments/:commentId", verifyToken, async (req, res) => {
  try {
    mongooseConnect();
    const { id, commentId } = req.params;
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

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Komentarz nie znaleziony" });
    }

    if (comment.user.toString() !== userId) {
      return res.status(403).json({ message: "Brak uprawnień do edycji tego komentarza" });
    }

    comment.text = text;
    const updatedComment = await comment.save();

    res.status(200).json({ message: "Komentarz zaktualizowany", comment: updatedComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Wystąpił błąd podczas aktualizacji komentarza" });
  }
});

router.delete("/:id/comments/:commentId", verifyToken, async (req, res) => {
  try {
    mongooseConnect();
    const { id, commentId } = req.params;

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

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Komentarz nie znaleziony" });
    }

    if (comment.user.toString() !== userId) {
      return res.status(403).json({ message: "Brak uprawnień do usunięcia tego komentarza" });
    }

    await Comment.findByIdAndDelete(commentId);

    const commentIndex = course.comments.indexOf(commentId);
    if (commentIndex !== -1) {
      course.comments.splice(commentIndex, 1);
      await course.save();
    }

    res.status(200).json({ message: "Komentarz usunięty", comment: comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Wystąpił błąd podczas usuwania komentarza" });
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

router.delete("/:id/ratings", verifyToken, async (req, res) => {
  try {
    mongooseConnect();
    const { id } = req.params;

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
      const ratingIndex = course.ratings.indexOf(existingRating._id);
      if (ratingIndex !== -1) {
        course.ratings.splice(ratingIndex, 1);
        await course.save();
      }

      await Rating.findByIdAndDelete(existingRating._id);

      return res.status(200).json({ message: "Ocena usunięta", rating: existingRating });
    } else {
      return res.status(404).json({ message: "Ocena nie znaleziona" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Wystąpił błąd podczas usuwania oceny" });
  }
});

router.post("/:id/photos", isAdmin, verifyToken, async (req, res) => {
  try {
    mongooseConnect();
    const { id, photo_url } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Kurs nie znaleziony" });
    }
    course.course_photos.push(photo_url);
    await course.save();

    return res.status(201).json({ message: "Zdjęcie dodane", photo: photo_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Wystąpił błąd podczas dodawania zdjęcia" });
  }
})

router.post("", isAdmin, verifyToken, async (req, res) => {
  try {
    mongooseConnect();

    const { course_name, course_description, course_photos, course_category, course_price } = req.body;

    const courseInfo = {
      course_name: course_name,
      course_description: course_description,
      course_photos: course_photos,
      course_category: course_category,
      course_price: course_price,
      comments: [],
      ratings: []
    }
    
    const newCourse = new Course(courseInfo);
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


/**
 * @swagger
 * tags:
 *   name: Course
 *   description: API for managing courses, comments, and ratings
 * /course/{id}:
 *   get:
 *     summary: Get course details by ID with comments and ratings
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course details with comments and ratings
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update course details by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       200:
 *         description: Course details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 * /course:
 *   get:
 *     summary: Get all courses with comments and ratings
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: List of courses with comments and ratings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Course'
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create a new course (Admin only)
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       201:
 *         description: Course added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 course:
 *                   $ref: '#/components/schemas/Course'
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update course details by ID (Admin only)
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       200:
 *         description: Course details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete course by ID (Admin only)
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         course_name:
 *           type: string
 *         course_description:
 *           type: string
 *         course_photos:
 *           type: array
 *           items:
 *             type: string
 *         course_category:
 *           type: string
 *         course_price:
 *           type: number
 *         comments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Comment'
 *         ratings:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Rating'
 *         rating_avg:
 *           type: number
 *       required:
 *         - course_name
 *         - course_description
 *         - course_category
 *         - course_price
 *     Comment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: string
 *         course:
 *           type: string
 *         text:
 *           type: string
 *       required:
 *         - user
 *         - course
 *         - text
 *     Rating:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: string
 *         course:
 *           type: string
 *         rating:
 *           type: number
 *       required:
 *         - user
 *         - course
 *         - rating
 */

/**
 * @swagger
 * tags:
 *   name: CourseComments
 *   description: Endpoints for managing comments on courses
 * 
 * /course/{id}/comments:
 *   post:
 *     summary: Add a new comment to a course
 *     tags: [CourseComments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The course id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *             required:
 *               - text
 *     responses:
 *       201:
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal Server Error
 * 
 * /course/{id}/comments/{commentId}:
 *   put:
 *     summary: Update a comment on a course
 *     tags: [CourseComments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The course id
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: The comment id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *             required:
 *               - text
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Course or Comment not found
 *       500:
 *         description: Internal Server Error
 *   delete:
 *     summary: Delete a comment from a course
 *     tags: [CourseComments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The course id
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: The comment id
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Course or Comment not found
 *       500:
 *         description: Internal Server Error
 * 
 * /course/{id}/ratings:
 *   post:
 *     summary: Add or update a rating for a course
 *     tags: [CourseRatings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The course id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *             required:
 *               - rating
 *     responses:
 *       201:
 *         description: Rating added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 rating:
 *                   $ref: '#/components/schemas/Rating'
 *       200:
 *         description: Rating updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 rating:
 *                   $ref: '#/components/schemas/Rating'
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal Server Error
 *   delete:
 *     summary: Delete a rating from a course
 *     tags: [CourseRatings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The course id
 *     responses:
 *       200:
 *         description: Rating deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 rating:
 *                   $ref: '#/components/schemas/Rating'
 *       404:
 *         description: Course or Rating not found
 *       500:
 *         description: Internal Server Error
 */
