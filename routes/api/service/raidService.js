const logger = require('../../../utils/logger');
const MemoryCache = require('../../../utils/memoryCache');
const utils = require('../../../utils/utils');
const dbService = require('./dbService');

const createAllRaidRewardDataFunc = () => {
    const raidRewardJSON = (raidrewards) => {
        let obj_raidreward = {};
        raidrewards.forEach((reword) => {
            if(obj_raidreward[reword.name]) {
                obj_raidreward[reword.name][reword.phase] = {
                    subname: reword.subname,
                    gold : reword.gold,
                    opengold : reword.opengold
                }
            } else {
                obj_raidreward[reword.name] = {};
                obj_raidreward[reword.name][reword.phase] = {
                    subname: reword.subname,
                    gold : reword.gold,
                    opengold : reword.opengold
                }
            }
        });
    
        return obj_raidreward;
    };

    return async () => {
        const raidrewards = await dbService.readAllRaidReward();
        return raidRewardJSON(raidrewards);
    };
}

const createRewardItemPriceDataFunc = () => {
    const itemPriceJSON = (priceList) => {
        let obj_priceList = {};
        priceList.forEach((price) => {
            obj_priceList[price.name] = price.AvgPrice;
        });
    
        obj_priceList["명예의 파편"] =  utils.getNumberFormat(obj_priceList["명예의 파편 주머니(대)"]/1500);
        delete obj_priceList["명예의 파편 주머니(대)"];
    
        obj_priceList["선명한 지혜의 엘릭서"] = utils.getNumberFormat(obj_priceList["선명한 지혜의 정수"]*6);
        obj_priceList["선명한 지혜의 기운"] = utils.getNumberFormat((obj_priceList["선명한 지혜의 엘릭서"]-100)/4);
        //delete obj_priceList["선명한 지혜의 정수"];
    
        obj_priceList["빛나는 지혜의 엘릭서"] = utils.getNumberFormat(obj_priceList["빛나는 지혜의 정수"]*6);
        obj_priceList["빛나는 지혜의 기운"] = utils.getNumberFormat((obj_priceList["빛나는 지혜의 엘릭서"]-250)/4);
        //delete obj_priceList["빛나는 지혜의 정수"];
    
        return obj_priceList;
    }

    return async () => {
        const rewardItemIds = [
            66102003, 	//파괴석 결정
            66102004, 	//파괴강석
            66102005, 	//정제된 파괴강석
            66102103, 	//수호석 결정
            66102104, 	//수호강석
            66102105, 	//정제된 수호강석
            66110221, 	//명예의 돌파석
            66110222, 	//위대한 명예의 돌파석
            66110223, 	//경이로운 명예의 돌파석
            66110224, 	//찬란한 명예의 돌파석
            66130133, 	//명예의 파편 주머니(대)
            66160220, 	//선명한 지혜의 정수
            66160320, 	//빛나는 지혜의 정수
        ];
    
        const priceList = await dbService.readItemPriceListByRaidIdxs(rewardItemIds);
        return itemPriceJSON(priceList);
    };
}

const createRewardListDataFunc = () => {
    const rewardListJSON = (rewardList) => {
        let obj_rewardList = {};
        rewardList.forEach((reward) => {
            if(obj_rewardList[reward.name]) {
                if(obj_rewardList[reward.name][reward.phase]) {
                    obj_rewardList[reward.name][reward.phase].itemList.push({
                        itemname: reward.itemname,
                        cnt: reward.cnt,
                        cntopne: reward.cntopne,
                    });
                } else {
                    obj_rewardList[reward.name][reward.phase] = {
                        itemList: [{
                            itemname: reward.itemname,
                            cnt: reward.cnt,
                            cntopne: reward.cntopne,
                        }],
                    };
                }
            } else {
                obj_rewardList[reward.name] = {name: reward.name};
                obj_rewardList[reward.name][reward.phase] = {
                    itemList: [{
                        itemname: reward.itemname,
                        cnt: reward.cnt,
                        cntopne: reward.cntopne,
                    }],
                };
            }
        });
    
        return obj_rewardList;
    }

    return async () => {
        const rewardList = await dbService.readRaidRewardItemListByRaidIdxs();
        return rewardListJSON(rewardList);
    };
}

class RaidCache extends MemoryCache {
    constructor() {
        super(3, 1000*60*60);
        this.name = 'RaidCache';
        super.setDataFunc(RaidCache.allRaidReward, createAllRaidRewardDataFunc());
        super.setDataFunc(RaidCache.rewardItemPrice, createRewardItemPriceDataFunc());
        super.setDataFunc(RaidCache.rewardList, createRewardListDataFunc());
    }

    static allRaidReward = 0;
    static rewardItemPrice = 1;
    static rewardList = 2;
}

const raidCache = new RaidCache();

module.exports = {
    /**
     * 로스트아크의 모든 레이드 정보 리턴 
     * @returns { JSON }
     */
    getAllRaidInfo: async () => {
        return await raidCache.getData(RaidCache.allRaidReward);
    },

    /**
     * 로스트아크의 레이드 보상 이이템 가격 정보 리턴
     * @returns { Array }
     */
    getRewardItemPrice: async () => {
        return await raidCache.getData(RaidCache.rewardItemPrice);
    },

    /**
     * 로스트아크 레이드별 보상 목록 리턴
     * @param { String } raidname 
     * @returns { Array }
     */
    getRaidRewardList: async (raidname) => {
        const rewardList = await raidCache.getData(RaidCache.rewardList);
        if( rewardList[raidname] )
            return rewardList[raidname];
        return {};
    },

};
