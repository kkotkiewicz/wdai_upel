const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("./UserModel");

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
  if (!req.user || req.user.user_role !== true) {
    return res.status(403).json({ message: "Brak uprawnień administratora" });
  }
  next();
};

router.post("/login", async (req, res) => {
try {
    const { user_email, user_password } = req.body;

    const user = await User.findOne({ user_email });
    if (!user) {
    return res.status(401).json({ message: "Nieprawidłowy adres e-mail lub hasło" });
    }

    const passwordMatch = await bcrypt.compare(user_password, user.user_password);
    if (!passwordMatch) {
    return res.status(401).json({ message: "Nieprawidłowy adres e-mail lub hasło" });
    }

    const token = jwt.sign({ user: { id: user._id } }, "wdai_project", { expiresIn: "1h" });

    res.status(200).json({ message: "Logowanie udane", token });
} catch (error) {
    console.error(error);
    res.status(500).json({ message: "Wystąpił błąd podczas logowania" });
}
});

router.post("/register", async (req, res) => {
try {
    const { user_firstname, user_lastname, user_email, user_password } = req.body;

    const existingUser = await User.findOne({ user_email });
    if (existingUser) {
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

router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Wystąpił błąd podczas pobierania użytkowników" });
  }
});

router.get("/:id", verifyToken, async (req, res) => {
  try {
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
