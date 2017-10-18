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
          var braces = document.getElementsByClassName('sBrace');
          var brackets = document.getElementsByClassName('sBracket');
          for (collection of Array.prototype.concat.call(brackets, braces)) {
            for(var i = 0; i < collection.length; i++){
              var bra = collection[i];console.log(bra.innerHTML);
              if("{" == bra.innerHTML || "[" == bra.innerHTML){
                console.log('opening');
                var classe = "structure-" + ++structureId;
                bra.className = bra.className+" "+classe;
                bra.innerHTML = bra.innerHTML+' <a href="javascript:;" onclick="fold('+classe+')"><i class="fa fa-minus-square-o"></i></a> '
              }
              else if ("}" == bra.innerHTML || "]" == bra.innerHTML) {
                var classe = "structure-" + structureId--;
                bra.className = bra.className+" "+classe;
              }
            }
          }
        }

        // result.find(".json").find(".sBrace, .sBracket").each(function(i) {
        //     "{" == $(this).text() || "[" == $(this).text() ?
        //       (
        //         $(this).addClass("structure-" + ++structureId),
        //         $(this).append(' <a href="javascript:;"><i class="fa fa-minus-square-o"></i></a> ')
        //       )
        //     : "}" != $(this).text() && "]" != $(this).text() || $(this).addClass("structure-" + structureId--)
        // });
    };

    /**
     * runs upon exit
     */
    Beautify.prototype.stop = function() {
        // function that's gonna run upon exit
    };

    return Beautify;
}();
