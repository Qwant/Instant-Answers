var IARuntime = function() {
    function Hi(iaData) {
        this.$time = document.getElementById('hello--world');
        this.data = this.$time.innerHTML;
    }

    Hi.prototype.run = function() {
        this.initListeners();
    };

    Hi.prototype.stop = function() {
        this.removeListeners();
    };

    Hi.prototype.initListeners = function() {
        var it = this;
        it.showTime = function() {
            it.isOver = true;
        };

        it.hideTime = function() {
            it.$time.innerHTML = it.data;
            it.isOver = false;
        };

        this.intervalHandler = window.setInterval(function() {
            if(it.isOver) {
                var time = new Date().getTime();
                time = time.toString().split('').map(function (cahr) {
                    return Math.random() > 0.5 ? cahr : '<span class="hello--world--name">' + cahr + '</span>';
                }).join('');
                it.$time.innerHTML = time;
            }
        }, 59);

        this.$time.addEventListener('mouseover', it.showTime);
        this.$time.addEventListener('mouseout', it.hideTime);
    };



    Hi.prototype.removeListeners = function() {
        this.$time.removeEventListener('mouseover', this.showTime);
        window.clearInterval(this.intervalHandler);
    };

    return Hi;


}();