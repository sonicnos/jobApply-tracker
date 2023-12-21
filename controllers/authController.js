const User = require('../models/User');
const NewJob = require('../models/newJob');
const jwt = require('jsonwebtoken');

//handle errors

const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email:'', password:''};

    // incorrect email
    if (err.message === 'incorrect email'){
        errors.email = 'that email is not registered'
    }

    // incorrect password
    if (err.message === 'incorect password'){
        errors.password = 'Password is wrong'
    }

    //duplicate errors
    if(err.code === 11000) {
        errors.email = "that email is already registered"
        return errors;
    }

    //validation errors
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}

const maxAge = 3 * 24 * 24 * 60 * 60
const createToken = (id) => {
    return jwt.sign({ id }, 'net ninja secret', {
        expiresIn: maxAge
    });
}

module.exports.register_get = (req, res) => {
    res.render("register");
}

module.exports.login_get = (req, res) => {
    res.render("login");
}

module.exports.newjob_get = (req, res) => {
    res.render("newJob");
}

module.exports.register_post =  async (req, res) => {
    const {firstName, lastName, email, github, password} = req.body;

    try {
        const user = await User.create({firstName, lastName, email, github, password});
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(201).json({ user: user._id });
    }catch(err){
        const errors = handleErrors(err);
        res.status(400).json({ errors })
    }
}

module.exports.login_post = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(200).json({user: user})
    } catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({ errors });
    }
}

module.exports.newjob_post = async (req, res) => {
    const token = req.cookies.jwt
    console.log(req.body);
    const newJobData = req.body
    if (token) {
        try {
            jwt.verify(token, 'crazy secret secret', async (err, decodedToken) => {
                if (err) {
                    console.log(err.message);
                    } else {
                        try {
                            let user = await User.findById(decodedToken.id)
                            const newJob = new newJob({...newJobData, user : user.id})
                            await newJob.save()
                            user.newJobs.push(newJob._id)
                            await user.save()
                            res.status(201).json({ newJob: newJob._id });
                        } catch (error) {
                            console.log(`An error occured when attempting to find the user by his ID, or when creating and saving the newJob, or when saving the id of the newJob in the user, or when saving the user : ${error}`);
                            const errors = handleErrors(error);
                            console.log("errors: ", errors);
                            res.status(400).json({ errors });

                        }
                        
                    }
                })
        } catch (error) {
            console.log("JWT token not valid : " + error);
            res.redirect('/login')
        }
        
    } else {
        res.redirect('/login')
    }
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', {maxAge: 1});
    res.redirect('/');
}