const EPOCH_MAYAN = -1137142
const EPOCH_MAYAN_HAAB = -1137490
const EPOCH_MAYAN_TZOLKIN = -1137301

const TzolkinNames = [ 'NULL', "Imix", "Ik", "Akbal", "Kan", "Chicchan",
    "Cimi", "Manik", "Lamat", "Muluc", "Oc", "Chuen", "Eb", "Ben", "Ix",
    "Men", "Cib", "Caban", "Etznab", "Cauac", "Ahau" ];

const HaabMonths = [ 'NULL', "Pop", "Uo", "Zip", "Zotz", "Tzec", "Xul",
    "Yaxkin", "Mol", "Chen", "Yax", "Zac", "Ceh", "Mac", "Kankin",
    "Muan", "Pax", "Kayab", "Cumku", "Uayeb" ];


class DataMaia{
    constructor(gregorian){
        var [baktun, katun, tun, uinal, kin] = mayan_long_count_from_fixed(gregorian)
        this.baktun = baktun;
        this.katun = katun;
        this.tun = tun;
        this.uinal = uinal;
        this.kin = kin;
        
        var [haab_day, haab_month] = mayan_haab_from_fixed(gregorian)
        this.haab_day = haab_day;
        this.haab_month = haab_month;
        this.haab_symbol = HaabMonths[haab_month];


        var [tzolkin_number, tzolkin_name] = mayan_tzolkin_from_fixed(gregorian)
        this.tzolkin_number = tzolkin_number;
        this.tzolkin_name = tzolkin_name;
        this.tzolkin_symbol = TzolkinNames[tzolkin_name];
    }

    parseLongCount(){
        return `Long date = ${this.baktun}.${this.katun}.${this.tun}.${this.uinal}.${this.kin}`
    }
}







document.getElementById('data').value = '2022-01-01'
pegarData('2022-01-01')








function pegarData(data) {
    var data_split = data.split('-')
    console.log(data_split)

    gregorian = fixed_from_gregorian(parseInt(data_split[0]), parseInt(data_split[1]), parseInt(data_split[2]))
    console.log(`gregorian = ${gregorian}`)

    maia = new DataMaia(gregorian)

    console.log(maia.parseLongCount())
    console.log(`Haab = ${maia.haab_day} ${maia.haab_symbol}`)
    console.log(`Tzolkin = ${maia.tzolkin_number} ${maia.tzolkin_symbol}`)


    // mostrar data no html:
    mostrarData(maia)
}

function mostrarData(dataMaia) {
    const longList = document.getElementById('longList').getElementsByTagName('li')
    for (let index = 0; index < longList.length; index++) {
        const element = longList[index];
        
        var value
        switch (index) {
            case 0:
                value = `baktun: ${maia.baktun}`
                break;
            case 1:
                value = `katun: ${maia.katun}`
                break;
            case 2:
                value = `tun: ${maia.tun}`
                break;
            case 3:
                value = `uinal: ${maia.uinal}`
                break;
            case 4:
                value = `kin: ${maia.kin}`
        }
        
        element.children[0].innerHTML = value
    }

    const tzolkinList = document.getElementById('tzolkinList').getElementsByTagName('li')
    tzolkinList[0].children[0].innerHTML = `${dataMaia.tzolkin_number} ${dataMaia.tzolkin_symbol}`


    const haabList = document.getElementById('haabList').getElementsByTagName('li');
    haabList[0].children[0].innerHTML = `${dataMaia.haab_day} ${dataMaia.haab_symbol}`
}









function mod(x, y) {
    return x - y * Math.floor(x / y)
};

function amod(x, y) {
    return y + mod(x, -y);
}

function fixed_from_gregorian(year, month, day){
    var correction, f;
    if (month <= 2) correction = 0;
    if (month > 2 && gregorian_leap_year(year)) correction = -1;
    else correction = -2;

    var f = 365 * (year - 1) +
        Math.floor((year - 1) / 4.0) -
        Math.floor((year - 1) / 100.0) +
        Math.floor((year - 1) / 400.0) +
        Math.floor((367 * month - 362) / 12.0) +
        correction + day;
    return f;
}

function gregorian_leap_year(year){
    var resp = mod(year, 4) == 0 &&
    !(mod(year, 400) == 100 ||
      mod(year, 400) == 200 ||
      mod(year, 400) == 300) ? true : false;

    return resp
};


function mayan_long_count_from_fixed(date) {
    var long_count = date - EPOCH_MAYAN;
    var baktun = mod(Math.floor(long_count / 144000.0), 13);
    var day_of_baktun = mod(long_count,144000);
    var katun = Math.floor(day_of_baktun / 7200.0);
    var day_of_katun = mod(day_of_baktun,7200);
    var tun = Math.floor(day_of_katun / 360.0);
    var day_of_tun = mod(day_of_katun,360);
    var uinal = Math.floor(day_of_tun / 20.0);
    var kin = mod(day_of_tun,20);

    return [baktun, katun, tun, uinal, kin];
}

function mayan_haab_from_fixed(date) {
    var count = mod(date- EPOCH_MAYAN_HAAB, 365);
    var day = mod (count, 20);
    var month = Math.floor(count / 20.0) + 1;

    return [day, month]
}

function mayan_tzolkin_from_fixed(date) {
    var count = date - EPOCH_MAYAN_TZOLKIN + 1;
    var number = amod(count,13);
    var name = amod(count,20);

    return [number, name]
}