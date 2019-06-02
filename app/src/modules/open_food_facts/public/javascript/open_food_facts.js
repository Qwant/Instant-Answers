/**
 * This is your main script file. Please refer to the documentation for more information.
 */

var IARuntime = function() {
    function Open_food_facts (iaData) {
        // constructor
    }

    /**
     * runs at runtime
     */
    Open_food_facts.prototype.run = function() {
        var image = $('.ia__ofc__image img');
        image = (image && image[0] ? image[0] : null);

        if (image) { // Check if image if fully loaded. If not, remove it
            var removeImageContainer = function() {
                var imageContainer = $('.ia__ofc__image');

                if (imageContainer && imageContainer[0]) {
                    imageContainer[0].remove();
                }
            };

            // If image takes too long to load, then the error event is used
            image.addEventListener('error', function(e) {
                removeImageContainer();
            });

            // If image is already loaded, then the error event is useless, we must check manually the image's status
            if (image.complete) {
                if (image.naturalWidth == undefined || image.naturalWidth == 0) {
                    removeImageContainer();
                }
            }
        }
    };

    /**
     * runs upon exit
     */
    Open_food_facts.prototype.stop = function() {
        // function that's gonna run upon exit
    };

    return Open_food_facts;
}();