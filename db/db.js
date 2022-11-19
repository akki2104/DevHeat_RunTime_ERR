const mongoose = require('mongoose');
const DB = process.env.DATABASE;
mongoose.connect(DB,
    // {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useUnifiedTopology: true,
    // useFindAndModify: false
    // }, 
(err) => {
    if (err) console.log("Error error everywhere")
    else console.log("Database created!");
    // db.close();
})

// module.exports = connectTOMongo;