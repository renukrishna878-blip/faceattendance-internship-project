require('dotenv').config();
const app = require('./src/app');
// Database connection initialization is handled inside db.js but we require it here
require('./src/config/db'); 

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle termination signals from Electron parent process
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully.');
  server.close(() => {
    process.exit(0);
  });
});

// If spawned as a child process (e.g. by Electron), it can receive messages or disconnect
process.on('disconnect', () => {
  console.log('Parent process disconnected. Shutting down.');
  server.close(() => {
    process.exit(0);
  });
});
