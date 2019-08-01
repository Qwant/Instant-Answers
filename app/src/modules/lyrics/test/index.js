const Lyrics = require('../lyrics');
const assert = require('assert');
const redisTools = require('../../../redis_tools');
redisTools.initRedis();

describe('Lyrics', function() {

    it('should store some lyrics in DB', function(done) {
        const lyricsObj = {
            artist_name: 'Artist name',
            track_name: 'Track name',
            lyrics: 'Lyrics body',
            copyright: 'Copyright'
        };
        let resultPromise = Lyrics.saveLyricsToCache(lyricsObj, 'testKey');
        resultPromise.then((result) => {
            assert.equal(result, lyricsObj);
            done()
        }).catch((error) => {
            done(error)
        });
    });

    it('should retrieve lyrics from DB', function(done) {
        const lyricsObj = {
            artist_name: 'Artist name',
            track_name: 'Track name',
            lyrics: 'Lyrics body',
            copyright: 'Copyright'
        };
        redisTools.saveToCache('testKey', lyricsObj, 2000);
        let resultPromise = Lyrics.getLyricsFromCache('testKey');
        resultPromise.then((result) => {
            assert.equal(result.artist_name, lyricsObj.artist_name);
            assert.equal(result.track_name, lyricsObj.track_name);
            done()
        }).catch((error) => {
            done(error)
        });
    });

    /*it('should search for lyrics on MusixMatch API', function (done) {
        const lyricsRequest = 'metallica for whom the bell tolls';
        let resultPromise = Lyrics.searchForTrack(lyricsRequest, null);
        resultPromise.then((result) => {
            assert.equal(result.track_name, 'For Whom The Bell Tolls - Remastered');
            done()
        }).catch((error) => {
            done(error)
        });
    });*/
});
