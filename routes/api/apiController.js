const logger = require('../../utils/Logger');
const utils = require('../../utils/utils');

const armorieService = require('./service/armorieService');
const gameContentService = require('./service/gameContentService');
const newsService = require('./service/newsService');
const marketService = require('./service/marketService');
const raidService = require('./service/raidService');
const guildService = require('./service/guildService');

module.exports = {
    sidebarEvent: async (req, res) => {
        logger.log('info',`api-sidebarEvent`);
        const jsonArray = await newsService.getEvents();
        res.send(jsonArray);
    },

    sidebarNotice: async (req, res) => {
        logger.log('info',`api-sidebarNotice`);
        const jsonArray = await newsService.getNotices(req.body.type);
        res.send(jsonArray);
    },

    armoriesCharacter: async (req, res) => {
        logger.log('info',`api-armoriesCharacter`);
        const json = await armorieService.getCharacterInfo(req.body.characterName);
        res.send(json);
    },

    challengeAbyssDungeons: async (req, res) => {
        logger.log('info',`api-challengeAbyssDungeons`);
        const jsonArray = await gameContentService.getChallengeAbyssDungeons();
        res.send(jsonArray);
    },

    challengeGuardianRaids: async (req, res) => {
        logger.log('info',`api-challengeGuardianRaids`);
        const jsonArray = await gameContentService.getChallengeGuardianRaids();
        res.send(jsonArray);
    },

    calendarToday: async (req, res) => {
        logger.log('info',`api-calendarToday`);
        const json = await gameContentService.getCalendarToday();
        res.send(json);
    },

    marketOptions: async (req, res) => {
        logger.log('info',`api-marketOptions`);
        const json = await marketService.marketOptions();
        res.send(json);
    },

    marketCategory: async (req, res) => {
        logger.log('info',`api-marketCategory`);
        //VisiterController.insertVisit(req, 'marketCategory');
        const jsonArray = await marketService.marketCategory(req.body.categories);
        res.send(jsonArray);
    },

    marketHistroyCategory: async (req, res) => {
        logger.log('info',`api-marketHistroyCategory`);
        VisiterController.insertVisit(req, 'marketHistroyCategory');
        const jsonArray = await marketService.marketHistroyCategory();
        res.send(jsonArray);
    },

    marketHistroy: async (req, res) => {
        logger.log('info',`api-marketHistroy`);
        VisiterController.insertVisit(req, 'marketHistroy');
        const jsonArray = await marketService.marketHistroy(req.body.itemName);
        res.send(jsonArray);
    },

    marketSearch: async (req, res) => {
        logger.log('info',`api-marketSearch`);
        VisiterController.insertVisit(req, 'marketSearch');
        const json = await marketService.marketSearch(req.body.reqData);
        res.send(json);
    },

    raidInfo: async (req, res) => {
        logger.log('info',`api-raidInfo`);
        VisiterController.insertVisit(req, 'raidInfo');
        const json = await raidService.getAllRaidInfo();
        res.send(json);
    },

    raidRewardList: async (req, res) => {
        logger.log('info',`api-raidRewardList`);
        VisiterController.insertVisit(req, 'raidRewardList');
        const json = await raidService.getRaidRewardList(req.body.raidname);
        res.send(json);
    },

    raidRewardItemPrice: async (req, res) => {
        logger.log('info',`api-raidRewardItemPrice`);
        VisiterController.insertVisit(req, 'raidRewardItemPrice');
        const json = await raidService.getRewardItemPrice();
        res.send(json);
    },

    guildRankings: async (req, res) => {
        logger.log('info',`api-guildRankings`);
        VisiterController.insertVisit(req, 'guildRankings');
        const json = await guildService.getRankings(req.body.serverName);
        res.send(json);
    },
}