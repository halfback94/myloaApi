const express = require("express");
const router = express.Router();
const controller = require('./apiController');

router.post('/sidebarEvent', controller.sidebarEvent);
router.post('/sidebarNotice', controller.sidebarNotice);

router.post('/armoriesCharacter', controller.armoriesCharacter);

router.post('/challengeAbyssDungeons', controller.challengeAbyssDungeons);
router.post('/challengeGuardianRaids', controller.challengeGuardianRaids);
router.post('/calendarToday', controller.calendarToday);

router.post('/marketOptions', controller.marketOptions);
router.post('/marketCategory', controller.marketCategory);
router.post('/marketHistroyCategory', controller.marketHistroyCategory);
router.post('/marketHistroy', controller.marketHistroy);
router.post('/marketSearch', controller.marketSearch);

router.post('/raidInfo', controller.raidInfo);
router.post('/raidRewardList', controller.raidRewardList);
router.post('/raidRewardItemPrice', controller.raidRewardItemPrice);

router.post('/guildRanking', controller.guildRankings);

module.exports = router;