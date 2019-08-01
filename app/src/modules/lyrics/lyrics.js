/**
 * This is your main app file. Please refer to the documentation for more information.
 */

/**
 * If you need to import extra node_modules, use "npm install xxx --save" and place them there.
 */

var Promise = require("bluebird");
var _ = require('@qwant/front-i18n')._;

const sha1 = require('sha1');
const redisTools = require('../../redis_tools');
const apiCaller = require('../../api_caller');

// Init Redis once
redisTools.initRedis();

module.exports = {

    /**
     * MusixMatch API Key
     */
    API_KEY: 'YOUR_API_KEY',

    /**
     * Try to retrieve and parse lyrics from Redis.
     * @param cacheKey The lyrics request key
     * @returns Promise<Object> A promise of cached lyrics
     */
    getLyricsFromCache: cacheKey => redisTools.getFromCache(cacheKey).then(cached => {
        if (cached) {
            // Parse the lyrics object
            return JSON.parse(cached);
        } else  {
            throw new Error('Unable to find a cached lyrics object for that key');
        }
    }),

    /**
     * Try to search for the track id on MusixMatch API
     * @param lyricsRequest The user request for lyrics (song title, artist name, partial lyrics)
     * @param proxyURL
     * @returns Promise<object> A promise of a track id, title, and artist name
     */
    searchForTrack: (lyricsRequest, proxyURL) => {

        // Request only one track result with available lyrics and search in artist, title and lyrics.
        const request = 'https://api.musixmatch.com/ws/1.1/track.search' +
            '?page=1' +
            '&page_size=1' +
            '&f_has_lyrics=1' +
            '&s_track_rating=desc' +
            `&apikey=${this.API_KEY}` +
            `&q=${encodeURIComponent(lyricsRequest)}`;

        // Structure of the response
        // TODO refine structure with optional keys
        const structure = {
            "message": {
                "header": {
                    "status_code": "number",
                    "execute_time": "number",
                    "available": "number"
                },
                "body": {
                    "track_list": [
                        {
                            "track": {
                                "track_id": "number",
                                "track_name": "String",
                                "track_name_translation_list": ["String"],
                                "track_rating": "number",
                                "commontrack_id": "number",
                                "instrumental": "number",
                                "explicit": "number",
                                "has_lyrics": "number",
                                "has_subtitles": "number",
                                "has_richsync": "number",
                                "num_favourite": "number",
                                "album_id": "number",
                                "album_name": "String",
                                "artist_id": "number",
                                "artist_name": "String",
                                "track_share_url":"String",
                                "track_edit_url":"String",
                                "restricted": "number",
                                "updated_time": "String",
                                "primary_genres": {
                                    "music_genre_list": [
                                        {
                                            "music_genre": {
                                                "music_genre_id": "number",
                                                "music_genre_parent_id": "number",
                                                "music_genre_name": "String",
                                                "music_genre_name_extended": "String",
                                                "music_genre_vanity": "String"
                                            }
                                        }
                                    ]
                                }
                            }
                        },
                    ]
                }
            }
        };

        // Call the API
        return apiCaller.call(request, structure, proxyURL, this.timeout, redisTools).then((response) => {
            // Check response code
            const statusCode = response.message.header.status_code;
            if (statusCode === 200) {
                // Get the track list
                const trackList = response.message.body.track_list;
                if (trackList.length > 0) {
                    // Return the first matched track object
                    return {
                        track_id: trackList[0].track.track_id,
                        track_name: trackList[0].track.track_name,
                        artist_name: trackList[0].track.artist_name,
                    };
                } else {
                    throw new Error('No track found.');
                }
            } else {
                throw new Error('Error while searching for lyrics. Returned status code is: ' + statusCode);
            }
        });
    },

    /**
     * Try to retrieve the lyrics for a track id from MusixMatch API.
     * @param searchResult The id, name and artist of the track
     * @param proxyURL
     * @returns Promise<Object> A Promise of a lyrics object
     */
    retrieveLyrics: (searchResult, proxyURL) => {

        const request =
            `https://api.musixmatch.com/ws/1.1/track.lyrics.get?apikey=${this.API_KEY}&track_id=${searchResult.track_id}`;

        // Define the structure of the answer
        const structure = {
            "message": {
                "header": {
                    "status_code": "number",
                    "execute_time": "number"
                },
                "body": {
                    "@_lyrics": {
                        "@_instrumental": "number",
                        "@_pixel_tracking_url": "String",
                        "@_publisher_list": [
                            "String"
                        ],
                        "@_lyrics_language_description": "String",
                        "@_restricted": "number",
                        "@_updated_time": "String",
                        "@_explicit": "number",
                        "@_lyrics_copyright": "String",
                        "@_html_tracking_url": "String",
                        "@_lyrics_language": "String",
                        "@_script_tracking_url": "String",
                        "@_verified": "number",
                        "@_lyrics_body": "String",
                        "@_lyrics_id": "number",
                        "@_writer_list": [
                            "String"
                        ],
                        "@_can_edit": "number",
                        "@_action_requested": "String",
                        "@_locked": "number"
                    }
                }
            }
        };

        // Call the API
        return apiCaller.call(request, structure, proxyURL, this.timeout, redisTools).then((response) => {
            // Check response code
            const statusCode = response.message.header.status_code;
            if (statusCode === 200) {
                // Return the lyrics object
                if (response.message.body.lyrics && response.message.body.lyrics.lyrics_body) {
                    return {
                        artist_name: searchResult.artist_name,
                        track_name: searchResult.track_name,
                        lyrics: response.message.body.lyrics.lyrics_body,
                        copyright: response.message.body.lyrics.lyrics_copyright
                    };
                } else {
                    throw new Error('Lyrics not found or empty');
                }
            } else {
                throw new Error('Error while retrieving lyrics. Returned status code is: ' + statusCode);
            }
        });
    },

    /**
     * Save the lyrics object to Redis DB
     * @param lyricsObj The lyrics object to save
     * @param cacheKey The Redis key to use
     * @returns Promise<Object>
     */
    saveLyricsToCache: (lyricsObj, cacheKey) => {
        return new Promise(resolve => {
            redisTools.saveToCache(cacheKey, lyricsObj, this.cache);
            resolve(lyricsObj);
        });
    },

    /**
     * (NEEDED)
     *	This function uses 3 parameters :
     *	- values : This is an array of values caught by regex.
     *	For example, if you use the keyword "test" with the trigger "start", and you type "test working?",
     *  values would be like this :
     *  	* values[0] = "test working?"
     *  	* values[1] = "test"
     *  	* values[2] = "working?"
     *  But, if you use the trigger "strict", there will be only one value in this array (values[0] = "test working?")
     *  - proxyURL : If you need to call an external API, use the package "request" with proxyURL as value for
     *  "proxy" attribute (you can refer to weather IA to check how to use it properly)
     *  - language : Current language called
     * @returns data to be displayed.
     */

    getData: function (values, proxyURL, language, i18n) {
        const _ = i18n._;

        // Make sure we have a match
        if (!values || !values[0]) {
            return Promise.rejected("Couldn't process query.");
        }

        // Get the lyrics request without the keyword
        const keyword = new RegExp(this.getKeyword(i18n), 'gi');
        const lyricsRequest = values[0].replace(keyword, '').trim();

        // Check whether there is indeed a lyrics request
        if (lyricsRequest === '') {
            return Promise.rejected("No lyrics request found.");
        }

        // Generate the cache key
        const CACHE_KEY = 'lyrics-' + sha1(lyricsRequest); // Hash the request to use as key (prevents long keys).

        // Wire everything up
        return this.getLyricsFromCache(CACHE_KEY)
            .catch(() =>
                this.searchForTrack(lyricsRequest, proxyURL)
                    .then(result => this.retrieveLyrics(result, proxyURL))
                    .then(lyrics => this.saveLyricsToCache(lyrics, CACHE_KEY))
            );

    },

    /**
     * (OPTIONAL/NEEDED)
     * If your name needs to be translated, use this function getName().
     * @returns the tab name translated
     */

    getName: function (i18n) {
        const _ = i18n._;
        return _("Lyrics", "lyrics");
    },

    /**
     * (OPTIONAL/NEEDED)
     * Otherwise, if your name doesn't need to be translated, use this attribute.
     */

    name: "Lyrics",

    /**
     * (OPTIONAL/NEEDED)
     * If your keyword needs to be translated, use this function getKeyword().
     * @returns keyword translated
     */
    getKeyword: function (i18n) {
        const _ = i18n._;
        return _("lyrics", "lyrics");
    },

    /**
     * (OPTIONAL/NEEDED)
     * Otherwise, if your keyword doesn't need to be translated, use this attribute.
     * The keyword can be a regex. If you need help for your regex, use this https://regex101.com/#javascript
     */

    keyword: "lyrics",

    /**
     * (OPTIONAL)
     * script : If your IA includes a script, place it under public/javascript/xxx.js and replace "hello" by "xxx".
     */

    

    /**
     * (NEEDED)
     * triggers : Depending on the trigger, the keyword needs to be placed at a specific point in the query.
     * It has 4 different values :
     * 			start  : keyword + string
     *          end    : string + keyword
     *          any    : string + keyword + string
     *          strict : perfect match with keyword
     */

    trigger: "any",

    /**
     * (NEEDED)
     * flag : Only 3 flags allowed : (default : i)
     * 			- g : global
     * 			- m : multi-line
     * 			- i : insensitive
     */

    flag: "gi",

    /**
     * (NEEDED)
     * timeout : Time before your response is considered as canceled (in milliseconds)
     */

    timeout: 3600,

    /**
     * (NEEDED)
     * cache : Duration of the data cached (in seconds)
     */

    cache: 10800,

    /**
     * (OPTIONAL)
     * order : Order in the IA hierarchy (0 = first)
     * no order = added at the end, alphabetically
     */

    
};
