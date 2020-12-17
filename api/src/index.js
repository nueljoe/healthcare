import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import routers from './routes';
import { NotFoundError } from './errors';

const app = express();

// LOGGING WITH MORGAN
app.use(morgan('dev'));

// Enable CORS
app.use(cors());

// GLOBAL MIDDLEWARE
// Security Header
app.use(helmet());

// Rate Limiter for requests from same IP
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests. Please try again in an hour'
});

app.use(limiter);

// XSS Clean
app.use(xss());

// Compress Text
app.use(compression());


// HANDLE REQUEST BODY AND FORMS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define the public directory
app.use(express.static(`${__dirname}/public`));

// The Great Portal into the API...lol
app.use('/api', routers);


app.use('/', (req, res, next) => {
    res.json({
        status: 'success',
        message: 'The server is active',
        data: {
            id: 1,
            label: 'Server 1 is live'
        }
    });
});

// Define the 404 response
app.use('*', (req, res, next) => {
    try {
        throw new NotFoundError();
    } catch (error) {
        next(error);
    }
});

// Define the error response
app.use((err, req, res, next) => {
    console.log(err);

    const message = err.statusCode ? err.message : 'Internal server error. We are working it. Please try again later.';
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        status: 'error',
        message,
    });
});

app.set('PORT', process.env.PORT || 8051);

app.listen(app.get('PORT'), () => {
    console.log(`Server is now running at port ${app.get('PORT')}`)
});
