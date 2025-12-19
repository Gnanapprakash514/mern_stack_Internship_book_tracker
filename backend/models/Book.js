import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  status: { type: String, enum: ['want-to-read', 'reading', 'completed'], default: 'want-to-read' },
  totalPages: { type: Number },
  pagesRead: { type: Number, default: 0 },
  rating: { type: Number, min: 1, max: 5 },
  notes: { type: String },
  startDate: { type: Date },
  finishDate: { type: Date },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dateAdded: { type: Date, default: Date.now }
});

export default mongoose.model('Book', bookSchema);