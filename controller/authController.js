const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');
const User = require('../modal/userSchema');
const { route } = require('express/lib/application');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Get All Users
router.get('/users',(req, res) => {
    User.find({}, (err, data) => {
        if (err) throw err;
        res.send(data);
    })
})

// Register
router.post('/register', (req, res) => {
    let hashPassword = bcrypt.hashSync(req.body.password,8);
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
        phone: req.body.phone,
        address: req.body.address,
        role: req.body.role?req.body.role:'user'
    },(err, data) => {
        if (err) return res.status(500).send('Error While Register')
        res.status(200).send('Registration Successful');
    })
})

// Login
router.post('/login', (req, res) => {
    User.findOne({email: req.body.email},(err, user) => {
        if (err) return res.status(500).send({auth:false,token:'Error While Login'})
        if(!user) return res.status(200).send({auth:false,token:'No User Found Registered'})
        else {
            passIsValid = bcrypt.compareSync(req.body.password,user.password)
            if(!passIsValid) return res.status(200).send({auth:false,token:'Invalid Password'})
            let token = jwt.sign({id: user._id},config.secret,{expiresIn:86400})
            res.status(200).send({auth:true,token:token})
        }
    })
})

// User Info
router.get('/userinfo',(req, res) => {
    let token = req.headers['x-access-token'];
    if(!token) res.send({auth:false,token:'No token Provided'})
    // Verify Token
    jwt.verify(token,config.secret, (err,user) => {
        if(err) res.send({auth:false,token:'Invalid Token'})
        User.findById(user.id,(err,result) => {
            res.send(result);
        })
    })
})

// Delete User
router.delete('delete', (req, res) => {
    User.remove({},(err, data) => {
        if(err) throw err,
        res.send("User Deleted");
    })
})

module.exports = router;