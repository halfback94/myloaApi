const logger = require('../../../utils/Logger');
const LostarkApiUrl = require('../lostarkAPIUrl');
const requestAPI = require('../lostarkAPIRequest');

module.exports = {
    request: async (requestJson) => {
        let retData = [];
        const url = LostarkApiUrl.markets_item;
        try {
            retData = JSON.parse(await requestAPI.API(url, "POST", requestJson));
        } catch (error) {
            logger.log('error', `markets/items error : ${error}`);
            logger.log('error', `markets/items requestJson : ${JSON.stringify(requestJson)}`);
        }
        
        return retData;
    }
};