const logger = require('../../../utils/logger');
const mariaDB = require('../../../database/mariadb');

module.exports = {

    readMarketDBAllItemIds: async () => {
        const queryStr = `SELECT Id, Name FROM market;`;
        let retQuery = [];

        try { 
            retQuery = await mariaDB.queryNonPars(queryStr, (rows) => {
                let retCallback = [];
                if(rows.length > 0) {
                    retCallback = rows;
                }

                return retCallback;
            }, null);
        } catch (error) {
            retQuery = [];
            logger.log('error', `readMarketDBAllItemIds : ${error}`);
        }

        return retQuery;
    },

    readMarketDBCategoryByCode: async (categoryCode) => {
        const queryStr = 'SELECT * FROM market WHERE CategoryCode=? ORDER BY RecentPrice DESC';
        const pars = [categoryCode];
        let retQuery = {success: false, itemList: []};
        
        try { 
            retQuery = await mariaDB.query(queryStr, pars, (rows) => {
                let retCallback = {success: false, itemList: []};
                retCallback.success = true;
                if(rows.length > 0) retCallback.itemList = rows;
    
                return retCallback;
            }, null);
        } catch (error) {
            retQuery = {success: false, itemList: []};
            logger.log('error', `async readMarketDBCategoryByCode : ${error}`);
        }
            
        return retQuery;
    },

    saveMarketDBCategoryByCode: async (categoryCode, itemList) => {
        let pars = [];
        itemList.forEach((item) => {
            let inserPar = [
                item.Id,
                categoryCode,
                item.Name,
                item.Grade,
                item.Icon,
                item.BundleCount,
                item.TradeRemainCount,
                item.YDayAvgPrice,
                item.RecentPrice,
                item.CurrentMinPrice,
            ];
            pars.push(inserPar);
        });
    
        let queryStr = "INSERT INTO market(Id, CategoryCode, Name, Grade, Icon, BundleCount, TradeRemainCount, YDayAvgPrice, RecentPrice, CurrentMinPrice)";
        queryStr += " VALUES?";
        queryStr += " ON DUPLICATE KEY UPDATE";
        queryStr += "  YDayAvgPrice=VALUES(YDayAvgPrice),";
        queryStr += "  RecentPrice=VALUES(RecentPrice),";
        queryStr += "  CurrentMinPrice=VALUES(CurrentMinPrice),";
        queryStr += "  lastupdate=current_timestamp()";

        let retData = {success: false};
        try{
            retData = await mariaDB.queryBulk(queryStr, pars, (rows) => {
                let retCallback = {success: false};
                if(rows.affectedRows > 0 || rows.insertId) {
                    retCallback.success = true;
                }
                return retCallback;
            }, null);
    
        } catch (error) {
            retData = {success: false};
            logger.log('error', `async saveMarketDBCategoryByCode : ${error}`);
        }
    
        return retData;
    },

    readMarketDBHistoryByName: async (itemName, date) => {
        const queryStr = `SELECT * FROM marketchart WHERE NAME=? AND CURDATE() > DATE AND DATE > DATE_SUB(CURDATE(), INTERVAL ? DAY )`;
        let retQuery = [];
    
        try { 
            retQuery = await mariaDB.query(queryStr, [itemName, date], (rows) => {
                let retCallback = [];
                if(rows.length > 0) {
                    retCallback = rows;
                }
    
                return retCallback;
            }, null);
        } catch (error) {
            retQuery = [];
            logger.log('error', `readMarketDBHistoryByName : ${error}`);
        }
    
        return retQuery;
    },

    saveMarketDBHistoryBulk: async (pars) => {
        let queryStr = "INSERT INTO markethistory(Id, AvgPrice, TradeCount, date) VALUES?";
            queryStr += " ON DUPLICATE KEY UPDATE AvgPrice=VALUES(AvgPrice), TradeCount=VALUES(TradeCount)";

        try {
            retData = await mariaDB.queryBulk(queryStr, pars, (rows) => {
                let retCallback = {success: false};
                if(rows.affectedRows > 0 || rows.insertId) {
                    retCallback.success = true;
                }
                return retCallback;
            }, null);
        } catch (error) {
            logger.log('error', `saveMarketDBHistoryBulk : ${error}`);
        } 
    },

    updateMarketDBAvgPriceWeek: async () => {
        let queryStr = 'UPDATE market,';
            queryStr += ' (SELECT markethistory.id, AVG(markethistory.AvgPrice) AvgPrice FROM markethistory WHERE CURDATE() > markethistory.date AND markethistory.date > DATE_SUB(CURDATE(), INTERVAL 8 DAY ) GROUP BY Id ) sub'  
            queryStr += ' SET market.AvgPriceWeek = sub.AvgPrice WHERE market.Id = sub.Id';

        try {
            retQuery = await mariaDB.queryNonPars(queryStr, (rows) => {
                let retCallback = false;
                if(rows.affectedRows > 0) {
                    retCallback = true;
                }
    
                return retCallback;
            }, null);
        } catch (error) {
            logger.log('error', `updateMarketDBAvgPriceWeek : ${error}`);
        }
    },

    saveCalendarContents: async (calendar) => {
        let pars = [];
        calendar.forEach((calendarContent) => {
            pars.push([
                calendarContent.CategoryName,
                calendarContent.ContentsName,
                calendarContent.ContentsIcon,
                calendarContent.MinItemLevel,
            ]);
        });

        let queryStr = "INSERT IGNORE INTO calendarcontent(CategoryName, ContentsName, ContentsIcon, MinItemLevel) VALUES?";

        try {
            retData = await mariaDB.queryBulk(queryStr, pars, (rows) => {
                let retCallback = {success: false};
                if(rows.affectedRows > 0 || rows.insertId) {
                    retCallback.success = true;
                }
                return retCallback;
            }, null);
        } catch (error) {
            logger.log('error', `saverCalendarContents : ${error}`);
        } 
    },

    saveCalendarTimeTable: async (pars) => {
        // calendar.forEach((calendarContent) => {
        //     calendarContent.StartTimes.forEach((startTime) => {
        //         pars.push([ calendarContent.ContentsName, startTime ]);
        //     });
        // });

        // let queryStr = "INSERT IGNORE INTO calendartimetable(ContentsName, starttime) VALUES?";

        let queryStr = "INSERT IGNORE INTO calendartimetable(ContentsName, starttime, Reward) VALUES?";
            queryStr += " ON DUPLICATE KEY UPDATE Reward=VALUES(Reward)";


        try {
            retData = await mariaDB.queryBulk(queryStr, pars, (rows) => {
                let retCallback = {success: false};
                if(rows.affectedRows > 0 || rows.insertId) {
                    retCallback.success = true;
                }
                return retCallback;
            }, null);
        } catch (error) {
            logger.log('error', `saverCalendarContents : ${error}`);
        } 
    },

    readCalendarToday: async () => {
        let queryStr = 'SELECT ';
            queryStr += ' calendarcontent.*, ';
            queryStr += ' calendartimetable.starttime , calendartimetable.Reward ';
            queryStr += 'FROM ';
            queryStr += ' calendarcontent LEFT JOIN calendartimetable on calendarcontent.ContentsName = calendartimetable.ContentsName ';
            queryStr += ' ,(SELECT ';
            queryStr += '    DATE_ADD(CURRENT_DATE(), INTERVAL 6 HOUR) AS starttime,';
            queryStr += '    TIMESTAMPDIFF(HOUR, CURRENT_DATE(), CURRENT_TIMESTAMP()) AS timedff ';
            queryStr += ' FROM DUAL) AS timetable ';
            queryStr += 'WHERE ';
            queryStr += ' calendartimetable.starttime >= ( CASE WHEN timetable.timedff < 6 THEN DATE_SUB(timetable.starttime, INTERVAL 1 DAY) ELSE timetable.starttime END )';
            queryStr += ' AND ';
            queryStr += ' calendartimetable.starttime < ( CASE WHEN timetable.timedff < 6 THEN timetable.starttime ELSE DATE_ADD(timetable.starttime, INTERVAL 1 DAY) END )';
        
        let retQuery = [];
        try {
            retQuery = await mariaDB.queryNonPars(queryStr, (rows) => {
                let retCallback = [];
                if(rows.length > 0) {
                    retCallback = rows;
                }
    
                return retCallback;
            }, null);
        } catch (error) {
            retQuery = [];
            logger.log('error', `readCalendarToday : ${error}`);
        }

        return retQuery;
    },

    readAllRaidReward: async () => {
        let queryStr = 'SELECT * FROM raidreward ORDER BY raididx';
        let retQuery = [];
        try {
            retQuery = await mariaDB.queryNonPars(queryStr, (rows) => {
                let retCallback = [];
                if(rows.length > 0) {
                    retCallback = rows;
                }
    
                return retCallback;
            }, null);
        } catch (error) {
            retQuery = [];
            logger.log('error', `readAllRaidReward : ${error}`);
        }

        return retQuery;
    },

    readRaidRewardItemListByRaidIdxs: async () => {
        let retQuery = [];
        let queryStr = "SELECT ";
            queryStr += " name, phase, subname, itemname, cnt, cntopne ";
            queryStr += "FROM  ";
            queryStr += " (";
            queryStr += "   SELECT ";
            queryStr += "     raidrewarditem.*, raidreward.name, raidreward.phase, raidreward.subname ";
            queryStr += "   FROM ";
            queryStr += "     raidrewarditem JOIN raidreward ON raidrewarditem.raididx = raidreward.raididx ";
            queryStr += " ) tmp ";
            queryStr += "ORDER BY tmp.raididx, tmp.itemorder";

        try {
            retQuery = await mariaDB.queryNonPars(queryStr, (rows) => {
                let retCallback = [];
                if(rows.length > 0) {
                    retCallback = rows;
                }
    
                return retCallback;
            }, null);
        } catch (error) {
            retQuery = [];
            logger.log('error', `readRaidRewardItemListByRaidIdxs : ${error}`);
        }

        return retQuery;
    },

    readItemPriceListByRaidIdxs: async (pars) => {
        let retQuery = [];
        let queryStr = "SELECT ";
            queryStr += " market.Name as name, market.id , ROUND(markethistory.AvgPrice/market.BundleCount,2) AS AvgPrice, markethistory.date ";
            queryStr += "FROM ";
            queryStr += " markethistory JOIN market ON markethistory.id = market.Id ";
            queryStr += "WHERE ";
            queryStr += " (markethistory.id, markethistory.date) IN ";
            queryStr += " ( select Id, max(date) as CREATE_TIME from markethistory WHERE TradeCount > 0 AND date < CURDATE() AND  id IN ? group by Id ) ";
            queryStr += "ORDER BY markethistory.id";

        try {
            retQuery = await mariaDB.queryBulk(queryStr, [pars], (rows) => {
                let retCallback = [];
                if(rows.length > 0) {
                    retCallback = rows;
                }
    
                return retCallback;
            }, null);
        } catch (error) {
            retQuery = [];
            logger.log('error', `readItemPriceListByRaidIdxs : ${error}`);
        }

        return retQuery;
    },
}