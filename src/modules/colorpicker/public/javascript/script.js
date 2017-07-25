/**
 * This is your main script file. Please refer to the documentation for more information.
 */

var IARuntime = function() {
    function Colorpicker (iaData) {
        // constructor
    }

    /**
     * runs at runtime
     */
    Colorpicker.prototype.run = function() {

        var colorBlock = document.getElementById('color-block');
        var ctx1 = colorBlock.getContext('2d');
        var width1 = colorBlock.width;
        var height1 = colorBlock.height;

        var colorStrip = document.getElementById('color-strip');
        var ctx2 = colorStrip.getContext('2d');
        var width2 = colorStrip.width;
        var height2 = colorStrip.height;

        var colorLabel = document.getElementById('color-label');

        var x = 0;
        var y = 0;
        var drag = false;
        var rgbaColor = 'rgba(255,0,0,1)';

        ctx1.rect(0, 0, width1, height1);
        fillGradient();

        ctx2.rect(0, 0, width2, height2);
        var grd1 = ctx2.createLinearGradient(0, 0, width1, 0);
        grd1.addColorStop(0, 'rgba(255, 0, 0, 1)');
        grd1.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
        grd1.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
        grd1.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
        grd1.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
        grd1.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
        grd1.addColorStop(1, 'rgba(255, 0, 0, 1)');
        ctx2.fillStyle = grd1;
        ctx2.fill();

        function click(e) {
            x = e.offsetX;
            y = e.offsetY;
            var imageData = ctx2.getImageData(x, y, 1, 1).data;
            rgbaColor = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
            fillGradient();
        }

        function fillGradient() {
            ctx1.fillStyle = rgbaColor;
            ctx1.fillRect(0, 0, width1, height1);

            var grdWhite = ctx2.createLinearGradient(0, 0, width1, 0);
            grdWhite.addColorStop(0, 'rgba(255,255,255,1)');
            grdWhite.addColorStop(1, 'rgba(255,255,255,0)');
            ctx1.fillStyle = grdWhite;
            ctx1.fillRect(0, 0, width1, height1);

            var grdBlack = ctx2.createLinearGradient(0, 0, 0, height1);
            grdBlack.addColorStop(0, 'rgba(0,0,0,0)');
            grdBlack.addColorStop(1, 'rgba(0,0,0,1)');
            ctx1.fillStyle = grdBlack;
            ctx1.fillRect(0, 0, width1, height1);
        }

        function mousedown(e) {
            drag = true;
            changeColor(e);
        }

        function mousemove(e) {
            if (drag) {
                changeColor(e);
            }
        }

        function mouseup(e) {
            drag = false;
        }

        function changeColor(e) {
            x = e.offsetX;
            y = e.offsetY;
            var imageData = ctx1.getImageData(x, y, 1, 1).data;
            rgbaColor = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
            colorLabel.style.backgroundColor = rgbaColor;
            document.getElementById("rgbaValue").value = rgbaColor;
            var hex = convertRgbToHex(rgbaColor);
            document.getElementById("hexaValue").value = hex;
            var form = ((0.3*imageData[0])+(0.59*imageData[1])+(0.11*imageData[2]));
            console.log(form);
            if( form >= 128){
                document.getElementById("rgbaValue").style.color = "black";
                document.getElementById("hexaValue").style.color = "black";
                document.getElementById("rgbaValue").style.borderColor = "black";
                document.getElementById("hexaValue").style.borderColor = "black";
            }else {
                document.getElementById("rgbaValue").style.color = "white";
                document.getElementById("hexaValue").style.color = "white";
                document.getElementById("rgbaValue").style.borderColor = "white";
                document.getElementById("hexaValue").style.borderColor = "white";
            }


        }
        var goHex = document.getElementById("actionHex");
        goHex.onclick = function(){
            var NewHex = document.getElementById("hexaValue").value;
            NewHex = convertHexToRgbA(NewHex);
            colorLabel.style.backgroundColor = NewHex;
            document.getElementById("rgbaValue").value = NewHex;
            // colorLabel.style.backgroundColor = NewRgba;
        }
        var goRgb = document.getElementById("actionRgb");
        goRgb.onclick = function(){
            var NewRgb = document.getElementById("rgbaValue").value;
            var NewHex = convertRgbToHex(NewRgb);
            colorLabel.style.backgroundColor = NewRgb;
            document.getElementById("hexaValue").value = NewHex;
            // colorLabel.style.backgroundColor = NewRgba;
        }
        function convertRgbToHex(rgb){
            rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
            return (rgb && rgb.length === 4) ? "#" +
                ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
                ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
                ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';


        }
        function convertHexToRgbA(hex){
            var c;
            if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
                c= hex.substring(1).split('');
                if(c.length== 3){
                    c= [c[0], c[0], c[1], c[1], c[2], c[2]];
                }
                c= '0x'+c.join('');
                return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1)';
            }
            throw new Error('Bad Hex');
    }

        colorStrip.addEventListener("click", click, false);

        colorBlock.addEventListener("mousedown", mousedown, false);
        colorBlock.addEventListener("mouseup", mouseup, false);
        colorBlock.addEventListener("mousemove", mousemove, false);
    };


    Colorpicker.prototype.stop = function() {
        // function that's gonna run upon exit
    };

    return Colorpicker;
}();