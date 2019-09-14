/**
 * This is your main script file. Please refer to the documentation for more information.
 */
isOdd = (num) => { return num % 2; };

preventFromClickSpam = (action) => { 
    switch(action) {
        case 'on':
            document.getElementsByClassName('ia__memory_game__board')[0].setAttribute("preventclick", "enabled"); 
            break;
        case 'off':
            document.getElementsByClassName('ia__memory_game__board')[0].setAttribute("preventclick", "disabled");
            break;
    }   
};

isPreventFromClickSpam = () => { 
    var isPrevent = document.getElementsByClassName('ia__memory_game__board')[0].getAttribute('preventclick') === "enabled" ? true : false;
    return isPrevent;
};

selectCard = (flipCard) => {
    // prevent from click spamming
    if(isPreventFromClickSpam()) { return }
    preventFromClickSpam('on')

    flipCard.currentTarget.classList.add('selected');
    var emojiTypeToTest = flipCard.currentTarget.dataset.emojiType;

    var selectedFlipCards = document.getElementsByClassName('ia__memory_game__flip-card selected');
    var emojiTypeSelected = []
    for(var i = 0 ; i < selectedFlipCards.length ; i++) { emojiTypeSelected.push(selectedFlipCards[i].dataset.emojiType) }

    setTimeout(() => { preventFromClickSpam('off'); }, 500);   

    /** Let him play, he has one more card to choose before we have to test pairs  */
    if(isOdd(selectedFlipCards.length)) { return };

    var pairFind = testIfPair(emojiTypeSelected, emojiTypeToTest);

    if(!pairFind) {  setTimeout(() => { flipBackWrongCards(emojiTypeSelected); }, 800); };
}

testIfPair = (emojiTypeSelected, emojiTypeToTest) => {
    var matchCount = 0
    var result = emojiTypeSelected.filter(emoji => emoji === emojiTypeToTest).length

    return(result === 2)
}

flipBackWrongCards = (emojiTypeSelected) => {
    emojiTypeSelected.forEach((emojiType) => {
        isPair = testIfPair(emojiTypeSelected, emojiType)
    
        if(!isPair) { 
            var cardToFlip = document.getElementsByClassName(`ia__memory_game__flip-card selected ${emojiType}`)[0]
            cardToFlip.classList.remove("selected"); 
        }
    });
}

var IARuntime = function() {
    function Memory_game (iaData) {
        document.getElementsByClassName('ia__memory_game__board')[0].setAttribute("preventclick", "disabled");
        var flipCards = document.getElementsByClassName('ia__memory_game__flip-card');

        for(var i = 0 ; i < flipCards.length ; i++) {
            flipCards[i].addEventListener('click', selectCard);
        };

        document.getElementById('reset-button').addEventListener('click', () => {
            document.location.reload();
        })
    };

    /**
     * runs at runtime
     */
    Memory_game.prototype.run = function() {
        // function that's gonna run at runtime
    };

    /**
     * runs upon exit
     */
    Memory_game.prototype.stop = function() {
        // function that's gonna run upon exit
    };

    return Memory_game;
}();