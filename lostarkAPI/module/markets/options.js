const logger = require('../../../utils/Logger');
const LostarkApiUrl = require('../lostarkAPIUrl');
const requestAPI = require('../lostarkAPIRequest');

module.exports = {
    request: async () => {
        let retData = {};
        const url = LostarkApiUrl.markets_options;
        try {
            retData = JSON.parse(await requestAPI.API(url, "GET", null));
        } catch (error) {
            logger.log('error', `markets/options error : ${error}`);
        }
        
        return retData;
    }
};