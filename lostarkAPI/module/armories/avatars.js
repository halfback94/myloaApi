const logger = require('../../../utils/Logger');
const LostarkApiUrl = require('../lostarkAPIUrl');
const requestAPI = require('../lostarkAPIRequest');

module.exports = {
    request: async (characterName) => {
        let retData = [];
        const url = LostarkApiUrl.armories + '/' + encodeURIComponent(characterName) + '/avatars';
        try {
            retData = JSON.parse(await requestAPI.API(url, "GET", null));
        } catch (error) {
            logger.log('error', `armories/character/${characterName}/avatars error : ${error}`);
        }
        
        return retData;
    }
};