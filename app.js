let form = document.getElementById('submitForm');
let users = [];
let submitBtn = document.getElementById('submitBtn');

function renderUsers(users) {
    let htmlStr = ``;
    for (let index in users) {
        htmlStr += `
            <tr>
                <td class="idOfUser">${+index+1}</td>
                <td>${users[index].firstName}</td>
                <td>${users[index].email}</td>
                <td>${users[index].age}</td>
                <td>${users[index].picture}</td>
                <td><button class="remove-btn">Remove</button></td>
            </tr>
        `;
    }
    document.getElementById('firstName').value='';
    document.getElementById('email').value='';
    document.getElementById('age').value='';
    document.getElementById('picture').value='';
    document.querySelector('tbody').innerHTML = htmlStr;
}

let deleteElement = e => {
    let userId = $(e.target).parents("tr").children(".idOfUser").innerText;
    console.log(userId);
    users.splice(users, 1);
    console.log(e);
    if($(e.target).hasClass('remove-btn')) {
        $(e.target).parents("tr").remove();
    }    
    renderUsers(users); // Если перерендерить, то нумерация будет без пропусков, и будут нумероваться не user, а строки
};

function addUser (e) {
    e.preventDefault();
    console.log('we are starting...', e);
    let userObject = {
        firstName: document.getElementById('firstName').value,
        email: document.getElementById('email').value,
        age: +document.getElementById('age').value,
        picture: document.getElementById('picture').value
    };
    if(!userObject.firstName || !userObject.email || !userObject.age || !userObject.picture) {
        alert('Fill in all fields, please');
        return;
    }
    users.push(userObject);
    renderUsers(users);
}

submitBtn.addEventListener('click', addUser);

$('table tbody').on('click', deleteElement);

var currencies = [];
$.ajax({
    url: 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json',
    method: 'GET',
    error: (e) => {
        console.log(e);
    },
    success: (data) => {
        $.each(data, function(i, item){
            $('#currencyTable tbody').append(`
                <tr>
                    <td>${item.cc}</td>
                    <td>${item.exchangedate}</td>
                    <td>${item.r030}</td>
                    <td>${item.rate}</td>
                    <td>${item.txt}</td>
                </tr>
            `);
        })
    }
});