import {User} from "../models/User.models.js";
import admin from 'firebase-admin';

export const register = async (req, res) => {
  try {
    const { email, role, firebaseUid } = req.body;

    const existingUser = await User.findOne({ firebaseUid });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      email,
      role,
      firebaseUid,
      isVerified: false
    });

    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { uid, email, role } = req.body;

    let user = await User.findOne({ firebaseUid: uid });

    if (user) {
      user.email = email;
      if (role) user.role = role;
      await user.save();
    } else {
      user = new User({
        firebaseUid: uid,
        email,
        role,
        isVerified: false
      });
      await user.save();
    }

    res.json(user);
  } catch (error) {
    console.error('Update User Error:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
};

export const getUser = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error('Get User Error:', error);
    res.status(500).json({ message: 'Failed to get user details' });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { uid } = req.body;
    const user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.isVerified = true;
    await user.save();
    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verify Email Error:', error);
    res.status(500).json({ message: 'Email verification failed' });
  }
};