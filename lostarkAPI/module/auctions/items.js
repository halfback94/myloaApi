const logger = require('../../../utils/Logger');
const LostarkApiUrl = require('../lostarkAPIUrl');
const requestAPI = require('../lostarkAPIRequest');

module.exports = {
    request: async (requestJson) => {
        let retData = {};
        const url = LostarkApiUrl.auctions_items;
        try {
            retData = JSON.parse(await requestAPI.API(url, "POST", requestJson));
        } catch (error) {
            logger.log('error', `auctions/items error : ${error}`);
            logger.log('error', `auctions/items requestJson : ${JSON.stringify(requestJson)}`);
        }
        
        return retData;
    }
};