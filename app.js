const express = require('express');
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes');
const mariaDB = require('./database/mariadb');

class App {
    constructor() {
        this.app = express();

        this.settingHttp();
        this.setCors();
        //this.settingSession();
        this.settingRoutes();
    }

    settingHttp() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended:true}));
        this.app.set('trust proxy', true);
    }

    setCors() {
        const corsOpts = {
            origin: 'https://myloa.co.kr', 
            //origin: '*', 
            methods: [ 'GET', 'POST' ],
            allowedHeaders: [ 'Content-Type', ],
            credentials: true,
            optionsSuccessStatus: 200,
        };
        
        this.app.use(cors(corsOpts));
    }

    // mysql-session
    settingSession() {
        const sessionMaria = new MySQLStore(mariaDB.optSession);
        this.app.use(
            session({
              key: "session_cookie_name",
              secret: "session_cookie_secret",
              store: sessionMaria,
              resave: false,
              saveUninitialized: false,
            })
        );
    }

    settingRoutes() {
        this.app.use('/', routes);
    }

}


module.exports = new App().app;