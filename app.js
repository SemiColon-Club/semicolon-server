const  express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./api/routes/user');

mongoose.connect('mongodb+srv://mark42a:'+ process.env.MONGO_ATLAS_PW +'@node-api-akqto.mongodb.net/test?retryWrites=true&w=majority',{
    useNewUrlParser: true
}
);

mongoose.Promise = global.Promise;

mongoose.connection
    .once('open', () => console.log('All services working'))
    .on('error', (error) => {
        console.log("Service error", error);
    });

app.use(cors());
app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//CORS error Preventions
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});

//ROUTES handling
app.use('/users', userRoutes);

//ERROR handling
app.use((req, res, next) => {
    const error = new Error('Controller Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});

module.exports = app;