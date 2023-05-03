const logger = require('../../../utils/Logger');
const MemoryCache = require('../../../utils/memoryCache');
const lostarkAPI = require('../../../lostarkAPI/lostarkAPI');

class GuildRankCache extends MemoryCache {
    constructor() {
        super(8, 1000*60);
        this.name = 'GuildRankCache';
        super.setDataFunc(GuildRankCache.loopaeon, lostarkAPI.wrapper.requestGuildsRankings.bind(null, '루페온'));
        super.setDataFunc(GuildRankCache.Silian, lostarkAPI.wrapper.requestGuildsRankings.bind(null, '실리안'));
        super.setDataFunc(GuildRankCache.aman, lostarkAPI.wrapper.requestGuildsRankings.bind(null, '아만'));
        super.setDataFunc(GuildRankCache.carmine, lostarkAPI.wrapper.requestGuildsRankings.bind(null, '카마인'));
        super.setDataFunc(GuildRankCache.chaos, lostarkAPI.wrapper.requestGuildsRankings.bind(null, '카제로스'));
        super.setDataFunc(GuildRankCache.abrelshud, lostarkAPI.wrapper.requestGuildsRankings.bind(null, '아브렐슈드'));
        super.setDataFunc(GuildRankCache.kadan, lostarkAPI.wrapper.requestGuildsRankings.bind(null, '카단'));
        super.setDataFunc(GuildRankCache.ninave, lostarkAPI.wrapper.requestGuildsRankings.bind(null, '니나브'));
    }

    static loopaeon = 0;
    static Silian = 1;
    static aman = 2;
    static carmine = 3;
    static chaos = 4;
    static abrelshud = 5;
    static kadan = 6;
    static ninave = 7;

    /**
     * 로스트아크 서버명 : idx
     */
    static serverNames = {
        '루페온': GuildRankCache.loopaeon,
        '실리안': GuildRankCache.Silian,
        '아만': GuildRankCache.aman,
        '카마인': GuildRankCache.carmine,
        '카제로스': GuildRankCache.chaos,
        '아브렐슈드': GuildRankCache.abrelshud,
        '카단': GuildRankCache.kadan,
        '니나브': GuildRankCache.ninave,
    };

}

const guildRankCache = new GuildRankCache();

module.exports = {
    getRankings: async (serverName) => {
        return await guildRankCache.getData(GuildRankCache.serverNames[serverName]);
    },
}