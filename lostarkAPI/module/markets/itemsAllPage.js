const logger = require('../../../utils/Logger');
const LostarkApiUrl = require('../lostarkAPIUrl');
const requestAPI = require('../lostarkAPIRequest');

module.exports = {
    request: async (requestJson) => {
        let totItemList = [];
        const url = LostarkApiUrl.markets_item;
        try {
            const retData = JSON.parse(await requestAPI.API(url, "POST", requestJson));

            if(retData.Items) {
                totItemList = retData.Items;

                if(retData.TotalCount - retData.PageSize > 0) {
                    const remainingPages = (retData.TotalCount/retData.PageSize)+1;

                    let promiseArray = [];
                    for(let i = 2; i <= remainingPages; i++) {
                        let tmpRequestJson = JSON.parse(JSON.stringify(requestJson));
                        tmpRequestJson.PageNo = i;
                        let tmpPromise = requestAPI.API(url, "POST", tmpRequestJson);
                        promiseArray.push(tmpPromise);
                    }

                    let promiseResultArray = await Promise.allSettled(promiseArray).then(
                        (list) => { return list; }
                    ).catch(
                        (error) => { throw error; }
                    );

                    promiseResultArray.forEach((fulfilledData) => {          
                        if(fulfilledData.value) {
                            const fulfilledJson = JSON.parse(fulfilledData.value);
                            fulfilledJson.Items.forEach((item) => {
                                if(item.Id) totItemList.push(item); 
                            });
                        }
                    });
                }
            }
            
        } catch (error) {
            logger.log('error', `markets/items allpage error : ${error}`);
            logger.log('error', `markets/items allpage requestJson : ${JSON.stringify(requestJson)}`);

        }

        return totItemList;
    }
};