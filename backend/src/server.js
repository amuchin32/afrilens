const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log('=================================');
    console.log('  AfriLENS API Server Running');
    console.log('  Port: ' + PORT);
    console.log('  Mode: ' + process.env.NODE_ENV);
    console.log('  URL:  http://localhost:' + PORT);
    console.log('=================================');
  });
});
