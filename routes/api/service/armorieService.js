const logger = require('../../../utils/logger');
const dbService = require('./dbService');
const lostarkAPI = require('../../../lostarkAPI/lostarkAPI');

module.exports = {
    
    getCharacterInfo: async (characterName) => {
        return await lostarkAPI.wrapper.requestArmoriesCaracter(characterName);
    },

};
