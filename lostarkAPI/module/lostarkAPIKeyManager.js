const logger = require('../../utils/logger');

class LostArkApiKeyManager {
    static lostarkDeveloperKeys = [
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyIsImtpZCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyJ9.eyJpc3MiOiJodHRwczovL2x1ZHkuZ2FtZS5vbnN0b3ZlLmNvbSIsImF1ZCI6Imh0dHBzOi8vbHVkeS5nYW1lLm9uc3RvdmUuY29tL3Jlc291cmNlcyIsImNsaWVudF9pZCI6IjEwMDAwMDAwMDAwMDA1MDkifQ.O7rgmt4fRNNSckA1xbmMTI4HDCnTV5LbsRZ0EOySxvjuQfpn8eTI94l8FBBWigFjiUJcK6M2aeRLvgMU9UJWKjK8vGrBLhqr0ssDLVeqBGBMomCO3xcnArHKnSPPI4ydjGVg9g1rGoTVOZWbXTNZTqhaE93Mr5YVaWJu6LDdKGELXvN7kcgT4MBnLrOpIeU06yzZe_61lED90Lu6X_nfHBRsL2Hx6YU9fGeENUWRPP57LDnE6CvQy3UC8FLfSeW2mElyQdkE06cFnfbx7u4GBPbxZ6ZybJrx7ykT62VNf5GiS-QJcQFuVJcabgn2bvxw_387JLkaDlqQDj09jlgdzA',
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyIsImtpZCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyJ9.eyJpc3MiOiJodHRwczovL2x1ZHkuZ2FtZS5vbnN0b3ZlLmNvbSIsImF1ZCI6Imh0dHBzOi8vbHVkeS5nYW1lLm9uc3RvdmUuY29tL3Jlc291cmNlcyIsImNsaWVudF9pZCI6IjEwMDAwMDAwMDAwMDA1NDkifQ.oZjffGCxz-TQaKxhie9HuJ01z4pmr1HNllXv7PZCtYd5Bc4ISZWHOOc2EAUg_umVh8uSMILU3-v1sPWo1jf2pgXaSounFcfIZx67Mkl2JUnbLDaXwHPTycNc3fKbOKtTYlHaQ4kkKyeeI4jPm9-9Up3eb8ZtcnuX-rDgc1HJqwSflsodnqL0DiYM6RvbapEf2ExeujO_agQgTA9Af2LlqUmQexq23-vNDxA7s4ZLawCenYAC11FUQ0-WkieXaWjjF4MtLbMSQiIU10UoHW9sFcJ8DFWNBUB4jC9u2ZabK0E1nl80WzKBiRKIZKrSCjUqr8u-sDZENidsNT_YZaojaw',
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyIsImtpZCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyJ9.eyJpc3MiOiJodHRwczovL2x1ZHkuZ2FtZS5vbnN0b3ZlLmNvbSIsImF1ZCI6Imh0dHBzOi8vbHVkeS5nYW1lLm9uc3RvdmUuY29tL3Jlc291cmNlcyIsImNsaWVudF9pZCI6IjEwMDAwMDAwMDAwMDA1NjIifQ.b9colNJB0tLtdxRQoE4xzjXBJ3AaTysQrz_BgD7825yXt5vj5P5LOxOSGfPKBoIL-WSYE64GPzwTtDEtNFCfIRcNZpMuZdZZKcSGldvKs2-Bq81Fp5FUWS096BRyWteiUOr_1yR1gCme0KL5euPxBPp0NI-ueGeeCuH4fRMiYivOZSv-igXZbj8jaB1i1HUdLJpRCgisHWoMZIFmQHiPtZW1nl-fidVG6_JGzG7I4o1pZP7pZP_YnOGXyN-mhdTOZPo9YUS9uF2FIjVISxl31qQVKQrSRId-nh3G1fn6UI1C2eQgPlPva_uT4NtczX064FDMxWs339LzrpkFdPWHgg',
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyIsImtpZCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyJ9.eyJpc3MiOiJodHRwczovL2x1ZHkuZ2FtZS5vbnN0b3ZlLmNvbSIsImF1ZCI6Imh0dHBzOi8vbHVkeS5nYW1lLm9uc3RvdmUuY29tL3Jlc291cmNlcyIsImNsaWVudF9pZCI6IjEwMDAwMDAwMDAwMDA1NjMifQ.bJQvrsKTyuDdxvhvAOJUcAVozNIcCpxo0N9-OJzBsZ5JW0xiS0QGY1_pxFKwrTvSn8-iWQEsKflO6b6XPFozRkhxNLvX6te_8oaZ38SKKmlR1o3K4ezEonCsTm5A4zTEqQ2WP_a0P6EwkVHcrdEx1L8inc0TtZMT0Fh5SCLo0IpfwMgACNnG3ivngy9Wees-aITo3J_AjbdytuEzOLm2A95xPwyk03DX_o-GoAGGMFrZn45CBangC_nS4-s43Y7W1K01b7EkfV17uOjXyrg4xqXcf6CXu0ez3glzZIHXmpeTam_NRlO1JZKZfkLs017ZB5Z14o02jgW_ek7wV3NAwA',
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyIsImtpZCI6IktYMk40TkRDSTJ5NTA5NWpjTWk5TllqY2lyZyJ9.eyJpc3MiOiJodHRwczovL2x1ZHkuZ2FtZS5vbnN0b3ZlLmNvbSIsImF1ZCI6Imh0dHBzOi8vbHVkeS5nYW1lLm9uc3RvdmUuY29tL3Jlc291cmNlcyIsImNsaWVudF9pZCI6IjEwMDAwMDAwMDAwMDA1NjQifQ.cXSANsVG95G6KdDvIJUiOMeEipvvzT6sb8b23tCYJRkmV9MIUeJ0NWfKqFFha_E3s6hGz_oG89fsuu4M-_j1Q6gbxy7GICdgAgqDIemcBZkTZgLj65UivXUJwVZ9rlgONymdinV1Kka4zWoDBV_oV0p3pY6FYqsSOpuNF7_I4sf40cHN5tXz1at8Aiv637vP1oxTpYUVChTOawdGKRNBAgUyG9khvG5inMxaLH-DYoyX0zXIAydIqcmVq65ZbfwplwvEeACsnZ6JxFQjPQpWA1wlRVQ6VezPFyJvQPBeXGtQnRKEreZDA1lgrcEmYMuhwKRbKR-M9e5M0WPZd7oMQA',
    ];
    static apiMaxRetry = 5;

    constructor() {
        this.keyIdx = 0;
        this.keyLimit = [];

        for(let i = 0; i < LostArkApiKeyManager.lostarkDeveloperKeys.length; i++)
            this.keyLimit.push(false);
    }

    /** 
     * Api Call 시도 횟수 리턴 
     */
    getMaxRetry() { return LostArkApiKeyManager.apiMaxRetry; }

    /**
     * 사용가능한 KeyIdx를 리턴
     */
    getKeyIdx() {
        this.keyIdx++;
        let retIdx = 0;
        if(this.keyIdx >= LostArkApiKeyManager.lostarkDeveloperKeys.length) this.keyIdx = 0;
        
        for(let idx = this.keyIdx; idx < LostArkApiKeyManager.lostarkDeveloperKeys.length; idx++ ) {
            if(!this.keyLimit[idx]) {
                retIdx = idx;
                break;
            }
        }

        return retIdx;
    }

    /**
     * Idx에 해당하는 Key 리턴
     * @param { number } idx 
     * @returns { String }
     */
    getKey(idx) {
        return LostArkApiKeyManager.lostarkDeveloperKeys[idx];
    }

    /** 
     * 사용가능한 Key가 있을때까지 wait  
     */
    async waitKeyLimit() {
        let loop = true;
        let waitTime = 0;
        while (loop) {
            this.keyLimit.forEach((limit) => {
                if(!limit) {
                    loop = false;
                }
            });
            if(loop) {
                await this.wait(100);
                waitTime ++;
            }
        }
    }

    /**
     * wait
     */
    async wait(timeToDelay) {
        return new Promise((resolve) => { setTimeout(resolve, timeToDelay); });
    }

    /**
     * Idx에 해당하는 Key 사용제한 설정
     * @param { number } idx 
     */
    async setKeyLimit(idx) {
        this.keyLimit[idx] = true;
        logger.log('error', `setKeyLimit idx ${idx}, set keyLimit! ${this.keyLimit}`);
        setTimeout(this.releaseLimit(idx), 1000*60);
    }

    /**
     * Idx에 해당하는 Key 사용제한 해제
     * @param { number } idx 
     */
    releaseLimit(idx) {
        if(this.keyLimit[idx])
            this.keyLimit[idx] = false;
        logger.log('error', `releaseLimit idx ${idx}`);
    }
}

module.exports = new LostArkApiKeyManager();