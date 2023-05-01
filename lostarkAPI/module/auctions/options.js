const logger = require('../../../utils/Logger');
const LostarkApiUrl = require('../lostarkAPIUrl');
const requestAPI = require('../lostarkAPIRequest');

module.exports = {
    request: async () => {
        let retData = {};
        const url = LostarkApiUrl.auctions_options;
        try {
            retData = JSON.parse(await requestAPI.API(url, "GET", null));
        } catch (error) {
            logger.log('error', `auctions/options error : ${error}`);
        }
        
        return retData;
    }
};