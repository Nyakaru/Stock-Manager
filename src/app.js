import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import route from './routes/index';

require('dotenv').config();
const app = express();

mongoose.connect('mongodb+srv://kinara:' + process.env.DB_PWD + '@stock-manager-bha5c.mongodb.net/test?retryWrites=true&w=majority');

app.use(morgan('dev'));
app.use('/uploads' ,express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req,res,next) => {
    res.header('Acess-Control-Allow-Origin', '*');
    res.header('Acess-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header('Acess-Control-Allow-Methods', 'PUT, PATCH, POST, GET, DELETE');
        return res.status(200).json({});
    }
    next();
});

route(app);

app.use((req, res, next) => {
    const error = new Error('Please use /api/v1/<specific resource> to acess the API');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message
      }
    });
});

app.listen(4500, (err)=> {
  console.log("Server running running on port 4500")
})

export default app;
