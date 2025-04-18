const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'ai'], required: true },
  content: { type: String, required: true }
});

const historyEntrySchema = new mongoose.Schema({
  label: { type: String, required: true }, 
  messages: [messageSchema]
});

const historySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  history: [historyEntrySchema]
});

module.exports = mongoose.model("History", historySchema);