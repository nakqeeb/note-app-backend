const express = require('express');
const mongoose = require('mongoose');
require("dotenv/config");

const app = express();

const noteRoutes = require('./routes/note');
const categoryRoutes = require('./routes/category');
const userRoutes = require('./routes/user');

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/notes', noteRoutes);
app.use('/categories', categoryRoutes);
app.use('/users', userRoutes);

mongoose.connect('mongodb+srv://nakqeeb:'+ process.env.MONGO_ATLAS_PW +'@cluster0.rbc72.mongodb.net/note-app').then(() => {
    console.log('Connected to database');
}).catch((err) => {
    console.log(err);
});;

const PORT = process.env.PORT || 3000;
//Server
app.listen(PORT, () => {
    console.log('server is running http://localhost:3000');
});