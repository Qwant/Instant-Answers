const redis = require('redis');
const assert = require('assert');
const should = require('chai').should();
const events = require('events');

let redisOptions = {
    'host': process.env.REDIS_IA_HOST,
    'port': process.env.REDIS_IA_PORT,
    'password': process.env.REDIS_IA_PASSWORD
};

describe('Acceptance', () => {
    describe('Redis', () => {
        afterEach((done) => {
            let client = redis.createClient(redisOptions);
            client.flushdb(() => {
                client.end(true);
                done();
            });
        });

        it('should emit ready and connect when creating client', (done) => {
            let client = redis.createClient(redisOptions);
            let didEmitReady = false;
            let didEmitConnect = false;

            client.on('ready', () => {
                didEmitReady = true;
                if (didEmitConnect) {
                    client.end(true);
                    done();
                }
            });

            client.on('connect', () => {
                didEmitConnect = true;
                if (didEmitReady) {
                    client.end(true);
                    done();
                }
            });
        }).timeout(5000);

        it('should return null when getting unexisting key', (done) => {
            let client = redis.createClient(redisOptions);

            client.get("nonexistingkey", (err, reply) => {
                assert.equal(reply, null);
                client.end(true);
                done();
            });
        });

        it('should set key without error and return OK', (done) => {
            let client = redis.createClient(redisOptions);

            client.set("username", "Bob", (err, reply) => {
                assert(!(err instanceof Error));
                assert.equal(reply, "OK");
                client.end(true);
                done();
            })
        })

        it('should set key and get it without error', (done) => {
            let client = redis.createClient(redisOptions);

            client.set("username", "Bob");
            client.get("username", (err, reply) => {
                assert(!(err instanceof Error));
                assert.equal(reply, "Bob");
                client.end(true);
                done();
            })
        })

        it('should add a key, get it, delete it, and return null when trying to get it again', (done) => {
            let client = redis.createClient(redisOptions);

            client.set("username", "Bob");
            client.get("username", (err, reply) => {
                assert(!(err instanceof Error));
                assert.equal(reply, "Bob");
            })
            client.del("username", (err, reply) => {
                assert(!(err instanceof Error));
                assert.equal(reply, 1);
            })
            client.get("username", (err, reply) => {
                assert(!(err instanceof Error));
                assert.equal(reply, null);
                client.end(true);
                done();
            })
        })
    })
});
