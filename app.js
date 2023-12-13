const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser())

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://loukas:Louk195@cluster0.ccqugrg.mongodb.net/node-auth';
console.log("connected to db");
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser);
app.get('/', requireAuth, (req, res) => res.render('dashboard'));
app.get('/myprofile', requireAuth, (req, res) => res.render('myprofile'))
app.get('/newjob', requireAuth, (req, res) => res.render('newjob'));
app.use(authRoutes);
