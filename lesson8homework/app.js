let currencies = [];
let savedCurrenciesStr = '';

let dateField = $('input[type=date]');
let textInNameField = $('input[type=text]');

let todayDate = new Date().toISOString().split('T')[0].split('-').join('');
console.log('todaydate ' + todayDate);

let lsDate = localStorage.getItem('date');
console.log('lsdate ' + lsDate);

let dateToLoad = lsDate ? lsDate : todayDate;

let saveDate = () => {
    console.log('field: ' + dateField.val());
    localStorage.setItem('date', dateField.val().split('-').join(''));
    let gettedDate = localStorage.getItem('date');
    console.log('gettedDate ' + gettedDate);
};

let loadCurrencies = (textForFilter) => {
    let userDate = dateField.val();
    let okDate = userDate.split('-').join('');
    console.log('okDate ' + okDate);
    let jsonAddress = `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=${okDate}&json`;
    console.log(jsonAddress);
    console.log('textForFilter in function: ' + textForFilter);

    $.ajax({
        url: `${jsonAddress}`,
        method: 'GET',
        error: (e) => {
            console.log(e);
        },
        success: (data) => {
            renderSavedCurrencies(data, textForFilter);
            localStorage.setItem('alreadyLoaded', 'yes');
            saveDate();
        }
    });
};


let renderSavedCurrencies = (data, textForFilter) => {
    let arrayOfCountries = [];
    let j = 0;
    for(let index in data) {
        if (data[index]['txt'].toLowerCase().includes(textForFilter)) {
            console.log('includes!!!' + data[index]['txt']);
            j++;
            arrayOfCountries.push(data[index]);
        }
        console.log('j ' + j);
    }

    console.log('arrayOfCountries ' + arrayOfCountries);
    renderCurrenciesHtml(arrayOfCountries);
}

function setDate(dateToLoad) {
    console.log('dateToLoad ' + dateToLoad);
    setDateToLoad = dateToLoad.substring(0, 4) + '-' + dateToLoad.substring(4,6) + '-' + dateToLoad.substring(6,8);
    console.log('setDateToLoad ' + setDateToLoad);
    dateField.val(setDateToLoad);
	loadCurrencies();
}

window.onload = setDate(dateToLoad);

let renderCurrenciesHtml = (data) => {
    let currenciesStr = '';
    for(let item in data) {
        let currency = data[item];
        currenciesStr += `<tr class="currency-${item}">
        <td>${+item+1}</td>
        <td>${currency.cc}</td>
        <td>${currency.txt}</td>
        <td>${currency.rate.toFixed(2)}</td>
    </tr>`;
    }
    $('table.currencies tbody').html(currenciesStr);
};

dateField.change(loadCurrencies);
textInNameField.keyup(() => {
    let textForFilter = textInNameField.val();
    console.log('textForFilter ' + textForFilter);
    loadCurrencies(textForFilter);
})

let filteredByName = jQuery.map()
