const logger = require('../../../utils/Logger');
const MemoryCache = require('../../../utils/memoryCache');
const dbService = require('./dbService');
const lostarkAPI = require('../../../lostarkAPI/lostarkAPI');

class MarketCache extends MemoryCache {
    constructor() {
        super(1, 1000*60*60*24);
        this.name = 'MarketCache';
        super.setDataFunc(MarketCache.options, lostarkAPI.wrapper.requestMarketOptions);
    }

    /**
     * 0 : option
     */
    static options = 0;
}

const marketCache = new MarketCache();


module.exports = {

    marketOptions: async () => {
        return await marketCache.getData(MarketCache.options);
    },

    marketCategory: async (categorys) => {
        return await getMarketPriceByCategorys(categorys);
    },

    marketHistroyCategory: async () => {
        return favItemList();
    },

    marketHistroy: async (itemName) => {
        return await dbService.readMarketDBHistoryByName(itemName, 14);
    },

    marketSearch: async (reqData) => {
        return await lostarkAPI.wrapper.requestMarketItemsWithApiKey(reqData.apiKey, reqData.reqJson);
    },

    batchMarketDBHistory: async () => {
        logger.log('info', `batchMarketDBHistory`);
        return await upadetMarketDBHistory();
    },

    batchMarketDBAvgPrice: async () => {
        logger.log('info', `batchMarketDBAvgPrice`);
        return await dbService.updateMarketDBAvgPriceWeek();
    }
}

const categorieCodes = {
    0: 40000, 1: 50010,
    2: 50020, 3: 51100,
    4: 50070, 5: 51000,
    6: 60200, 7: 60300,
    8: 60400, 9: 60500,
    10: 90000,
}

const getMarketPriceByCategorys = async (categorys) => {
    let retMarketData = [[], [], [], [], [], [], [], [], [], [], []];
    let promiseArray = [];
    let promiseIdxs = [];

    try {
        for(let i = 0; i < categorys.length; i++ ) {
            if(categorys[i]) {
                const retDB = await dbService.readMarketDBCategoryByCode(categorieCodes[i]);
                
                if(retDB.success && (!isValidDBItemList(retDB.itemList))) {
                    let tmpPromise = updateMarketDBPriceByCode(categorieCodes[i]);
                    promiseArray.push(tmpPromise);
                    promiseIdxs.push(i);
                } else {
                    retMarketData[i] = retDB.itemList;
                }
            }
        }

        await Promise.allSettled(promiseArray)
            .then(() => {})
            .catch( (error) => { throw error; } );

        for(let i = 0; i < promiseIdxs.length; i++) {
            const retDB = await dbService.readMarketDBCategoryByCode(categorieCodes[promiseIdxs[i]]);
            if(retDB.success) {
                retMarketData[promiseIdxs[i]] = retDB.itemList;
            }
        }

    } catch (error) {
        retMarketData = [[], [], [], [], [], [], [], [], [], [], []];
        logger.log('error', `getMarketPriceByCategorys: async : ${error}`);
    }

    return retMarketData;
}

const isValidDBItemList = (itemList) => {
    if(itemList.length == 0) return false;
    
    const lastupdate = new Date(itemList[0].lastupdate);
    return ((lastupdate.getTime() + 1000*10) > new Date().getTime());
}

const updateMarketDBPriceByCode = async (categoryCode) => {
    const requestJson = getRequestMarketJson(categoryCode);
    const totItemList = await callAPIMarketItemAllPage(requestJson);

    if(totItemList.length > 0)
        await dbService.saveMarketDBCategoryByCode(categoryCode, totItemList);
};

const callAPIMarketItemAllPage = async (requestJson) => {
    let retSearch = [];
    try{
        retSearch = await lostarkAPI.wrapper.requestMarketItemsAllPage(requestJson);
    } catch (error) {
        retSearch = [];
    }

    return retSearch;
}

const getRequestMarketJson = (categoryCode) => {
    let requestJson = {
        "Sort": "PRICE",
        "CategoryCode": categoryCode,
        "CharacterClass": "",
        "ItemTier": 0,
        "ItemGrade": "",
        "ItemName": "",
        "PageNo": 0,
        "SortCondition": "DESC"
    };

    if(categoryCode == 40000) requestJson["ItemGrade"] = '전설';

    if(categoryCode == 50010 || categoryCode == 50020 || categoryCode == 51100 )
        requestJson["ItemTier"] = 3;

    if(categoryCode == 50070) {
        requestJson["CategoryCode"] = 50000;
        requestJson["ItemName"] = "오레하";
    }

    return requestJson;
}

const favItemList = () => {
    const jsonArray = [
        { name:"각인서(전설)", div:0 , list: [
            { code: "65200504", name: "원한 각인서"}
            ,{ code: "65201004", name: "예리한 둔기 각인서"}
            ,{ code: "65202804", name: "저주받은 인형 각인서"}
            ,{ code: "65203004", name: "기습의 대가 각인서"}
            ,{ code: "65201504", name: "결투의 대가 각인서"}
            ,{ code: "65203304", name: "돌격대장 각인서"}
            ,{ code: "65203504", name: "질량 증가 각인서"}
            ,{ code: "65203704", name: "타격의 대가 각인서"}
            ,{ code: "65203904", name: "아드레날린 각인서"}
            ,{ code: "65204104", name: "전문의 각인서"}
        ]}
        ,{ name:"직업 각인서(전설)", div:2 ,list: [
            { code: "65211114", name: "[버서커] 광기 각인서"}
            ,{ code: "65211124", name: "[버서커] 광전사의 비기 각인서"}
            ,{ code: "65211214", name: "[디스트로이어] 분노의 망치 각인서"}	
            ,{ code: "65211224", name: "[디스트로이어] 중력 수련 각인서"}
            ,{ code: "65211314", name: "[워로드] 전투 태세 각인서"}
            ,{ code: "65211324", name: "[워로드] 고독한 기사 각인서"}
            ,{ code: "65211414", name: "[홀리나이트] 심판자 각인서"}
            ,{ code: "65211424", name: "[홀리나이트] 축복의 오라 각인서"}
            ,{ code: "65211614", name: "[슬레이어] 포식자 각인서"}
            ,{ code: "65211624", name: "[슬레이어] 처단자 각인서"}
            ,{ code: "65212114", name: "[아르카나] 황후의 은총 각인서"}
            ,{ code: "65212124", name: "[아르카나] 황제의 칙령 각인서"}
            ,{ code: "65212214", name: "[서머너] 상급 소환사 각인서"}
            ,{ code: "65212224", name: "[서머너] 넘치는 교감 각인서"}
            ,{ code: "65212314", name: "[바드] 진실된 용맹 각인서"}
            ,{ code: "65212324", name: "[바드] 절실한 구원 각인서"}
            ,{ code: "65212414", name: "[소서리스] 점화 각인서"	}
            ,{ code: "65212424", name: "[소서리스] 환류 각인서"	}
            ,{ code: "65213114", name: "[배틀마스터] 오의 강화 각인서"}
            ,{ code: "65213124", name: "[배틀마스터] 초심 각인서"}
            ,{ code: "65213214", name: "[인파이터] 극의: 체술 각인서"}
            ,{ code: "65213224", name: "[인파이터] 충격 단련 각인서"}
            ,{ code: "65213314", name: "[기공사] 세맥타통 각인서"}
            ,{ code: "65213324", name: "[기공사] 역천지체 각인서"}
            ,{ code: "65213414", name: "[창술사] 절정 각인서"}
            ,{ code: "65213424", name: "[창술사] 절제 각인서"}
            ,{ code: "65213614", name: "[스트라이커] 일격필살 각인서"}
            ,{ code: "65213624", name: "[스트라이커] 오의난무 각인서"}
            ,{ code: "65214114", name: "[블레이드] 잔재된 기운 각인서"}
            ,{ code: "65214124", name: "[블레이드] 버스트 각인서"	}
            ,{ code: "65214214", name: "[데모닉] 완벽한 억제 각인서"}
            ,{ code: "65214224", name: "[데모닉] 멈출 수 없는 충동 각인서"}	
            ,{ code: "65214314", name: "[리퍼] 갈증 각인서"}
            ,{ code: "65214324", name: "[리퍼] 달의 소리 각인서"}
            ,{ code: "65215114", name: "[호크아이] 두 번째 동료 각인서"}
            ,{ code: "65215124", name: "[호크아이] 죽음의 습격 각인서"}
            ,{ code: "65215214", name: "[데빌헌터] 강화 무기 각인서"}
            ,{ code: "65215224", name: "[데빌헌터] 핸드거너 각인서"}
            ,{ code: "65215314", name: "[블래스터] 화력 강화 각인서"}
            ,{ code: "65215324", name: "[블래스터] 포격 강화 각인서"}
            ,{ code: "65215414", name: "[스카우터] 아르데타인의 기술 각인서"}	
            ,{ code: "65215424", name: "[스카우터] 진화의 유산 각인서"}
            ,{ code: "65215614", name: "[건슬링어] 피스메이커 각인서"}
            ,{ code: "65215624", name: "[건슬링어] 사냥의 시간 각인서"}
            ,{ code: "65216114", name: "[도화가] 회귀 각인서"}
            ,{ code: "65216124", name: "[도화가] 만개 각인서"}
            ,{ code: "65216214", name: "[기상술사] 질풍노도 각인서"}	
            ,{ code: "65216224", name: "[기상술사] 이슬비 각인서"}
        ]}
        ,{ name:"재련 추가 재료", div:3 , list: [
            { code: "66102003", name: "파괴석 결정"}
            ,{ code: "66102004", name: "파괴강석"}
            ,{ code: "66102005", name: "정제된 파괴강석"}
            ,{ code: "66130131", name: "명예의 파편 주머니(소)"}
            ,{ code: "66130132", name: "명예의 파편 주머니(중)"}
            ,{ code: "66130133", name: "명예의 파편 주머니(대)"}
        ]}
        ,{ name:"재련 재료", div:0 , list: [
            { code: "66110221", name: "명예의 돌파석"}
            ,{ code: "66110222", name: "위대한 명예의 돌파석"}
            ,{ code: "66110223", name: "경이로운 명예의 돌파석"}
            ,{ code: "66110224", name: "찬란한 명예의 돌파석"}
            ,{ code: "66111121", name: "태양의 은총"}
            ,{ code: "66111122", name: "태양의 축복"}
            ,{ code: "66111123", name: "태양의 가호"}
        ]}
        ,{ name:"기타 재료", div:0 , list: [
            { code: "66160220", name: "선명한 지혜의 정수"}
            ,{ code: "66160320", name: "빛나는 지혜의 정수"}
        ]}
    ]

    return jsonArray;
}

const upadetMarketDBHistory = async () => {
    try { 
        const idNameList = await dbService.readMarketDBAllItemIds();
        if(idNameList.length > 0) {
            let idList = [];
            let nameMap = {};
            idNameList.forEach((r) => {
                idList.push(r.Id);
                nameMap[r.Name] = r.Id;
            });

            const historyList = await callAPIMarketItemRecord(idList);
            if(historyList.length > 0) {
                let pars = [];
                historyList.forEach((history) => {
                    if(history.Stats.length > 0 ) {
                        history.Stats.forEach((log) => {
                            pars.push([ nameMap[history.Name], (log.AvgPrice > 0 ? log.AvgPrice : null), log.TradeCount, log.Date ]);
                        });
                    }
                });

                await dbService.saveMarketDBHistoryBulk(pars);
            }
        }
    } catch (error) {
        logger.log('error', `upadetMarketDBHistory : ${error}`);
    }
}

const callAPIMarketItemRecord = async (idList) => {
    let historyList = [];
    try { 
        if(idList.length > 0) {
            let PromiseArray = [];
            idList.forEach((id) => {
                let tmpPromise = lostarkAPI.wrapper.requestMarketItemsByItemId(id);
                PromiseArray.push(tmpPromise);
            });

            let PromiseResultArray = [];
            PromiseResultArray = await Promise.allSettled(PromiseArray).then(
                (list) => { return list; }
            ).catch(
                (error) => { throw error; }
            );

            PromiseResultArray.forEach((fulfilledData) => {
                if(fulfilledData.status == 'fulfilled' && fulfilledData.value.length > 0) {
                    fulfilledData.value.forEach((item) => {
                        if(item && item.Stats.length > 0) {
                            historyList.push({
                                Name: item.Name,
                                Stats: item.Stats,
                            });
                        }
                    });
                }
            });
        }
    } catch (error) {
        logger.log('error', `callAPIMarketItemRecord : ${error}`);
        historyList = [];
    }
    return historyList;
}
