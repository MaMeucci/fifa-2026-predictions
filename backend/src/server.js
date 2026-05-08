require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 3000;

// Connect to database
connectDB()
  .then(() => {
    // Start server - bind to 0.0.0.0 for Railway
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🏆 FIFA World Cup 2026 - Predictions API Server 🏆    ║
║                                                           ║
║   Environment: ${process.env.NODE_ENV || 'development'}                                    ║
║   Port: ${PORT}                                              ║
║   Database: Connected                                     ║
║                                                           ║
║   API Endpoints:                                          ║
║   - Health: http://localhost:${PORT}/health                  ║
║   - Auth: http://localhost:${PORT}/api/auth                  ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
      `);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error('Unhandled Promise Rejection:', err);
      server.close(() => {
        process.exit(1);
      });
    });

    // Handle SIGTERM
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });

// Made with Bob
