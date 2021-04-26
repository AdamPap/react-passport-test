const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const session = require("express-session");
const User = require("./models/user")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors(({
    origin: "http://localhost:3000",
    credentials: true
})))
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}))
app.use(cookieParser("secret"))

app.use(passport.initialize())
app.use(passport.session());
require("./passportConfig")(passport);




mongoose.connect('mongodb://localhost:27017/test-react-passport',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, () => {
        console.log("Connected to DB")
    })

app.post('/login', (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) throw err;
        if (!user) res.send("User doesn't exist")
        else {
            req.login(user, err => {
                if (err) throw err
                res.send("Successful login")
                console.log(req.user)
            })
        }
    })(req, res, next)
});
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username })
        if (!user) {
            const hashedPassword = await bcrypt.hash(password, 10)
            const newUser = new User({
                username,
                password: hashedPassword
            })
            await newUser.save()
            console.log("=> User created")
        } else {
            console.log("user exists")
        }
    } catch (err) {
        console.log(err)
    }
});
app.get('/user', (req, res) => {
    res.send(req.user)
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
});