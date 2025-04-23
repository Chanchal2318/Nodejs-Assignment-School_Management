import express from 'express';
import bodyParser from 'body-parser';
import schoolRoutes from './routes/schoolRoutes.js';

const app = express();

// Middleware to parse JSON
app.use(bodyParser.json());

// Use the school routes
app.use('/', schoolRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
