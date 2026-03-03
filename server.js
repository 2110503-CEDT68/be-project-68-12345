const { setServers } = require("node:dns/promises");

setServers(["1.1.1.1", "8.8.8.8"]);

const {xss} = require('express-xss-sanitizer');
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 10*60*1000,
    max: 100
});
const hpp = require('hpp');

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Library API',
      version: '1.0.0',
      description: 'A simple Express VacQ API'
    },
    servers:[
        {
            url: 'http://localhost:5000/api/v1'
        }
    ],
  },
  apis: ['./routes/*.js'],
};


const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');

// โหลด env ก่อน
dotenv.config({ path: './config/config.env' });

const hospitals = require('./routes/hospitals');
const appointments = require('./routes/appointments');

const auth = require('./routes/auth');

const connectDB = require('./config/db');

//const mongoSanitize = require('express-mongo-sanitize');

// ค่อย connect DB
connectDB();

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(xss());
app.use(limiter);
app.use(hpp());
app.use(cors());
//app.use(mongoSanitize());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
app.use('/api/v1/hospitals', hospitals);
app.use('/api/v1/auth', auth);
app.use('/api/v1/appointments', appointments);
app.set('query parser', 'extended');

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.status(200).send("Server is running");
});

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err, promise)=> {
    console.log(`Error: ${err.message}`);
    server.close(()=>process.exit(1));
});