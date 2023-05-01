const schedule = require('node-schedule');
const logger = require('../utils/Logger');

const marketService = require('../routes/api/service/marketService');
const gameContentService = require('../routes/api/service/gameContentService');

module.exports = {
    /**
     * 서비스 부팅시 동작. 
     */
    startUpJob: () => {
        logger.log('info', `batchService startUpJob START!`);
        marketService.batchMarketDBAvgPrice();
        gameContentService.saveCalendar();
    },

    /** 테스트  */
    testJob: (time, log) => {
        logger.log('info', `batchService SET(${time}) testJob`);
        
        return schedule.scheduleJob(time, () => {
            logger.log('info', `batchService testJob ${log}`);
        });
    },

    /** marketDB 내부 아이템들의 최근 일주일간 평균 가격 업데이트
     * 
     * @param { Date } time 
     * @returns { schedule } 
     */
    marketDB_calculateAvgPriceWeek: (time) => {
        logger.log('info', `batchService SET(${time}) marketDB_calculatAvgPriceWeek`);
        
        return schedule.scheduleJob(time, () => {
            logger.log('info', `batchService marketDB_calculatAvgPriceWeek START!`);
            marketService.batchMarketDBAvgPrice();
        });
    },

    /** marketDB 내부 아이템들의 최근 일주일간 거래 가격 업데이트
     * 
     * @param { Date } time 
     * @returns { schedule } 
     */
    marketDB_savePriceHistory: (time) => {
        logger.log('info', `batchService SET(${time}) marketDB_calculateAvgPriceWeek`);

        return schedule.scheduleJob(time, () => {
            logger.log('info', `batchService marketDB_calculateAvgPriceWeek START!`);
            marketService.batchMarketDBHistory();
        });
    },

    /** calendarDB 일주일간의 켈린더 일정 업데이트
     * 
     * @param { Date } time 
     * @returns { schedule }
     */
    calendarDB_saveCalendar: (time) => {
        logger.log('info', `batchService SET(${time}) calendarDB_saveCalendar`);

        return schedule.scheduleJob(time, () => {
            logger.log('info', `batchService calendarDB_saveCalendar START!`);
            gameContentService.saveCalendar();
        });
    },
};