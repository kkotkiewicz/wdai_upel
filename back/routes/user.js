const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");
const mongooseConnect = require("../lib/mongoose");

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

router.post("/login", async (req, res) => {
  try {
    mongooseConnect();
    const { user_email, user_password } = req.body;

    const user = await User.findOne({ user_email: user_email });
    if (!user) {
      return res.status(401).json({ message: "Nieprawidłowy adres e-mail lub hasło" });
    }

    const passwordMatch = await bcrypt.compare(user_password, user.user_password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Nieprawidłowy adres e-mail lub hasło" });
    }

    const token = jwt.sign({ user: { id: user._id } }, "wdai_project", { expiresIn: "1h" });

    res.status(200).json({ message: "Logowanie udane", token: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Wystąpił błąd podczas logowania" });
  }
});

router.post("/register", async (req, res) => {
try {
    mongooseConnect();
    const user_firstname = req.body.user_firstname;
    const user_lastname = req.body.user_lastname;
    const user_email = req.body.user_email;
    const user_password = req.body.user_password;

    const existingUser = await User.find({ user_email: user_email });
    if (existingUser.length !== 0) {
    return res.status(400).json({ message: "Użytkownik o tym adresie e-mail już istnieje" });
    }

    const hashedPassword = await bcrypt.hash(user_password, 10);

    const newUser = new User({
    user_firstname,
    user_lastname,
    user_email,
    user_password: hashedPassword,
    });

    const savedUser = await newUser.save();

    res.status(201).json({ message: "Rejestracja udana", user: savedUser });
} catch (error) {
    console.error(error);
    res.status(500).json({ message: "Wystąpił błąd podczas rejestracji" });
}
});

router.get("", verifyToken, isAdmin, async (req, res) => {
  try {
    mongooseConnect();
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Wystąpił błąd podczas pobierania użytkowników" });
  }
});

router.get("/:id", verifyToken, async (req, res) => {
  try {
    mongooseConnect();
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Użytkownik nie znaleziony" });
    }

    if (req.user.user_role !== true && req.user.id !== user.id) {
      return res.status(403).json({ message: "Brak uprawnień do edycji tego konta" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Wystąpił błąd podczas pobierania użytkownika" });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  try {
    mongooseConnect();
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Użytkownik nie znaleziony" });
    }

    if (req.user.user_role !== true && req.user.id !== user.id) {
      return res.status(403).json({ message: "Brak uprawnień do edycji tego konta" });
    }

    const { user_firstname, user_lastname, user_email, user_photo } = req.body;
    user.user_firstname = user_firstname || user.user_firstname;
    user.user_lastname = user_lastname || user.user_lastname;
    user.user_email = user_email || user.user_email;
    user.user_photo = user_photo || user.user_photo;

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Wystąpił błąd podczas aktualizacji użytkownika" });
  }
});

router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    mongooseConnect();
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Użytkownik nie znaleziony" });
    }

    if (req.user.id === user.id) {
      return res.status(403).json({ message: "Nie możesz usunąć swojego konta" });
    }

    await user.remove();
    res.status(200).json({ message: "Użytkownik został usunięty" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Wystąpił błąd podczas usuwania użytkownika" });
  }
});

module.exports = router;


/**
 * @swagger
 * tags:
 *   name: User
 *   description: API for managing user authentication, registration, and administration. All endpoints (except register) require Authentication.
 * /user/login:
 *   post:
 *     summary: Authenticate user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_email:
 *                 type: string
 *               user_password:
 *                 type: string
 *             required:
 *               - user_email
 *               - user_password
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_firstname:
 *                 type: string
 *               user_lastname:
 *                 type: string
 *               user_email:
 *                 type: string
 *               user_password:
 *                 type: string
 *             required:
 *               - user_firstname
 *               - user_lastname
 *               - user_email
 *               - user_password
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: User with this email already exists
 *       500:
 *         description: Internal server error
 * /user:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 * /user/{id}:
 *   get:
 *     summary: Get user by ID (Admin only for other users than user sending request)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       403:
 *         description: Insufficient permissions to view user details
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update user details by ID (Admin only for other users than user sending request)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       403:
 *         description: Insufficient permissions to update user details
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete user by ID (Admin only)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       403:
 *         description: Insufficient permissions to delete user
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user_firstname:
 *           type: string
 *         user_lastname:
 *           type: string
 *         user_email:
 *           type: string
 *         user_photo:
 *           type: string
 *         user_role:
 *           type: boolean
 *       required:
 *         - user_firstname
 *         - user_lastname
 *         - user_email
 *         - user_role
 */