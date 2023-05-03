const logger = require('../../../utils/logger');
const LostarkApiUrl = require('../lostarkAPIUrl');
const requestAPI = require('../lostarkAPIRequest');

module.exports = {
    request: async (type) => {
        let retData = [];
        const url = LostarkApiUrl.news_notice + '?type=' + encodeURIComponent(type);
        try {
            const tmpList = JSON.parse(await requestAPI.API(url, "GET", null));
            if(tmpList.length > 0)
                retData = tmpList;
        } catch (error) {
            logger.log('error', `news/notices error : ${error}`);
        }
    
        return retData;
    }
};