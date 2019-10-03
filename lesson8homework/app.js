// create array for currencies
let currencies = [];
let savedCurrenciesStr = '';

// set name for date input field and text in name field
let dateField = $('input[type=date]');
let textInNameField = $('input[type=text]');

// today date
let todayDate = new Date().toISOString().split('T')[0].split('-').join('');
console.log('todaydate ' + todayDate);

// date from local Storage
let lsDate = localStorage.getItem('date');
console.log('lsdate ' + lsDate);

// set date for setting in date field
let dateToLoad = lsDate ? lsDate : todayDate;

// save date to local storage
let saveDate = () => {
    console.log('field: ' + dateField.val());
    localStorage.setItem('date', dateField.val().split('-').join(''));
    let gettedDate = localStorage.getItem('date');
    console.log('gettedDate ' + gettedDate);
};

// let saveCurrencies = (data) => {
//     let savedCurrencies = JSON.j
// };

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
            // console.log('saved data ' + data.JSON.stringify());

            renderSavedCurrencies(data, textForFilter);
            localStorage.setItem('alreadyLoaded', 'yes');

            // renderCurrenciesHtml(data, textForFilter);
            saveDate();
        }
    });
};


let renderSavedCurrencies = (data, textForFilter) => {
    // console.log('data in rsc ' + data);
    // textForFilter = 'но';
    let arrayOfCountries = [];
    let j = 0;
    for(let index in data) {
        // console.log(item);
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

// set date when the window loads
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
