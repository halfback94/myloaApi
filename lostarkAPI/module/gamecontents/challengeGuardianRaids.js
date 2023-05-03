const logger = require('../../../utils/logger');
const LostarkApiUrl = require('../lostarkAPIUrl');
const requestAPI = require('../lostarkAPIRequest');

module.exports = {
    request: async () => {
        let retData = {};
        const url = LostarkApiUrl.gamecontents_challenge_guardian_raids;
        try {
            retData = JSON.parse(await requestAPI.API(url, "GET", null));
        } catch (error) {
            logger.log('error', `gamecontents/challenge-guardian-raids error : ${error}`);
        }
        
        return retData;
    }
};