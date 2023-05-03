const logger = require('../../../utils/logger');
const utils = require('../../../utils/utils');
const MemoryCache = require('../../../utils/memoryCache');
const dbService = require('./dbService');
const lostarkAPI = require('../../../lostarkAPI/lostarkAPI');

const calendarReward = {
    "실링": 1,
    "골드": 2,
    "해적 주화": 3,
    "전설 ~ 고급 카드 팩": 4,
}

const r_calendarReward = {
    1: "실링",
    2: "골드",
    3: "해적 주화",
    4: "전설 ~ 고급 카드 팩",
}

const calendarTimeTableRowData = (calendar) => {

    let pars = [];
    calendar.forEach((calendarContent) => {
        if(calendarContent.CategoryName == "모험 섬") {
            calendarContent.RewardItems.forEach((reward) => {
                if(reward.StartTimes && Array.isArray(reward.StartTimes) && calendarReward[reward.Name]) {
                    reward.StartTimes.forEach((startTime) => {
                        pars.push([ calendarContent.ContentsName, startTime, calendarReward[reward.Name] ]);
                    });
                }
            })
        } else {
            calendarContent.StartTimes.forEach((startTime) => {
                pars.push([ calendarContent.ContentsName, startTime, null ]);
            });
        }
    });

    logger.log('error', `calendarTimeTableRowData : ${pars.length}`);

    return pars;
}

const createCalendarDataFunc = () => { 
    const calendarTodayToJSON = (calendarToday) => {
        let jsonObj = {};
        calendarToday.forEach((cal) => {
            if( jsonObj[cal.CategoryName] ) {
                let exist = false;
                jsonObj[cal.CategoryName].forEach((contentItem) => {
                    if(contentItem.ContentsName == cal.ContentsName) {
                        contentItem.StartTimes.push(cal.starttime);
                        exist = true;
                        return false;
                    }
                });

                if(!exist) {
                    jsonObj[cal.CategoryName].push({
                        ContentsName : cal.ContentsName,
                        ContentsIcon : cal.ContentsIcon,
                        MinItemLevel : cal.MinItemLevel,
                        StartTimes : [cal.starttime],
                        Reward : (cal.Reward ? r_calendarReward[cal.Reward] : null),
                    });
                }
            } else {
                jsonObj[cal.CategoryName] = [];
                jsonObj[cal.CategoryName].push({
                    ContentsName : cal.ContentsName,
                    ContentsIcon : cal.ContentsIcon,
                    MinItemLevel : cal.MinItemLevel,
                    StartTimes : [cal.starttime],
                    Reward : (cal.Reward ? r_calendarReward[cal.Reward] : null),
                });
            }
        });

        return jsonObj;
    };

    return async () => {
        let calendarToday = await dbService.readCalendarToday();
        if(calendarToday.length == 0) {
            const calendar = await lostarkAPI.wrapper.requestCalendar();
            if(calendar.length > 0) {
                await dbService.saveCalendarContents(calendar);
                await dbService.saveCalendarTimeTable(calendarTimeTableRowData(calendar));
                calendarToday = await dbService.readCalendarToday();
            }
        }

        return calendarTodayToJSON(calendarToday);
    };
};

class GameContentCache extends MemoryCache {
    constructor() {
        super(3, 1000*60*60);
        this.name = 'GameContentCache';
        super.setDataFunc(GameContentCache.challengeAbyssDungeons, lostarkAPI.wrapper.requestChallengeAbyssDungeons);
        super.setDataFunc(GameContentCache.challengeGuardianRaids, lostarkAPI.wrapper.requestChallengeGuardianRaids);
        super.setDataFunc(GameContentCache.calendar, createCalendarDataFunc());
    }

    static challengeAbyssDungeons = 0;
    static challengeGuardianRaids = 1;
    static calendar = 2;
};

const gameContentCache = new GameContentCache();

module.exports = {

    getChallengeAbyssDungeons: async () => {
        return await gameContentCache.getData(GameContentCache.challengeAbyssDungeons);
    },

    getChallengeGuardianRaids: async () => {
        return await gameContentCache.getData(GameContentCache.challengeGuardianRaids);
    },

    getCalendarToday: async () => {
        return await gameContentCache.getData(GameContentCache.calendar);
    },

    saveCalendar: async () => {
        try {
            const calendar = await lostarkAPI.wrapper.requestCalendar();
            await dbService.saveCalendarContents(calendar);

            await dbService.saveCalendarTimeTable(calendarTimeTableRowData(calendar));

        } catch (error) {
            logger.log('error', `saveCalendar: ${error}`);
        }
    },
};
