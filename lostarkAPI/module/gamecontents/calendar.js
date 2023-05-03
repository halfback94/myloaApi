const logger = require('../../../utils/logger');
const LostarkApiUrl = require('../lostarkAPIUrl');
const requestAPI = require('../lostarkAPIRequest');

module.exports = {
    request: async () => {
        let retData = [];
        const url = LostarkApiUrl.gamecontents_calendar;
        try {
            retData = JSON.parse(await requestAPI.API(url, "GET", null));
        } catch (error) {
            logger.log('error', `gamecontents/calendar error : ${error}`);
        }
        
        return retData;
    }
};