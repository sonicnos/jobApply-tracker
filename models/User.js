const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String,
  },
  cv: {
    type: String,
  },
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valide email']
  },
  github: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please enter an password'],
    minLength: [6, 'Minimun password length is 6 characters']
  },
  NewJob: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NewJob",
  }
});

// fire a function after doc saved to db
userSchema.post('save', function(doc, next) {
  console.log('new user was created & saved', doc);
  next()
});

// fire a function before doc saved to db
userSchema.pre('save', async function(next) {
  console.log('user about to be created & saved', this);
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next()
})

// static method to login user
userSchema.statics.login = async function(email, password){
  const user = await this.findOne({ email: email});
  if (user) {
     auth = await bcrypt.compare(password, user.password);
     if(auth) {
      return user;
     }
     throw Error ('incorect password');
  }
  throw Error('incorrect email')
}

const User = mongoose.model('user', userSchema);

module.exports = User;