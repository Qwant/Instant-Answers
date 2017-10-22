/**
 * This is your main script file. Please refer to the documentation for more information.
 */

var IARuntime = function() {
    var iaData = {};

    function Beautify (iaData) {
      this.iaData = iaData;
    }

    /**
     * runs at runtime
     */
    Beautify.prototype.run = function() {
        console.log('Beautify.run()');
        console.log(this.iaData);
        var structureId = 0;
        if(3 != this.iaData.template){
          var elements = [];
          for(element of document.getElementsByTagName('span') ){ // TODO optimisation
            if(element.className == 'sBrace' || element.className == 'sBracket'){
              elements.push(element);
            }
          }
          for(var bra of elements){
            // var bra = collection[i];
            var innerHTML = bra.innerHTML.trim();
            if("{" == innerHTML || "[" == innerHTML){
              structureId++;
              bra.id = "structure-"+structureId+"-open";
              bra.setAttribute('data-isclose', "1");
              bra.innerHTML = bra.innerHTML+' <a href="javascript:;" onclick="toggle('+structureId+')">(+)</a> '
            }
            else if ("}" == innerHTML || "]" == innerHTML) {
              bra.id = "structure-"+structureId+"-close";
              structureId--;
            }
          }
        }
        window.toggle = function(structureId){
          var open = document.getElementById("structure-"+structureId+"-open");
          var isClose = open.getAttribute('data-isclose') == "1";
          var close = document.getElementById("structure-"+structureId+"-close");
          console.log('toggle '+structureId+' '+isClose);
          // console.log('open', open);
          var current = open.nextSibling;
          while(current != close){
            if(!isClose){
              current.style.display = "";
            } else {
              current.style.display = "none";
            }
            current = current.nextSibling;
          }
          if(isClose){
            open.setAttribute('data-isclose', 0);
          } else {
            open.setAttribute('data-isclose', 1);
          }
          if(open.innerHTML.indexOf('(+)') > -1){
            open.innerHTML = open.innerHTML.replace('(+)', '(-)');
          } else {
            open.innerHTML = open.innerHTML.replace('(-)', '(+)');
          }
        };
    };

    /**
     * runs upon exit
     */
    Beautify.prototype.stop = function() {
        // function that's gonna run upon exit
    };

    return Beautify;
}();
