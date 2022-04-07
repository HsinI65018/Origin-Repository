import DivElement from './divElement.js'
import removeLoadingStatus from './loading.js'
let orderlist;
let nextPage;
let page = 0;

const noOrder = document.querySelector('.order-list-container>.no-order');
const fetchOrder = async () => {
    const response = await fetch(`/api/orders?page=${page}`, {
        method : "GET"
    });
    const data = await response.json();
    if(data['error']){
        removeLoadingStatus();
        noOrder.classList.remove('hide');
        nextBtn.classList.add('hide');
        prevBtn.classList.add('hide');
    }else{
        orderlist = data['data'];
        nextPage = data['nextPage'];
        removeLoadingStatus();
        renderOrder();
    }
}

fetchOrder();

const renderOrder = () => {
    const orderListContainer = document.querySelector('.order-container');
    if(orderlist){
        for(let i = 0; i < orderlist.length; i++){
            const link = document.createElement('a');
            const order = new DivElement('', 'order').create();
            const number = new DivElement(orderlist[i]['orderId'], 'number').create();
            const name = new DivElement(orderlist[i]['name'], 'name').create();
            const price = new DivElement(orderlist[i]['price'], 'price').create();
    
            link.href = `/thankyou?number=${orderlist[i]['orderId']}`
            link.appendChild(number);
            link.appendChild(name);
            link.appendChild(price);
    
            order.appendChild(link)
            orderListContainer.appendChild(order);
        }
    }
}

const nextBtn = document.querySelector('.icon-container').children[1];
const prevBtn = document.querySelector('.icon-container').children[0];
const changeOrderPage = (e) => {
    // console.log(e.target);
    const orderContainer = document.querySelector('.order-container');
    orderContainer.innerHTML = '';
    e.target.className === 'next'? page ++: page --;
    page<0? page=0: '';
    nextPage === 'NULL' && page !== 0? page--:'';
    fetchOrder();
}
nextBtn.addEventListener('click', changeOrderPage)
prevBtn.addEventListener('click', changeOrderPage)

const editIcon = document.querySelector('.edit-icon');
const saveIcon = document.querySelector('.save-icon');
const editField = document.querySelector('.edit-field');
const saveField = document.querySelector('.save-field');

const showEditField = () => {
    editField.classList.remove('hide');
    saveField.classList.add('hide')

    saveIcon.classList.remove('hide');
    editIcon.classList.add('hide');
}
editIcon.addEventListener('click', showEditField)

const editForm = document.querySelector('.edit-field>form');
const editPassword = async (e) => {
    e.preventDefault();
    const newPassword = document.querySelector('.new-password').value;
    const response = await fetch('/api/user', {
        method : "PUT",
        body : JSON.stringify({"password": newPassword}),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await response.json();
    console.log(data)
    if(data['ok'] === true){
        editField.classList.add('hide');
        saveField.classList.remove('hide')

        saveIcon.classList.add('hide');
        editIcon.classList.remove('hide');
    }
}
editForm.addEventListener('submit', editPassword)