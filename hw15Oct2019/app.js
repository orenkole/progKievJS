let generatedID = 1;

class Product {
    constructor(name, price, brand, imgSrc) {
        this.name = name;
        this._price = price;
        this.brand = brand;
        this.imgSrc = imgSrc;
    }
    set price(newPrice) {
        if(typeof newPrice === 'number' && newPrice > 0) {
            this._price = newPrice;
        }
    }
    get price() {
        return this._price;
    }
    static generateId() {
        generatedID = generatedID + 1;
        this.prodID = generatedID;
        return generatedID;
    }
    log() {
        console.log(`product ${this.name} (${this.id}): ${this.price}`);
    }
    showPrice() {
        console.log(this.price);
    }
}
 
 
class User {
    constructor(name, email, age) {
        this.name = name;
        this.email = email;
        this.age = age;
        this.cart = [];
    }
    addCart(product) {
        this.cart.push(product);
    }
    showCart() {
        console.table(this.cart);
    }
}
 
class Admin extends User {
    constructor(name, email, age, isAdmin) {
        super(name, email, age);
        this.isAdmin = isAdmin;
    }
    checkUser() {
        return this.isAdmin;
    }
}

let products = [];
let cart = [];

let addProduct = e => {
    e.preventDefault();
    let newProduct = new Product($('#name').val(), $('#price').val(), $('#brand').val(), $('#img-source').val());
    if(!newProduct.name || !newProduct.price || !newProduct.brand || !newProduct.imgSrc) {
        alert('Заполните все поля');
        return;
    }
    products.push(newProduct);
    renderProducts(products);
};

let renderProducts = products => {
    let htmlStr = ``;
    for(let index in products) {
        htmlStr += `<tr>
            <td>${+index+1}</td>
            <td>${products[index].name}</td>
            <td>${products[index].price}</td>
            <td>${products[index].brand}</td>
            <td><img src="${products[index].imgSrc}"></td>
            <td><button class="add-to-cart" id="${products[index].prodID}">Remove</button></td>
        </tr>`;
    }
    // $('#firstName, #email, #age, #picture').val('');
    $('table.products-table').html(htmlStr);
    if($('table.products-table tbody tr').length) {
        $('table.products-table').show();
    } else {
        $('table.products-table').hide();
    }
};

let renderCart = products => {
    let htmlStr = ``;
    for(let index in products) {
        htmlStr += `<tr>
            <td>${+index+1}</td>
            <td>${products[index].name}</td>
            <td>${products[index].price}</td>
            <td>${products[index].brand}</td>
            <td><img src="${products[index].imgSrc}"></td>
            <td><button class="add-to-cart" id="${products[index].prodID}">Remove</button></td>
        </tr>`;
    }
    // $('#firstName, #email, #age, #picture').val('');
    $('table.cart-table').html(htmlStr);
    // if($('table.cart-table tbody tr').length) {
    //     $('table.cart-table').show();
    // } else {
    //     $('table.cart-table').hide();
    // }
};

let addToCart = e => {
    e.preventDefault();
    if($(e.target).hasClass('add-to-cart')) {
        let selectedProductID = $(e.target).attr('id');
        let selectedProduct = products.filter(product => {
            return product.prodID === selectedProductID;
        })
        products.push(selectedProduct);
        renderCart(cart);
    }

};



$('.add-to-cart').on('click', addToCart);

$('.add-product').on('click', addProduct);