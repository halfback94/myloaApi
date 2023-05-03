const https = require('https');
const app = require('./app');
const logger = require('./utils/logger');
const batchService = require('./batch/batchService');
const auth = require('./auth/auth');

const PORT = 2087;
const server = https.createServer(auth.optionsCA, app);

server.listen(PORT, () => {
    logger.log('info', `Server running(${PORT}), INSTANCE_ID(${process.env.INSTANCE_ID})`);
    console.log('docker TEST!!');

    if(process.env.INSTANCE_ID == '0') {
      batchService.startUpJob();
      batchService.marketDB_savePriceHistory('0 10 0 * * *');
      batchService.marketDB_calculateAvgPriceWeek('0 20 0 * * *');
      batchService.calendarDB_saveCalendar('0 10 10 * * *');
    }
});