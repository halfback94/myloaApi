const logger = require('../../../utils/Logger');
const LostarkApiUrl = require('../lostarkAPIUrl');
const requestAPI = require('../lostarkAPIRequest');

module.exports = {
    request: async (serverName) => {
        let retData = [];
        const url = LostarkApiUrl.guilds_rankings + '?serverName=' + encodeURIComponent(serverName);
        try {
            retData = JSON.parse(await requestAPI.API(url, "GET", null));
        } catch (error) {
            logger.log('error', `guilds/rankings(${serverName}) error : ${error}`);
        }
        
        return retData;
    }
};