const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');


//Rotaları import edelim
const projectRoutes = require('./routes/projectRoutes');
const authRoutes = require('./routes/authRoutes');



const app = express();

app.use(helmet());
app.use(cors());

//Geliştirme ortamında loglama
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

//Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60* 1000, 
    max: 100,
    standartHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);


//Body parser
app.use(express.json({limit:'10kb'}));
app.use(express.urlencoded({extended:true,limit:'10kb'}));


//Rotaları kullan
app.use('/api/projects', projectRoutes);
app.use('/api/auth', authRoutes);

app.use(errorHandler);

module.exports = app;
