const express = require('express');
const cors = require('cors');
const app = express();
const conn = require('./db/conn');

app.use(cors({credentials:true,origin:'http://localhost:3000'}))
app.use(express.json())
app.use(express.static('public'))

const userRoutes = require('./routes/userRoutes');
const petRoutes = require('./routes/petRoutes');

app.use('/users',userRoutes);
app.use('/pets',petRoutes);

app.listen(5000)