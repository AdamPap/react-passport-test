if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}
// console.log(process.env.TEST)

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
const stripe = require("stripe")(process.env.STRIPE_SECRET)

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
                console.log("==>Successful login")
                // res.redirect('/subscription')
                res.send("Successful login")
                console.log(req.user.username)
            })
        }
    })(req, res, next)
})

// app.post('/login', passport.authenticate("local", {
//     function(req, res) {
//         console.log(req.user)
//         req.session.user = req.user.id
//         res.redirect('/subscription')
//     }
//     // successRedirect: '/subscription',
//     // failureRedirect: '/auth'
// }))

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = await User.findOne({ username })
        if (!user) {
            const hashedPassword = await bcrypt.hash(password, 10)
            const newUser = new User({
                username,
                email,
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
    console.log(req.user.username)
    res.send(req.user)
});

app.post('/createSubscription', async (req, res) => {
    console.log("===> in create subscription")
    console.log(req.user.username)
    console.log(req.body)
    if (!req.user) throw new Error("Not authenticated.");

    const user = await User.findOne({ username: req.user.username })
    if (!user) throw new Error("User not found.")


    const customer = await stripe.customers.create({
        email: user.email,
        source: req.body.source,
        plan: process.env.STRIPE_PRICE_ID,
        description: 'test customer'
    })

    user.stripeId = customer.id;
    user.type = 'premium'
    await user.save();

    console.log(user)


    // const subscription = await stripe.subscriptions.create({
    //     customer: customer.id,
    //     items: [
    //         { price: process.env.STRIPE_PRICE_ID },
    //     ],
    // });
    // console.log(subscription)

    res.send(user.username)
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
});