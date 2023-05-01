const logger = require('../../../utils/Logger');
const LostarkApiUrl = require('../lostarkAPIUrl');
const requestAPI = require('../lostarkAPIRequest');

module.exports = {
    request: async (itemId) => {
        let retData = [];
        const url = LostarkApiUrl.markets_item + '/' + itemId;
        try {
            retData = JSON.parse(await requestAPI.API(url, "GET", null));
        } catch (error) {
            logger.log('error', `markets/items/${itemId} error : ${error}`);
        }
        
        return retData;
    }
};