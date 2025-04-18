const mongoose = require('mongoose');

require('dotenv').config();

 
const connectWithDb = () => {   
    mongoose.connect(process.env.DB_URL, {
       
    }).then(() => {
        console.log('Database connected successfully');
    }).catch((error) => {
        console.log('Database connection failed');
        console.log(error);
        process.exit(1);
    });
}

module.exports = connectWithDb; 
