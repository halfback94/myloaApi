const logger = require('../../../utils/logger');
const LostarkApiUrl = require('../lostarkAPIUrl');
const requestAPI = require('../lostarkAPIRequest');

module.exports = {
    request: async () => {
        let retData = [];
        const url = LostarkApiUrl.news_event;
        try {
            const tmpList = JSON.parse(await requestAPI.API(url, "GET", null));
            if(tmpList.length > 0)
                retData = tmpList;
        } catch (error) {
            logger.log('error', `news/events error : ${error}`);
        }
    
        return retData;
    }
};