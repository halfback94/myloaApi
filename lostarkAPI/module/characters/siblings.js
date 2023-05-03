const logger = require('../../../utils/logger');
const LostarkApiUrl = require('../lostarkAPIUrl');
const requestAPI = require('../lostarkAPIRequest');

module.exports = {
    request: async (characterName) => {
        let retData = [];
        const url = LostarkApiUrl.character + '/' + encodeURIComponent(characterName) + '/siblings';
        try {
            const tmpList = JSON.parse(await requestAPI.API(url, "GET", null));
            if(tmpList.length > 0)
                retData = tmpList;
        } catch (error) {
            logger.log('error', `characters/${characterName}/siblings error : ${error}`);
        }
        
        return retData;
    }
};