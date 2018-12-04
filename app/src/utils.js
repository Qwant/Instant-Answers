module.exports = {
    toFixed: function(num, precision) {
        return (+(Math.round(+(num + 'e' + precision)) + 'e' + -precision)).toFixed(precision);
    },

    getDate: function(timestamp) {
        var d = new Date(timestamp ? timestamp * 1000 : Date.now())
        var day = d.getDate();
        var month = d.getMonth()+1;
        var year = d.getFullYear();

        if(day < 10)
            day = '0' + day;
        if(month < 10)
            month = '0' + month;

        return year + '-' + month + '-' + day
    },

    countPrecision: function (amount, keepPrecision = false) {
        const text = amount.toString()

        let j = 0
        let decimal = text.indexOf('.')
        if (decimal !== -1) {
            let i = decimal
            while (i < text.length) {
                if ((keepPrecision && text[i] !== '.') || text[i] === '0') {
                    j++
                    ++i
                } else if (text[i] === '.') {
                    ++i
                } else {
                    return (j > 0 ? j : 1)
                }
            }
        }
        return j
    },

    countSeparators: function (amount) {
        const text = amount.toString()

        let points = 0
        let comas = 0
        let i = 0
        while (i < text.length) {
            if (text[i] === '.')
                points++
            if (text[i] === ',')
                comas++
            ++i
        }
        return {points: points, comas: comas}
    },

    separatorsCross: function (amount) {
        const text = amount.toString()

        let point_i = text.indexOf('.')
        let coma_i = text.indexOf(',')
        if (point_i !== -1 && coma_i !== -1) {
            let i = 0
            let first = (point_i < coma_i ? '.' : ',')
            let found_second = false
            while (i < text.length) {
                if (text[i] === first && found_second) {
                    return true
                } else if (text[i] === (first === '.' ? ',' : '.')) {
                    if (!found_second) {
                        found_second = true
                    }
                }

                ++i
            }
        }
        return false
    }
}