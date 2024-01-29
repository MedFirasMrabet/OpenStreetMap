const express = require('express');
const cors = require('cors');
const connectDB = require('./connection');
const geoJSONRoutes = require('./routes/geoJSONRoutes');
require('dotenv').config();

const app = express();

connectDB();

app.use(cors());
app.use('/', geoJSONRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server listening at http://localhost:${process.env.PORT}`);
});
