const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


router.post('/login', async (request, response) => {
    const body = request.body;
    console.log("Attempting login: ",body)

    const user = await User.findOne({ username: body.username });
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(body.password, user.password);

    if (!(user && passwordCorrect)) {
        console.log("Failed login with body: ",body)
        return response.status(401).json({
            error: 'invalid username or password'
        });
    } else console.log("Successful login with body: ",body)

    const userForToken = {
        username: user.username,
        id: user._id,
    };

    const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: "3h" });

    console.log("Token generated: ",token)

    response.status(200).send({ token, username: user.username, name: user.name });
});



router.post('/', async (request, response) => {
    const body = request.body;

    if (!body.username) return response.status(400).json({ error: 'Missing username' });
    if (!body.password) return response.status(400).json({ error: 'Missing password' });

    if (body.username.length < 3) return response.status(400).json({ error: 'Username must be longer than 3 characters' });
    if (body.password.length < 3) return response.status(400).json({ error: 'Password must be longer than 3 characters' });

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const user = new User({
        username: body.username,
        name: body.name,
        password: passwordHash,
    });

    console.log("test ",body.username,body.name,body.password,passwordHash)

    try {
        const newUser = await user.save();
        response.json(newUser);
    } catch (error) {
        // https://github.com/mongodb/mongo/blob/master/src/mongo/base/error_codes.yml
        if (error.code === 11000) return response.status(400).json({ error: 'Username is already taken, choose another username' });
        else return response.status(500).json({ error: 'ERROR' });
    }
});

router.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', { title: 1, url: 1, likes: 1 }); // .populate('user', { username: 1, name: 1 })
    response.json(users);
});

module.exports = router;