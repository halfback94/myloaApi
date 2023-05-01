const logger = require('../../../utils/Logger');
const LostarkApiUrl = require('../lostarkAPIUrl');
const requestAPI = require('../lostarkAPIRequest');

module.exports = {
    request: async () => {
        let retData = [];
        const url = LostarkApiUrl.gamecontents_challenge_abyss_dungeons;
        try {
            retData = JSON.parse(await requestAPI.API(url, "GET", null));
        } catch (error) {
            logger.log('error', `gamecontents/challenge-abyss-dungeons error : ${error}`);
        }
        
        return retData;
    }
};