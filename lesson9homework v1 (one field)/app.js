let dataObj = {};
let nameField = $('#name');
let capitalField = $('#capital');

let filterCountries = (countries) => {
    let inputFilter = $('.filter-countries').val();
    let filteredCountries = [];
    for(let index in countries) {
        if (countries[index]['name'].toLowerCase().includes(inputFilter.toLowerCase()) || countries[index]['capital'].toLowerCase().includes(inputFilter.toLowerCase())) {
            filteredCountries.push(countries[index]);
        }
    }
    return filteredCountries;
};


let renderCountriesHtml = (countries) => {
    let htmlStr = '';

    // делаем словарь имен стран [{ABW: Aruba}, ...]
    let countriesTranslation = {};
    for(let country of countries) {
        countriesTranslation[country['alpha3Code']] = country['name'];
    }

    for(let country of countries) {

        // делаем массив соседей для конкретной страны
        country.borderNames = [];
        for(let border of country.borders) {
            country.borderNames.push(countriesTranslation[border])
        }
        
        let currenciesArray = country.currencies.map(currencyObj => currencyObj.name);

        let languagesArr = country.languages.map(languageObj => languageObj.name);

        htmlStr += `<tr>
            <td>${country.name}</td>
            <td>${country.capital}</td>
            <td>${country.region}</td>
            <td>${country.population}</td>
            <td>${country.area}</td>
            <td>${currenciesArray.join(', ')}</td>
            <td><img height="50" src="${country.flag}"></td>
            <td>${languagesArr.join(', ')}</td>
            <td>${country.borderNames.join(', ')}</td>
        </tr>`;
    }
    $('table.countries tbody').html(htmlStr);
};

let loadCountries = e => {
    $.ajax({
        method: 'GET',
        url: 'https://restcountries.eu/rest/v2/all',
        success: (response) => {
            countries = response;
            dataObj.countries = countries;
            renderCountriesHtml(countries);
            sortTable();
        }
    });
};

let sortTable = e => {
    let savedSort = localStorage.getItem('countries.sort');
    let dataAttr = '';
    let isActive = '';
    let isReversed = '';

    // Если загрузка не в результате клика по заголовку, то:
    // - если есть сохраненная сортировка, загружаем параметры сортировки из хранилища
    // - если нет сохраненной сортировки, рендерим то что получили в запросе
    // Если загрузка в результате клика по заголовку, получаем параметры сортировки из аттрибутов
    // Если для данного заголовка есть возможность сортировки (dataAttr), то сохраняем сортировку в хранилище
    if(!e) {
        if(savedSort) {
            savedSort = JSON.parse(savedSort).data;
            dataAttr = savedSort[0];
            isActive = savedSort[1];
            isReversed = savedSort[2];
        } else {
            //  renderCountriesHtml(countries);
            return;
        }
    } else {
        dataAttr = $(e.currentTarget).attr('data-attr');
        
        isActive = $(e.currentTarget).hasClass('active');
        isReversed = $(e.currentTarget).hasClass('reversed');
    }
    if(dataAttr) {
        localStorage.setItem('countries.sort', JSON.stringify({data: [dataAttr, isActive, isReversed]}));
    }

    // перед работой у всех элементов удаляем классы 'active' и 'reversed', чтобы в дальнейшем их записать уже для нужных заголовков

        $('td.sortable').removeClass('active');
        $('td.sortable').removeClass('reversed');    
        $(`.sortable[data-attr=${dataAttr}]`).addClass('active');



    // сортируем страны по заданному заголовку
    let filteredCountries = filterCountries(countries);
    let sortedCountries = filteredCountries.sort((a, b) => {
        if (a[dataAttr] > b[dataAttr]) {
            return 1;
          }
          if (a[dataAttr] < b[dataAttr]) {
            return -1;
          }
          return 0;
    });
    renderCountriesHtml(sortedCountries);
    dataObj.countries = sortedCountries;

    if(isActive && e) {
        if(!isReversed) {
            $(e.currentTarget).addClass('reversed');
            renderCountriesHtml(sortedCountries.reverse());
            sortedCountries.reverse(); // нужно чтобы вернуть исходный порядок
        } else { //if(dataAttr && isReversed) 
            $(`.sortable[data-attr=${dataAttr}]`).removeClass('reversed');
            renderCountriesHtml(sortedCountries);
        }
    }
};
$('.sortable').click(sortTable)

let filterOnInput = (e) => {
    let inputFilter = '';
    if($(e.currentTarget).hasClass('filter-countries')){
        inputFilter = $('.filter-countries').val().trim();
    }
    let dataToRender = dataObj.countries.filter(el => {
        return (
            el.name.toLowerCase().indexOf(inputFilter.toLowerCase()) > -1
            ||
            el.capital.toLowerCase().indexOf(inputFilter.toLowerCase()) > -1 
        )
    });
    sortTable(dataToRender);
};

$('.filter-countries').on('keyup', filterOnInput);

loadCountries();