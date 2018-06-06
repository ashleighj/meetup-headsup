if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

let config = {
    CLIENT_ID: process.env.MUHU_CLIENTID,
    CLIENT_SECRET: process.env.MUHU_CLIENTSEC,
    PORT: process.env.MUHU_PORT,
    MEETUP_API_KEY: process.env.MEETUP_API_KEY,
    DB_HOST: process.env.DB_HOST,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD
};

module.exports = config;