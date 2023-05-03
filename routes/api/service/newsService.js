const logger = require('../../../utils/logger');
const MemoryCache = require('../../../utils/memoryCache');
const lostarkAPI = require('../../../lostarkAPI/lostarkAPI');

class NewsCache extends MemoryCache {
    constructor() {
        super(5, 1000*60*60);
        this.name = 'NewsCache';
        super.setDataFunc(NewsCache.events, lostarkAPI.wrapper.requestEvents);
        super.setDataFunc(NewsCache.notices_notification, lostarkAPI.wrapper.requestNotices.bind(null, '공지'));
        super.setDataFunc(NewsCache.notices_inspection, lostarkAPI.wrapper.requestNotices.bind(null, '점검'));
        super.setDataFunc(NewsCache.notices_shop, lostarkAPI.wrapper.requestNotices.bind(null, '상점'));
        super.setDataFunc(NewsCache.notices_event, lostarkAPI.wrapper.requestNotices.bind(null, '이벤트'));
    }

    static events = 0;
    static notices_notification = 1;
    static notices_inspection = 2;
    static notices_shop = 3;
    static notices_event = 4;

    static notices = {
        '공지': NewsCache.notices_notification,
        '점검': NewsCache.notices_inspection,
        '상점': NewsCache.notices_shop,
        '이벤트': NewsCache.notices_event,
    };
}

const newsCache = new NewsCache();

module.exports = {
    /**
     * 현재 진행중인 로스트아크 이벤트 리턴
     */
    getEvents: async () => {
        return await newsCache.getData(NewsCache.events);
    },

    /**
     * 입력받은 타입별 로스트아크 신규 소식 리턴
     * [ '공지', '점검', '상점', '이벤트' ]
     * @param { String } type 
     * @returns 
     */
    getNotices: async (type) => {
        return await newsCache.getData(NewsCache.notices[type]);
    },
}

