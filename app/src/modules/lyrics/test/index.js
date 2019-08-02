const assert = require('assert');
const proxyquire =  require('proxyquire');
const apiCallerStub = {};
const Lyrics = proxyquire('../lyrics', { '../../api_caller': apiCallerStub });
const redisTools = require('../../../redis_tools');
redisTools.initRedis();

require('../../../binder')();

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

    describe('searchForTrack', () => {
        it('should return a search result for a valid request', function (done) {
            const lyricsRequest = 'artist name track name';

            apiCallerStub.call = () => {
                return Promise.resolve({
                    message: {
                        header: {
                            status_code: 200,
                            execute_time: 1,
                            available: 1
                        },
                        body: {
                            track_list: [
                                {
                                    track: {
                                        track_id: 1,
                                        track_name: "Track name",
                                        artist_name: "Artist name"
                                    }
                                }
                            ]
                        }
                    }
                });
            };

            let resultPromise = Lyrics.searchForTrack(lyricsRequest, null);

            resultPromise.then((result) => {
                assert.equal(result.track_name, 'Track name');
                assert.equal(result.artist_name, 'Artist name');
                assert.equal(result.track_id, 1);
                done()
            }).catch((error) => {
                done(error)
            });
        });

        it('should error when the response code is not 200', function (done) {
            const lyricsRequest = 'artist name track name';

            apiCallerStub.call = () => {
                return Promise.resolve({
                    message: {
                        header: {
                            status_code: 404,
                            execute_time: 1,
                            available: 0
                        },
                        body: {
                            track_list: []
                        }
                    }
                });
            };

            let resultPromise = Lyrics.searchForTrack(lyricsRequest, null);

            resultPromise.then((result) => {
                done('Error should be handled ' + result);
            }).catch((error) => {
                if (error.message === 'Error while searching for lyrics. Returned status code is: 404') {
                    done()
                } else {
                    done(error)
                }
            });
        });

        it('should error when no track has been found', function (done) {
            const lyricsRequest = 'artist name track name';

            apiCallerStub.call = () => {
                return Promise.resolve({
                    message: {
                        header: {
                            status_code: 200,
                            execute_time: 1,
                            available: 0
                        },
                        body: {
                            track_list: []
                        }
                    }
                });
            };

            let resultPromise = Lyrics.searchForTrack(lyricsRequest, null);

            resultPromise.then((result) => {
                done('Error should be handled ' + result);
            }).catch((error) => {
                if (error.message === 'No track found.') {
                    done()
                } else {
                    done(error)
                }
            });
        });

        it('should error when no relevant has been found', function (done) {
            const lyricsRequest = 'artist name track name';

            apiCallerStub.call = () => {
                return Promise.resolve({
                    message: {
                        header: {
                            status_code: 200,
                            execute_time: 1,
                            available: 0
                        },
                        body: {
                            track_list: [
                                {
                                    track: {
                                        track_id: 1,
                                        track_name: 'OTHER TRACK',
                                        artist_name: 'OTHER ARTIST'
                                    }
                                }
                            ]
                        }
                    }
                });
            };

            let resultPromise = Lyrics.searchForTrack(lyricsRequest, null);

            resultPromise.then((result) => {
                done('Error should be handled ' + result);
            }).catch((error) => {
                if (error.message === 'No relevant track found.') {
                    done()
                } else {
                    done(error)
                }
            });
        });
    });

    describe('retrieveLyrics', () => {
        it('should return a lyrics object for a valid request', (done) => {
            const searchResult = {
                track_id: 1,
                track_name: 'Track name',
                artist_name: 'Artist name'
            };

            apiCallerStub.call = () => {
                return Promise.resolve({
                    message: {
                        header: {
                            status_code: 200,
                            execute_time: 1,
                            available: 1
                        },
                        body: {
                            lyrics: {
                                lyrics_copyright: 'Some copyright',
                                lyrics_body: 'Some lyrics'
                            }
                        }
                    }
                });
            };

            let resultPromise = Lyrics.retrieveLyrics(searchResult, null);

            resultPromise.then((result) => {
                assert.equal(result.track_name, 'Track name');
                assert.equal(result.artist_name, 'Artist name');
                assert.equal(result.lyrics, 'Some lyrics');
                assert.equal(result.copyright, 'Some copyright');
                done()
            }).catch((error) => {
                done(error)
            });
        });

        it('should error when status code is not 200', (done) => {
            const searchResult = {
                track_id: 1,
                track_name: 'Track name',
                artist_name: 'Artist name'
            };

            apiCallerStub.call = () => {
                return Promise.resolve({
                    message: {
                        header: {
                            status_code: 404,
                            execute_time: 1,
                            available: 1
                        },
                        body: {}
                    }
                });
            };

            let resultPromise = Lyrics.retrieveLyrics(searchResult, null);

            resultPromise.then((result) => {
                done('Error should be handled ' + result);
            }).catch((error) => {
                if (error.message === 'Error while retrieving lyrics. Returned status code is: 404') {
                    done()
                } else {
                    done(error)
                }
            });
        });

        it('should error when lyrics are empty', (done) => {
            const searchResult = {
                track_id: 1,
                track_name: 'Track name',
                artist_name: 'Artist name'
            };

            apiCallerStub.call = () => {
                return Promise.resolve({
                    message: {
                        header: {
                            status_code: 200,
                            execute_time: 1,
                            available: 1
                        },
                        body: {
                            lyrics: {
                                lyrics_copyright: 'Some copyright',
                                lyrics_body: ''
                            }
                        }
                    }
                });
            };

            let resultPromise = Lyrics.retrieveLyrics(searchResult, null);

            resultPromise.then((result) => {
                done('Error should be handled ' + result);
            }).catch((error) => {
                if (error.message === 'Lyrics not found or empty.') {
                    done()
                } else {
                    done(error)
                }
            });
        });

        it('should error when lyrics are missing', (done) => {
            const searchResult = {
                track_id: 1,
                track_name: 'Track name',
                artist_name: 'Artist name'
            };

            apiCallerStub.call = () => {
                return Promise.resolve({
                    message: {
                        header: {
                            status_code: 200,
                            execute_time: 1,
                            available: 1
                        },
                        body: {}
                    }
                });
            };

            let resultPromise = Lyrics.retrieveLyrics(searchResult, null);

            resultPromise.then((result) => {
                done('Error should be handled ' + result);
            }).catch((error) => {
                if (error.message === 'Lyrics not found or empty.') {
                    done()
                } else {
                    done(error)
                }
            });
        });
    });
});
