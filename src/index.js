const express = require('express');
const rateLimit = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 2 minutes
  max: 100, // Limit each IP to 3 requests per `window` (here, per 3 minutes)
});

// Enabling the Rate limiter
app.use(limiter);


// Implementing Reverse-Proxy for Flight-Services
app.use(
  '/flightservice',
  createProxyMiddleware({ target: ServerConfig.FLIGHT_SERVICE, changeOrigin: true })
);


// Implementing Reverse-Proxy for Boking-Services
app.use(
  '/bookingservice',
  createProxyMiddleware({ target: ServerConfig.BOOKING_SERVICE, changeOrigin: true })
);


app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, () => {
  console.log(`Successfully started the server at PORT : ${ServerConfig.PORT}`);
});
