const logger = require('./Logger');

class MemoryCache {
    constructor(len, validTime) {
        this.dataList = [];
        this.validTime = validTime;
        this.name = '';

        this.createDataList(len);
    }

    /** Cache에 저장할 데이터 개수 설정
     * 
     * @param { number } len 
     */
    createDataList(len) {
        for(let i = 0; i < len; i++)
            this.dataList.push({updated: null, data: null, func: null});
    }

    /** 입력받은 시간, Idx를 바탕으로 데이터의 유효성 체크
     * 
     * @param { Date } now 
     * @param { number } idx 
     * @returns { bool } 
     */
    isValidData(now = new Date() ,idx) {
        return ( this.dataList[idx].updated && ((this.dataList[idx].updated.getTime() + this.validTime) > now.getTime()));
    }

    /** 입력받은 Idx 가 유효한지 체크
     * 
     * @param { number } idx 
     * @returns 
     */
    isValidIdx(idx) {
        return ( 0 <= idx && idx < this.dataList.length );
    }

    /** 입력받은 Idx에 위치한 데이터 리셋
     * 
     * @param { number } idx 
     */
    resetData(idx) {
        try {
            if(this.isValidIdx(idx))
            {
                this.dataList[idx].updated = null;
                this.dataList[idx].data = null;
            }
        } catch (error) {
            logger.log('error', `MemoryCache(${this.name}) reset(${idx}) error : ${error}`);
        }
    }

    /** 입력받은 Idx에 위치한 데이터를 갱신할 Function 설정
     * 
     * @param { number } idx 
     * @param { Function } func 
     */
    setDataFunc(idx, func) {
        try {
            if(this.isValidIdx(idx))
                this.dataList[idx].func = func;
        } catch (error) {
            logger.log('error', `MemoryCache(${this.name}) setDataFunc(${idx}) error : ${error}`);
        }
    }
    
    /** 입력받은 Idx에 위치한 데이터 리턴,
     *  이때 데이터가 유효하지 않은 경우 데이터를 갱신한 뒤에 데이터 리턴 
     * @param { number } idx 
     * @returns 
     */
    async getData(idx) {
        try {
            if(this.isValidIdx(idx))
            {
                if(!this.isValidData(new Date(), idx) && this.dataList[idx].func)
                {
                    this.dataList[idx].updated = new Date();
                    this.dataList[idx].data = await this.dataList[idx].func();
                }
                
                return this.dataList[idx].data;
            }
        } catch (error) {
            logger.log('error', `MemoryCache(${this.name}) getData(${idx}) error : ${error}`);
        }
            
        return null;
    }
}

module.exports = MemoryCache;