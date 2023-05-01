const LostArkAPIURL_BASE = 'https://developer-lostark.game.onstove.com';
const API_EVENTS = '/events';
const API_NOTICES = '/notices';
const API_CHARACTERS = '/characters';
const API_OPTIONS = '/options';
const API_ITEMS = '/items';
const API_RANKINGS = '/rankings';
const API_CHABYSS = '/challenge-abyss-dungeons';
const API_CHGUARDIAN = '/challenge-guardian-raids';
const API_CALENDAR = '/calendar';

// ES6
const createLostArkAPIURL = baseUrl => category => apiName => { return baseUrl + category + apiName };
// const createLostArkAPIURL = function (baseUrl) {
//     return function (category) {
//         return function (apiName) {
//             return baseUrl + category + apiName;
//         }
//     }
// }

const createCategoryURL = createLostArkAPIURL(LostArkAPIURL_BASE);

const createNewsURL = createCategoryURL('/news');
const createCharactersURL = createCategoryURL('/characters');
const createArmoriesURL = createCategoryURL('/armories');
const createAuctionsURL = createCategoryURL('/auctions');
const createGuildsURL = createCategoryURL('/guilds');
const createMarketsURL = createCategoryURL('/markets');
const createGamecontentsURL = createCategoryURL('/gamecontents');

const url_news_events = createNewsURL(API_EVENTS);
const url_news_notice = createNewsURL(API_NOTICES);
const url_character = createCharactersURL('');
const url_armories = createArmoriesURL(API_CHARACTERS);
const url_auctions_options = createAuctionsURL(API_OPTIONS);
const url_auctions_items = createAuctionsURL(API_ITEMS);
const url_guilds_rankings = createGuildsURL(API_RANKINGS);
const url_markets_options = createMarketsURL(API_OPTIONS);
const url_markets_item = createMarketsURL(API_ITEMS);
const url_gamecontents_challenge_abyss_dungeons = createGamecontentsURL(API_CHABYSS);
const url_gamecontents_challenge_guardian_raids = createGamecontentsURL(API_CHGUARDIAN);
const url_gamecontents_calendar = createGamecontentsURL(API_CALENDAR);

module.exports = {
    news_event: url_news_events,
    news_notice: url_news_notice,

    character: url_character,

    armories: url_armories,

    auctions_options: url_auctions_options,
    auctions_items: url_auctions_items,

    guilds_rankings: url_guilds_rankings,

    markets_options: url_markets_options,
    markets_item: url_markets_item,

    gamecontents_challenge_abyss_dungeons: url_gamecontents_challenge_abyss_dungeons,
    gamecontents_challenge_guardian_raids: url_gamecontents_challenge_guardian_raids,
    gamecontents_calendar: url_gamecontents_calendar,
};