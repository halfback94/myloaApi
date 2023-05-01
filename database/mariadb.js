const maria = require('mysql2/promise');
const logger = require('../utils/Logger');
const dbUser = require('./dbUser');
const poolMaria = maria.createPool(dbUser.mariaMyLoa);

module.exports = {
    pool: poolMaria,
    optSession: dbUser.mariaSession,

    /** 입력받은 QueryString을 실행
     * 
     * @param { string } queryStr 
     * @param { Array } pars 
     * @param { Function } callback 
     * @param { Function } callbackfail 
     * @returns 
     */
    query: async (queryStr, pars, callback, callbackfail) => {
        let ret = {success: false};
        let conn = null;
        try{
            conn = await poolMaria.getConnection();
            await conn.beginTransaction();
            const [rows, fields] = await conn.query(queryStr, pars);
            ret = callback(rows);
            await conn.commit();
        } catch (error) {
            logger.log('error',`query err ${error}`);
            logger.log('error',`query queryStr ${JSON.stringify(queryStr)}`);
            logger.log('error',`query pars ${JSON.stringify(pars)}`);

            if(conn) await conn.rollback();
            if(callbackfail) ret = callbackfail();
            //throw err;
        } finally {
            if(conn) conn.release();
        }

        return ret;
    }, 

    /** 입력받은 QueryString을 실행, Query Pars X
     * 
     * @param { string } queryStr 
     * @param { Function } callback 
     * @param { Function } callbackfail 
     * @returns 
     */
    queryNonPars: async (queryStr, callback, callbackfail) => {
        let ret = {success: false};
        let conn = null;
        try{
            conn = await poolMaria.getConnection();
            await conn.beginTransaction();
            const [rows, fields] = await conn.query(queryStr);
            ret = callback(rows);
            await conn.commit();
        } catch (error) {
            logger.log('error',`queryNonPars err ${error}`);
            logger.log('error',`queryNonPars queryStr ${JSON.stringify(queryStr)}`);

            if(conn) await conn.rollback();
            if(callbackfail) ret = callbackfail();
            //throw err;
        } finally {
            if(conn) conn.release();
        }

        return ret;
    },

    queryBulk: async (queryStr, pars, callback, callbackfail) => {
        let ret = {success: false};
        let conn = null;
        try{
            conn = await poolMaria.getConnection();
            await conn.beginTransaction();
            const [rows, fields] = await conn.query(queryStr, [pars], true);
            ret = callback(rows);
            await conn.commit();
        } catch (error) {
            logger.log('error',`queryBulk error ${error}`);
            logger.log('error',`queryBulk queryStr ${JSON.stringify(queryStr)}`);
            logger.log('error',`queryBulk pars ${JSON.stringify(pars)}`);

            if(conn) await conn.rollback();
            if(callbackfail) ret = callbackfail();
            //throw err;
        } finally {
            if(conn) conn.release();
        }

        return ret;
    }, 

    excuteQuery: async (queryStr, pars, callback, callbackfail) => {
        let ret = {success: false};
        let conn = null;
        try{
            conn = await poolMaria.getConnection();
            await conn.beginTransaction();
            const [rows, fields] = await conn.execute(queryStr, pars);
            ret = callback(rows);
            await conn.commit();
        } catch (error) {
            logger.log('error',`excuteQuery error ${error}`);
            logger.log('error',`excuteQuery queryStr ${JSON.stringify(queryStr)}`);
            logger.log('error',`excuteQuery pars ${JSON.stringify(pars)}`);

            if(conn) await conn.rollback();
            if(callbackfail) ret = callbackfail();
            //throw err;
        } finally {
            if(conn) conn.release();
        }

        return ret;
    },

    excuteQueryNonPars: async (queryStr, callback, callbackfail) => {
        let ret = {success: false};
        let conn = null;
        //logger.log('info', `queryStr ${queryStr}`);
        try{
            conn = await poolMaria.getConnection();
            await conn.beginTransaction();
            const [rows, fields] = await conn.execute(queryStr);
            ret = callback(rows);
            await conn.commit();
        } catch (error) {
            logger.log('error',`excuteQueryNonPars error ${error}`);
            logger.log('error',`excuteQueryNonPars queryStr ${JSON.stringify(queryStr)}`);
            logger.log('error',`excuteQueryNonPars pars ${JSON.stringify(pars)}`);

            if(conn) await conn.rollback();
            if(callbackfail) ret = callbackfail();
            //throw err;
        } finally {
            if(conn) conn.release();
        }

        return ret;
    },
}