let currencies = [];
let dateField = $('input[type=date]');

let todayDate = new Date().toISOString().split('T')[0];
let lsDate = localStorage.getItem('date');

function setDate(dateToLoad) {
    console.log('dateToLoad ' + dateToLoad);
    setDateToLoad = dateToLoad.substring(0, 4) + '-' + dateToLoad.substring(6) + '-' + dateToLoad.substring(6);
    dateField.val(setDateToLoad);
}

let dateToLoad = lsDate ? lsDate : todayDate;
window.onload = setDate(dateToLoad);

let saveDate = () => {
    //console.log('field: ' + dateField.val());
    localStorage.setItem('date', dateField.val().split('-').join(''));
    //
    let gettedDate = localStorage.getItem('date');
    //console.log('gettedDate ' + gettedDate);
};

let loadCurrencies = e => {
    
    let userDate = dateField.val();
    let okDate = userDate.split('-').join('');
    //console.log('okDate ' + okDate);
    let jsonAddress = `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=${okDate}&json`;
    //console.log(jsonAddress);

    $.ajax({
        url: `${jsonAddress}`,
        method: 'GET',
        error: (e) => {
            console.log(e);
        },
        success: (data) => {
            console.log(data);
            renderCurrenciesHtml(data);
            saveDate();
        }
    });
};

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

$('.load-currencies').click(loadCurrencies);