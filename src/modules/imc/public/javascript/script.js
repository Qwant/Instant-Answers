/**
 * This is your main script file. Please refer to the documentation for more information.
 */

var IARuntime = function() {
    function Imc (iaData) {
        // constructor
    }
    Imc.prototype.test = function() {
        var go = document.getElementById("action");
        go.onclick = function () {

            console.log("erlg");
            var taille = parseFloat(document.getElementById("taille").value);
            taille = taille/100;
            console.log(taille);
            var poids = parseFloat(document.getElementById("poids").value);
            console.log(poids);
            var imc = poids / (Math.pow(taille, 2));
            imc = Math.round(imc);
            console.log(imc);
            if (isNaN(imc)){
                imc = "Veuillez remplir correctement les champs ci-dessus"
            }
            if (imc <= 16){
                var OMS = "ANOREXIE OU DENUTRITION"
            }else if (imc > 16 && imc <= 18.5){
                var OMS = "MAIGREUR"
            }else if (imc > 18.5 && imc <= 25){
                var OMS = "CORPULENCE NORMALE"
            }else if (imc > 25 && imc <= 30){
                var OMS = "SURPOIDS"
            }else if (imc > 30 && imc <= 35){
                var OMS = "OBESITE MODEREE (CLASSE 1)"
            }else if (imc > 35 && imc <= 40){
                var OMS = "OBESITE ELEVE (CLASSE 2)"
            }else if (imc > 40 ){
                var OMS = "OBESITE MORBIDE OU MASSIVE"
            }

            var result = imc + " Selon l'OMS, l'interpretation de votre IMC est " + OMS;
            document.getElementById("result").innerHTML = result;
        }
    }
    /**
     * runs at runtime
     */
    Imc.prototype.run = function() {
        this.test();
    };

    /**
     * runs upon exit
     */
    Imc.prototype.stop = function() {
        // function that's gonna run upon exit
    };

    return Imc;
}();