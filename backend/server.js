require("dotenv").config();
const express = require("express");
const { DatabaseConnection } = require("./database/index");
const mongoose = require("mongoose");
const {Logger, ErrorHandler} = require("./middlewares");
const cookieParser = require("cookie-parser");


// initializing the app
const app = express();

// connecting to the database
DatabaseConnection();

// middlewares
app.use(Logger);
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api", require("./routes/index"));

// Error handling
app.use(ErrorHandler);

// running or closing the server depending on the status of the mongodb connection
let server;
mongoose.connection.on('open', () => {
    server = app.listen(process.env.PORT || 3000, () => {
        console.log(`server running at http://localhost:${process.env.PORT || 3000}`)
    })
});

mongoose.connection.on('error', (err) => {
    console.log('Mongoose connection error, shutting down server...\n', err);
    if(server){
        server.close(() => {
            console.log('Server shut down due to MongoDB connection error');
        });
    }
});

mongoose.connection.on('close', () => {
    console.log('mongoose connection has been closed!\nShutting down server....');
    if(server){
        server.close(() => {
            console.log('server shut down due to mongodb connection close');
        })
    }
})