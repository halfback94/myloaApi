const logger = require('../../../utils/logger');
const LostarkApiUrl = require('../lostarkAPIUrl');
const requestAPI = require('../lostarkAPIRequest');

module.exports = {
    request: async (key, requestJson) => {
        let retData = {success : false, header : null, data : {}};
        const url = LostarkApiUrl.markets_item;
        try {
            const response = await requestAPI.UserKeyAPI(key, url, "POST", requestJson);
            if(response.responseText.length > 0) {
                retData.success = true;
                retData.header = response.getResponseHeader('x-ratelimit-remaining');
                retData.data = JSON.parse(response.responseText);
            }
        } catch (error) {
            logger.log('error', `markets/items withKey error : ${error}`);
            logger.log('error', `markets/items withKey apikey : ${key}`);
            logger.log('error', `markets/items withKey requestJson : ${JSON.stringify(requestJson)}`);
        }
        
        return retData;
    }
};