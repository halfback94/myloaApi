const logger = require('../../../utils/Logger');
const dbService = require('./dbService');
const lostarkAPI = require('../../../lostarkAPI/lostarkAPI');

module.exports = {
    
    getCharacterInfo: async (characterName) => {
        return await lostarkAPI.wrapper.requestArmoriesCaracter(characterName);
    },

};
