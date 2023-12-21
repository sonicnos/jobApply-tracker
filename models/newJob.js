const mongoose = require('mongoose');

const newJobSchema = new mongoose.Schema({

  // user may not be necessary but heh.

  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // only title is required in order to prevent creating an empty offer

  title: {  type: String,
            required: [true, 'Please enter a title']
  },
  company: { type: String, },
  website: { type: String, },
  contact: {
    name: { type: String, },
    email: { type: String, },
    phone: { type: String, },
    address: { type: String, },
  },
  origin: { type: String, },
  status: { type: String, },
  comment: { type: String, },
});

const NewJob = mongoose.model('newJob', newJobSchema);

module.exports =  NewJob;