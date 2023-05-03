const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const logger = require('../../utils/logger');
const keyManager = require('./lostarkAPIKeyManager');

/**
 * 서버키를 사용하여 API 사용
 * @param { String } url 
 * @param { String } method 
 * @param { JSON } data 
 * @returns 
 */
const useServerKey = (url, method, data) => {
    let retryCnt = 0;
    const PromiseHttpRequest = async () => {
        await keyManager.waitKeyLimit();
        return new Promise((resolve, reject) => {
            try {
                const apiKeyIdx = keyManager.getKeyIdx();
                let xmlHttpRequest = new XMLHttpRequest();   
                xmlHttpRequest.open(method, url, true); // "GET", "POST"
                xmlHttpRequest.setRequestHeader('accept', 'application/json');
                xmlHttpRequest.setRequestHeader('authorization', 'bearer ' + keyManager.getKey(apiKeyIdx) + '');
                xmlHttpRequest.setRequestHeader('rejectUnauthorized', 'false');
                if(method === "POST")
                    xmlHttpRequest.setRequestHeader('Content-Type', 'application/json');
                
                xmlHttpRequest.onreadystatechange = () => {
                    if( xmlHttpRequest.DONE == xmlHttpRequest.readyState ) {
                        if(xmlHttpRequest.status == 200) {
                            return resolve(xmlHttpRequest.responseText);
                        } else if(xmlHttpRequest.status == 429) {
                            logger.log('error', `xmlHttpRequest  429 : ${JSON.stringify(xmlHttpRequest)}`);
                            keyManager.setKeyLimit(apiKeyIdx);
                            if(retryCnt >= keyManager.getMaxRetry()) {
                                throw new Error("Rate Limit Exceeded");
                            }
                            retryCnt++;
                            return PromiseHttpRequest();
                        } else {
                            logger.log('error', `xmlHttpRequest status:${xmlHttpRequest.status}. statusText : ${xmlHttpRequest.statusText}`);
                            reject();
                        }
                    }
                };

                if(method === "POST") {
                    xmlHttpRequest.send(JSON.stringify(data));
                } else {
                    xmlHttpRequest.send();
                }

            } catch (error) {
                logger.log('error', `PromiseHttpRequest url : ${url}`);
                logger.log('error', `PromiseHttpRequest error : ${error}`);
                reject();
            }
        });
    };

    return PromiseHttpRequest();
};

/**
 * 사용자키를 사용하여 API 사용
 * @param { String } url 
 * @param { String } method 
 * @param { JSON } data 
 * @param { String } key 
 * @returns 
 */
const useExternalKey = (url, method, data, key) => {
    const PromiseHttpRequest = async () => {
        return new Promise((resolve, reject) => {
            let xmlHttpRequest = new XMLHttpRequest();
            try {    
                xmlHttpRequest.open(method, url, true); // "GET", "POST"
                xmlHttpRequest.setRequestHeader('accept', 'application/json');
                xmlHttpRequest.setRequestHeader('authorization', 'bearer ' + key + '');
                if(method === "POST")
                    xmlHttpRequest.setRequestHeader('Content-Type', 'application/json');
                xmlHttpRequest.onreadystatechange = () => {
                    if( xmlHttpRequest.DONE == xmlHttpRequest.readyState ) {
                        if(xmlHttpRequest.status == 200) {
                            return resolve(xmlHttpRequest);
                        } else {
                            logger.log('error', `xmlHttpRequest.status : ${xmlHttpRequest.status}`);
                            logger.log('error', `xmlHttpRequest x-ratelimit-remaining : ${xmlHttpRequest.getResponseHeader('x-ratelimit-remaining')}`);
                            logger.log('error', `xmlHttpRequest : ${JSON.stringify(xmlHttpRequest)}`);
                            return resolve(xmlHttpRequest);
                        }
                    }
                };

                if(method === "POST") {
                    xmlHttpRequest.send(JSON.stringify(data));
                } else {
                    xmlHttpRequest.send();
                }

            } catch (error) {
                logger.log('error', `UserKey PromiseHttpRequest url : ${key}`);
                logger.log('error', `UserKey PromiseHttpRequest url : ${url}`);
                logger.log('error', `UserKey PromiseHttpRequest error : ${error}`);
                reject();
            }
        });
    };

    return PromiseHttpRequest();
}



module.exports = {
    API : async (url, method, data) => {
        let retryCnt = 0;
        const PromiseHttpRequest = async () => {
            await keyManager.waitKeyLimit();
            return new Promise((resolve, reject) => {
                try {
                    const apiKeyIdx = keyManager.getKeyIdx();
                    let xmlHttpRequest = new XMLHttpRequest();   
                    xmlHttpRequest.open(method, url, true); // "GET", "POST"
                    xmlHttpRequest.setRequestHeader('accept', 'application/json');
                    xmlHttpRequest.setRequestHeader('authorization', 'bearer ' + keyManager.getKey(apiKeyIdx) + '');
                    xmlHttpRequest.setRequestHeader('rejectUnauthorized', 'false');
                    if(method === "POST")
                        xmlHttpRequest.setRequestHeader('Content-Type', 'application/json');
                    
                    xmlHttpRequest.onreadystatechange = () => {
                        if( xmlHttpRequest.DONE == xmlHttpRequest.readyState ) {
                            if(xmlHttpRequest.status == 200) {
                                return resolve(xmlHttpRequest.responseText);
                            } else if(xmlHttpRequest.status == 429) {
                                logger.log('error', `xmlHttpRequest  429 : ${JSON.stringify(xmlHttpRequest)}`);
                                keyManager.setKeyLimit(apiKeyIdx);
                                if(retryCnt >= keyManager.getMaxRetry()) {
                                    throw new Error("Rate Limit Exceeded");
                                }
                                retryCnt++;
                                return PromiseHttpRequest();
                            } else {
                                logger.log('error', `xmlHttpRequest status:${xmlHttpRequest.status}. statusText : ${xmlHttpRequest.statusText}`);
                                reject();
                            }
                        }
                    };

                    if(method === "POST") {
                        xmlHttpRequest.send(JSON.stringify(data));
                    } else {
                        xmlHttpRequest.send();
                    }

                } catch (error) {
                    logger.log('error', `PromiseHttpRequest url : ${url}`);
                    logger.log('error', `PromiseHttpRequest error : ${error}`);
                    reject();
                }
            });
        };

        return PromiseHttpRequest();
    },

    UserKeyAPI: async (key, url, method, data) => {
        
        const PromiseHttpRequest = async () => {
            return new Promise((resolve, reject) => {
                let xmlHttpRequest = new XMLHttpRequest();
                try {    
                    xmlHttpRequest.open(method, url, true); // "GET", "POST"
                    xmlHttpRequest.setRequestHeader('accept', 'application/json');
                    xmlHttpRequest.setRequestHeader('authorization', 'bearer ' + key + '');
                    if(method === "POST")
                        xmlHttpRequest.setRequestHeader('Content-Type', 'application/json');
                    xmlHttpRequest.onreadystatechange = () => {
                        if( xmlHttpRequest.DONE == xmlHttpRequest.readyState ) {
                            if(xmlHttpRequest.status == 200) {
                                return resolve(xmlHttpRequest);
                            } else {
                                logger.log('error', `xmlHttpRequest.status : ${xmlHttpRequest.status}`);
                                logger.log('error', `xmlHttpRequest x-ratelimit-remaining : ${xmlHttpRequest.getResponseHeader('x-ratelimit-remaining')}`);
                                logger.log('error', `xmlHttpRequest : ${JSON.stringify(xmlHttpRequest)}`);
                                return resolve(xmlHttpRequest);
                            }
                        }
                    };

                    if(method === "POST") {
                        xmlHttpRequest.send(JSON.stringify(data));
                    } else {
                        xmlHttpRequest.send();
                    }

                } catch (error) {
                    logger.log('error', `UserKey PromiseHttpRequest url : ${key}`);
                    logger.log('error', `UserKey PromiseHttpRequest url : ${url}`);
                    logger.log('error', `UserKey PromiseHttpRequest error : ${error}`);
                    reject();
                }
            });
        };

        return PromiseHttpRequest();
    }

}