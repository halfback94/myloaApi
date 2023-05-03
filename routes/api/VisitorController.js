const logger = require('../../utils/logger');
const utils = require('../../utils/utils');
const mariaDB = require('../../database/mariadb');

/**
 * ip와 url insert
 * @param { String } ip 
 * @param { String } name 
 * @returns 
 */
const insertVisit = async (ip, name) => {
    const queryStr = `INSERT INTO visit(ip, func) VALUES (?, ?)`;
    let retQuery = [];

    try { 
        retQuery = await mariaDB.query(queryStr, [ip, name], (rows) => {
            let retCallback = [];
            if(rows.length > 0) {
                retCallback = rows;
            }

            return retCallback;
        }, null);
    } catch (error) {
        retQuery = [];
        logger.log('error', `insertVisit : ${error}`);
    }

    return retQuery;
};

/**
 * 오늘 방문자 수 리턴
 * @returns { number }
 */
const getTodayVisited = async () => {
    let queryStr = 'SELECT ';
	    queryStr += ' COUNT(*) AS today';
        queryStr += 'FROM ';
        queryStr += ' ( SELECT visit.ip FROM visit WHERE visit.time >= CURDATE() GROUP BY visit.ip ) sub';
    let retQuery = 0;

    try { 
        retQuery = await mariaDB.queryNonPars(queryStr, (rows) => {
            let todayVisit = 0;
            if(rows.length > 0) {
                todayVisit = rows.today;
            }

            return todayVisit;
        }, null);
    } catch (error) {
        retQuery = 0;
        logger.log('error', `getTodayVisited : ${error}`);
    }

    return retQuery;
};

class VisiterController {
    constructor() {

    }

    async insertVisit(req, name) {
        insertVisit(utils.getIp(req), name);
    }

    async getTodayVisit() {
        return null;
    }

}

module.exports = new VisiterController();