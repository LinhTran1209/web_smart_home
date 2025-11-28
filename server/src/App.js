import express from 'express';

import buildingsRoute from './routes/buildingsRoute.js';
import roomsRoute from './routes/roomsRoute.js';
import devicesRoute from './routes/devicesRoute.js';
import deviceStatesRoute from './routes/deviceStatesRoute.js';
import accountsRoute from './routes/accountsRoute.js'
import authRoute from './routes/authRoute.js'
import weatherRoute from './routes/weatherRoute.js'

import { connectDB } from './config/db.js'
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();

// Middlewares 
app.use(express.json());
app.use(cors({origin: process.env.ACCESS_DOMAIN}))

// Routes
app.use('/api/buildings', buildingsRoute);
app.use('/api/rooms', roomsRoute);
app.use('/api/devices', devicesRoute);
app.use('/api/device-states', deviceStatesRoute);
app.use('/api/accounts', accountsRoute)
app.use('/api/auth', authRoute)
app.use('/api/weather', weatherRoute)


connectDB(process.env.MONGO_URL).then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running http://localhost:${process.env.PORT}`);
    console.log(`Domain access: ${process.env.ACCESS_DOMAIN}`)
  });
});

