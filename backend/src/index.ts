import express from 'express';
import cors from 'cors';
import memoRoutes from './routes/memo.routes.js';

const app = express();
const port = process.env.BACKEND_PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://run.club012.com', 'https://run.club012.com', 'http://localhost:4001', 'http://192.168.219.40:4001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Routes
app.use('/api/memos', memoRoutes);

app.listen(port, () => {
  console.log(`🚀 Backend API server (Restructured TS) listening on port ${port}`);
});
