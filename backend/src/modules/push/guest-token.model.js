'use strict';
const mongoose = require('mongoose');

const guestTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

const GuestToken = mongoose.model('GuestToken', guestTokenSchema);
module.exports = { GuestToken };
