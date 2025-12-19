import express from 'express';
import Book from '../models/Book.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// GET Stats
router.get('/stats', auth, async (req, res) => {
  try {
    const books = await Book.find({ userId: req.userId });

    const totalBooks = books.length;
    const completedBooks = books.filter(b => b.status === 'completed').length;
    const readingBooks = books.filter(b => b.status === 'reading').length;

    // Calculate total pages read
    const totalPagesRead = books.reduce((acc, book) => acc + (book.pagesRead || 0), 0);

    // Calculate reading speed (if finishDate exists)
    // Simple average: Total Pages of completed books / Total Days taken
    let totalSpeed = 0;
    let speedCount = 0;

    books.forEach(book => {
      if (book.status === 'completed' && book.startDate && book.finishDate && book.totalPages) {
        const start = new Date(book.startDate);
        const end = new Date(book.finishDate);
        const days = Math.max(1, (end - start) / (1000 * 60 * 60 * 24)); // Minimum 1 day
        const speed = book.totalPages / days;
        totalSpeed += speed;
        speedCount++;
      }
    });

    const avgSpeed = speedCount > 0 ? (totalSpeed / speedCount).toFixed(1) : 0;

    res.json({
      totalBooks,
      completedBooks,
      readingBooks,
      totalPagesRead,
      avgSpeed
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const books = await Book.find({ userId: req.userId });
    res.json(books);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const book = new Book({ ...req.body, userId: req.userId });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    res.json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Book.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: 'Book deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;