let users = [];

let deleteElement = e => {
    if($(e.target).hasClass('remove-btn')) {
        let itemToRemoveIndex = $(e.target).parents('tr').index();
        users.splice(itemToRemoveIndex, 1);
        renderUsers(users);
    }
};

let renderUsers = users => {
    let htmlStr = ``;
    for(let index in users) {
        htmlStr += `<tr>
            <td>${+index+1}</td>
            <td>${users[index].firstName}</td>
            <td>${users[index].email}</td>
            <td>${users[index].age}</td>
            <td><img src="${users[index].picture}"></td>
            <td><button class="remove-btn">Remove</button></td>
        </tr>`;
    }
    $('#firstName, #email, #age, #picture').val('');
    $('table.users-table tbody').html(htmlStr);
    if($('table.users-table tbody tr').length) {
        $('table.users-table').show();
    } else {
        $('table.users-table').hide();
    }
};

let addUser = e => {
    e.preventDefault();
    console.log('We are starting....');
    let userObject = {
        firstName: $('#firstName').val(),
        email: $('#email').val(),
        age: +$('#age').val(),
        picture: $('#picture').val()
    };
    if(!userObject.firstName || !userObject.email || !userObject.age || !userObject.picture) {
        alert('Заполните все поля');
        return;
    }
    users.push(userObject);
    renderUsers(users);
};

let loadCurrencies = () => {
    $.ajax({
        url: 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json',
        method: 'GET',
        error: (e) => {
            console.log(e);
        },
        success: (data) => {
            console.log(data);
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
            $('table.currencies').show();
        }
    });
};

let shortArray = [
    "IRN",
    "PAK",
    "TKM",
    "UZB",
    "TJK",
    "CHN"
    ];

let createBorderCountriesArray = (countries, ourCountry) => {
    borderCountries = [];
    for (let index in countries) {
        if (countries[index].borders.indexOf(ourCountry) > -1) {
            borderCountries.push(countries[index].name);
        }
    }
    //console.log("borderCountries: " + borderCountries);
    return borderCountries;
}    

let renderCountriesHtml = (countries) => {
    let htmlStr = '';
    for(let country of countries) {
        let currenciesArray = country.currencies.map(currency => currency.name);
        let languagesArray = country.languages.map(language => language.name);        
        let borderCountriesArray = createBorderCountriesArray(countries, country.alpha3Code);
        /*let currenciesArray = country.currencies.map(currency => {
            return currency.name;
        });*/
        /*let currenciesArray = country.currencies.map(function(currency) {
            return currency.name;
        });*/
        htmlStr += `<tr>
            <td>${country.name}</td>
            <td>${country.capital}</td>
            <td>${country.region}</td>
            <td>${country.population}</td>
            <td>${country.area}</td>
            <td>${currenciesArray.join(', ')}</td>
            <td>${languagesArray.join(', ')}</td>
            <td>${borderCountriesArray.join(', ')}</td>
            <td><img height="50" src="${country.flag}"></td>
        </tr>`;
    }
    $('table.countries tbody').html(htmlStr);
};

let loadCountries = e => {
    $.ajax({
        method: 'GET',
        url: 'https://restcountries.eu/rest/v2/all',
        success: (response) => {
            renderCountriesHtml(response);
            createBorderCountriesArray(response);
        }
    })
}

$('table.users-table').hide();
$('table.currencies').hide();

$('table.users-table tbody').on('click', deleteElement);

$('#submitBtn').on('click', addUser);

$('.load-currencies').click(loadCurrencies);

$('.load-countries').click(loadCountries);
