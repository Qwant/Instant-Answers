const redis = require('redis');
const bluebird = require('bluebird');
const winston = require('winston');
const logger = winston.loggers.get('logger');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const redisOptions = {
    'host': process.env.REDIS_IA_HOST,
    'port': process.env.REDIS_IA_PORT,
    'password': process.env.REDIS_IA_PASSWORD,
    'retry_strategy': function (options) {
        return null;
    }
};

module.exports = {
    client: null,

    test: function() {
        this.client.set("username", "Bob");
        this.client.get("username", (err, reply) => {
            if (reply === "Bob") {
                logger.info('Redis is working', { module: "ia-redis" });
            } else {
                logger.info('Redis ISN\'T working : ' + err, { module: "ia-redis" });
            }
        });
    },

    initRedis: function () {
        this.client = redis.createClient(redisOptions);
        this.client.on("error", (err) => {
            logger.error("Error REDIS " + err, {module: "ia-redis"});
        });
        return !!this.client;
    },

    checkAPI: function (host) {
        return this.client.sismemberAsync("hashkeys", host).then((res) => {
            return !res;
        })
    },

    saveToCache: function (key, payload, duration) {
        this.client.setex(key, parseInt(duration), JSON.stringify(payload));
    },

    deleteFromCache: function (key) {
        this.client.del(key, () => {
            logger.info(key + ' deleted from cache');
        });
    },

    getFromCache: function (key) {
        return this.client.getAsync(key).then((result) => {
            if (result) {
                return result;
            } else {
                return null;
            }
        });
    },

    blacklistAPI: function (host, reason) {
        this.client.hmset(`blacklisted:${host}`, ["host", host, "date", Math.floor(Date.now() / 1000), "reason", reason], (err, res) => {
            if (res === "OK") {
                this.client.sadd("hashkeys", host, (err, res) => {
                    if (res) {
                        logger.info('[' + host + '] added to the blacklist (reason: ' + reason + ')', {"module": "api-caller"});
                    } else {
                        logger.error("Couldn't add " + host + " to hashkeys (" + err + ")", {"module": "api-caller"});
                    }
                })
            }  else {
                logger.error("Couldn't add " + host + " to blacklist (" + err + ")", {"module": "api-caller"});
            }
        })
    },

    callAPITimeout: function (host, nb_timeouts_allowed) {
        const now = new Date().getTime();

        this.client.hgetall(`timeout:${host}`, (err, reply) => {
            if (reply.timeout && reply.firstTimeout && (now - reply.firstTimeout) < (60 * 60 * 1000)) {
                reply.timeout += 1;
                this.client.hset(`timeout:${host}`, "timeout", reply.timeout, (err, res) => {
                    if (!err) {
                        logger.info('[' + host + '] added to the timeout list (count: ' + reply.timeout + ')', {"module": "api-caller"});
                        if (reply.timeout === nb_timeouts_allowed) {
                            this.blacklistAPI(host, "" + reply.timeout + " timeouts in less than 1 hr");
                        }
                    } else {
                        logger.error("Couldn't add " + host + " to the timeout list (" + err + ")", {"module": "api-caller"});
                    }
                })
            } else {
                this.client.hmset(`timeout:${host}`, ["timeout", 1, "firstTimeout", now], (err, res) => {
                    if (res === "OK")
                        logger.info('[' + host + '] added to the timeout list (count: 1)', {"module": "api-caller"});
                    else {
                        logger.error("Couldn't add " + host + " to the timeout list (" + err + ")", {"module": "api-caller"});
                    }
                })
            }
        })
    },

    emptyBlacklist: function () {
        let purged = 0

        this.client.smembers("hashkeys", (err, res) => {
            if (res && res.length) {
                res.forEach((host) => {
                    this.client.hdel(`blacklisted:${host}`, "host", "reason", "date", (err, reshdel) => {
                        if (reshdel) {
                            logger.info(host + " removed from blacklist");
                            this.client.srem("hashkeys", host, (err, ressrem) => {
                                if (ressrem) {
                                    purged++
                                    if (res.length === purged) {
                                        logger.info("Blacklist purged!");
                                    }
                                }
                            })
                        } else {
                            logger.error("Error: couldn't remove " + host + " from blacklist");
                        }
                    })
                })
            } else {
                logger.info("Blacklist is already empty!");
            }
        })
    },

    removeFromBlacklist: function (host) {
        this.client.smembers("hashkeys", (err, res) => {
            if (res.length) {
                res.forEach((host) => {
                    if (host === hostToRemove) {
                        this.client.hdel(`blacklisted:${host}`, "host", "reason", "date", (err, res) => {
                            if (res) {
                                this.client.srem("hashkeys", host, (err, res) => {
                                    if (res) {
                                        logger.info(host + " removed!")
                                    }
                                })
                            } else {
                                logger.error("Error: couldn't remove " + host + " from blacklist")
                            }
                        })
                    } else {
                        logger.error("Error: couldn't find " + host + " in blacklist")
                    }
                })
            } else {
                logger.info("Blacklist is already empty!")
            }
        });
    },

    closeRedis: function () {
        this.client.end(true);
    }
};