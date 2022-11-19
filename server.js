// if(process.env.NODE_ENV !== "production"){
//     require("dotenv").config()
// }

const mongoose = require('mongoose');
const DB = process.env.DATABASE;
const dotenv = require("dotenv")
dotenv.config({ path: './config.env' })
require('./db/db')


const User = require('./model/userSchema')
const PORT = process.env.PORT;



//Important Libraries

const express = require("express")
const app = express()
const path = require("path")
const bcrypt = require("bcrypt") //importing bcrypt package
// const initializePassport = require("./passport-config")
// const passport = require("passport")
const flash = require("express-flash")
const session = require("express-session")
const methodOverride = require("method-override");
const { monitorEventLoopDelay } = require('perf_hooks');
const mongo = require('mongodb').MongoClient;
const http=require("http").createServer(app);
const io=require("socket.io")(http);

app.use(express.urlencoded({extended:true}))
// const connectTOMongo = require('./db/db')

app.use(express.static(__dirname+"/public"));


// app.use(require('./router/auth'))



// initializePassport(
//     passport,
//     email => users.find(user => user.email === email),
//     id => users.find(user => user.id === id)
// )

// const users=[]

// app.use(express.urlencoded({ extended: false }))
app.use('/', express.static(path.join(__dirname, "/")))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, // we want to save the session variable if nothing is changed
    saveUninitialized: false,
    cookie: {maxAge: null}
}))
app.use(methodOverride("_method"))
// app.use(passport.initialize())
// app.use(passport.session())




//handlebar
// const handlebars = require('express3-handlebars').create()
// app.engine('handlebars',handlebars.engine)
// app.set('view engine','handlebars')
// //flash message middleware
// app.use((req,res,next)=>{
//     res.locals.message = req.session.message
//     delete req.session.message
//     next()
// })

// app.post('/login',async (req,res)=>{
//     const {email,password} =req.body;
//     const userLogi = await User.findOne({ email: email });

//     // if(req.body.name ==)

//     if (userLogi) {
//         if(await bcrypt.compare(password, userLogi.password)){
//             req.session.message = {
//                 type: 'danger',
//                 intro: 'Empty Fields',
//                 message: 'Please insert all fields'
//             }

//         }
//         else{
//             req.session.message = {
//                 type: 'danger',
//                 intro: 'Empty Fields',
//                 message: 'Please insert all fields'
//             }
//             console.log('password wrong')
//         }
//     }
// })




// DB Connection
// connectTOMongo();

//Configuring the register post functionality 
app.post("/login",async (req,res)=>{
    try {
        const {email,password} =req.body;
        const userLogin = await User.findOne({ email: email });

        if (userLogin) {
            // User found
            // return res.status(422).json({ error: "Email already Exist" });
            console.log("user exist");
            // res.redirect("/")

            // check if entered password is equal to original password
            if(await bcrypt.compare(password, userLogin.password)){
                // Password is correct
                // redirect to landing page
                console.log("Password correct")

                res.redirect("/index")

            }else{
                console.log("Password incorrect")
                res.session.message = {
                    type: 'danger',
                    intro: 'Empty Fields',
                    message: 'Please insert all fields'
                }
                // res.send(req.flash('message'));
                // alert("message")
                // Password is incorrect
                // Show error on login page
            }
        }else{
            // no user found

            console.log("user does not exists")
        }        
    } catch (err) {
        // res.redirect("/register")
    }
})
// app.post('/login', function(req, res) {     
//     mongo.connect(DB, function(err, db) {
//         // Look for username
//         const { name, email, password } = req.body;
//         db.collection('users').findOne({
//             email:email,
//         }, function(err, item) {
//             if (err) return res.send();

//             // If the username is not found or the login password doesn't match the user's password
//             if (!item) {
//                 console.log("The username is not valid\n");
//                 res.render('login', { lerr: true });
//             } else {
//                 if (req.body.loginPword !== item.password) {
//                     console.log("The password is not correct\n");
//                     res.render('login', { lerr: true });
//                 } else {
//                     console.log("The entry is correct!\n");
//                     res.redirect('/');
//                 }
//             }
//             db.close();
//         });
//     });
// });


//Configuring the register post functionality 
app.post("/register", async (req, res) => {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const { name, email, password } = req.body;

    try {
        const userExist = await User.findOne({ email: email });

        if (userExist) {
            // return res.status(422).json({ error: "Email already Exist" });
            console.log("userexist");
            res.redirect("./login")
        }
        const user = new User({ name: name, email: email, password: hashPassword })
        await user.save();
        // if (userRegister) {
        //     console.log(user);
        // }
        // else {
        //     console.log("Unable to register");
        // }
        res.redirect("./login")


    } catch(err){
        console.log(err);
        res.redirect("/login")
    }
});
// users.push({
//     id: Date.now().toString(),
//     name: req.body.name,
//     email: req.body.email,
//     password: hashPassword
// })
// console.log(users); //Display newly registered users in the console


//Routes



app.get('/index', (req, res) => {
    res.render("index.ejs")
})
app.get('/chat', (req, res) => {
    res.render(__dirname+"/chatsection.ejs")
})
app.get('/', (req, res) => {
    res.render("home.ejs")
})
app.get('/login',(req, res) => {
    res.render("login.ejs")
})
app.get('/register',(req, res) => {
    res.render("register.ejs")
})
app.get('/bmi', (req, res) => {
    res.render("bmi.ejs")
})
app.get('/bmr', (req, res) => {
    res.render("bmr.ejs")
})
app.get('/bfc', (req, res) => {
    res.render("bfc.ejs")
})
app.get('/diet', (req, res) => {
    res.render("diet.ejs")
})
//End Routes

app.delete("/logout", (req, res) => {
    req.logout(req.user, err => {
        if (err) return next(err)
        res.redirect("/")
    })
    // res.redirect("/login")
})



function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect("/login")
}
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/")
    }
    next()
}

http.listen(PORT, () => {
    // connectTOMongo()
    console.log("Server Running ... 3000}");
})

//passport-local-> help loging in through email, password
//express-session-> help us store sessions across our application
//express-flash-> display flash messages




//socket


io.on("connection",(socket)=>{
    
    socket.on("outgoing",(msg)=>{
            socket.broadcast.emit("outgoing",msg)
    });
});