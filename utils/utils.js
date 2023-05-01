module.exports = {
    regx_AlpNum: /^[a-z|A-Z|0-9]*$/,
    regx_Kor: /^[ㄱ-ㅎ|가-힣]*$/,
    regx_KorNum: /^[ㄱ-ㅎ|가-힣|0-9]*$/,
    regx_KorAlpNum: /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+$/,

    isValidKey: (Map, key) => {
        let ret = false;
        const keys = Object.keys(Map);
    
        for(let idx = 0; idx < keys.length; idx++) {
            if(key === keys[idx]) {
                ret = true;
                break;
            }
        }
    
        return ret;
    },

    isEmpty: (obj) => {
        return (typeof obj == "undefined" || obj == null || obj == "" || Object.keys(obj).length === 0);
    },

    isStringEmpty: (str) => {
        return (!str || str.length === 0 || str == 'null');
    },

    getWendsday: () => {
        let date = new Date();
        if(date.getDay() >= 3) {
            date.setDate(date.getDate() - (date.getDay() -3));
        } else {
            date.setDate(date.getDate() - (4 + date.getDay()));
        }
        
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    },

    getNumberFormat: (num) => {
        return num.toFixed(2);
    },

    getIp: (req) => {
        let ip;
        if(req.headers['x-forwarded-for']) {
            ip = req.headers['x-forwarded-for'].split(",")[0];
        } else if(req.connection && req.connection.remoteAddress) {
            ip = req.connection.remoteAddress;
        } else {
            ip = req.ip;
        }
    
        return ip;
    }
};