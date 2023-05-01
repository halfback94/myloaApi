const news_notices = require('./module/news/notices');
const news_events = require('./module/news/events');
const character_sibling = require('./module/characters/siblings');
const armories_character = require('./module/armories/character');
const armories_profiles = require('./module/armories/profiles');
const armories_equipment = require('./module/armories/equipment');
const armories_avatars = require('./module/armories/avatars');
const armories_combatSkills = require('./module/armories/combatSkills');
const armories_engravings = require('./module/armories/engravings');
const armories_cards = require('./module/armories/cards');
const armories_gems = require('./module/armories/gems');
const armories_colosseums = require('./module/armories/colosseums');
const armories_collectibles = require('./module/armories/collectibles');
const auctions_options = require('./module/auctions/options');
const auctions_items = require('./module/auctions/items');
const guilds_rankings = require('./module/guilds/rankings');
const markets_options = require('./module/markets/options');
const markets_items_by_item_id = require('./module/markets/itemsByItemId');
const markets_items = require('./module/markets/items');
const markets_itemsWithKey = require('./module/markets/itemsWithKey');
const markets_itemsAllPage = require('./module/markets/itemsAllPage');
const gamecontents_challengeAbyssDungeons = require('./module/gamecontents/challengeAbyssDungeons');
const gamecontents_challengeGuardianRaids = require('./module/gamecontents/challengeGuardianRaids');
const gamecontents_calendar = require('./module/gamecontents/calendar');

class LostarkAPI {
    async requestNotices(type) {
        return await news_notices.request(type);
    }

    async requestEvents() {
        return await news_events.request();
    }

    async requestCharacterSibling(characterName) {
        return await character_sibling.request(characterName);
    }

    async requestArmoriesCaracter(characterName) {
        return await armories_character.request(characterName);
    }

    async requestArmoriesProfile(characterName) {
        return await armories_profiles.request(characterName);
    }

    async requestArmoriesEquipment(characterName) {
        return await armories_equipment.request(characterName);
    }

    async requestArmoriesAvatars(characterName) {
        return await armories_avatars.request(characterName);
    }

    async requestArmoriesCombatSkills(characterName) {
        return await armories_combatSkills.request(characterName);
    }

    async requestArmoriesEngravings(characterName) {
        return await armories_engravings.request(characterName);
    }

    async requestArmoriesCards(characterName) {
        return await armories_cards.request(characterName);
    }

    async requestArmoriesGems(characterName) {
        return await armories_gems.request(characterName);
    }

    async requestArmoriesColosseums(characterName) {
        return await armories_colosseums.request(characterName);
    }

    async requestCollectibles(characterName) {
        return await armories_collectibles.request(characterName);
    }

    async requestAuctionsItems(requestJson) {
        return await auctions_items.request(requestJson);
    }

    async requestAuctionsOptions() {
        return await auctions_options.request();
    }

    async requestGuildsRankings(serverName) {
        return await guilds_rankings.request(serverName);
    }

    async requestMarketOptions() {
        return await markets_options.request();
    }

    async requestMarketItemsByItemId(itemId) {
        return await markets_items_by_item_id.request(itemId);
    }

    async requestMarketItems(requestJson) {
        return await markets_items.request(requestJson);
    }

    async requestMarketItemsAllPage(requestJson) {
        return await markets_itemsAllPage.request(requestJson);
    }

    async requestMarketItemsWithApiKey(key, requestJson) {
        return await markets_itemsWithKey.request(key, requestJson);
    }

    async requestChallengeAbyssDungeons() {
        return await gamecontents_challengeAbyssDungeons.request();
    }

    async requestChallengeGuardianRaids() {
        return await gamecontents_challengeGuardianRaids.request();
    }
    
    async requestCalendar () {
        return await gamecontents_calendar.request();
    }
}

const api = new LostarkAPI(); 

module.exports = {
    wrapper: api,
}