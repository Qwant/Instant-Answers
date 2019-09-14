const MemoryGame = require('../memory_game');
const assert = require('assert');

let i18n = require('../../../setup_i18n')('en_gb', 'en_gb');
const emojiNames = ["angel","anxious","bored","cool","happy","kiss","tongue","suspicious"]

describe('Memory Game', () => {
    let resultPromise = MemoryGame.getData('','', 'en_gb', i18n);

    it('Respond 16 emojis perfectly shuffle', (done) => {
        resultPromise.then((result) => {
            assert.equal(result.emojis.length, 16);
            
            // i want shuffle emojis !
            assert.notStrictEqual(result.emojis.slice(0, 8), emojiNames);
            done()
        }).catch((error) => {
            done(error)
        })
    });
});
