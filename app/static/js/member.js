import DivElement from './divElement.js'
import removeLoadingStatus from './loading.js'
let orderlist;
let nextPage;
let page = 0;

const fetchOrder = async () => {
    const response = await fetch(`/api/orders?page=${page}`, {
        method : "GET"
    });
    const data = await response.json();
    orderlist = data['data'];
    nextPage = data['nextPage'];
    removeLoadingStatus();
    renderOrder();
}

fetchOrder();

const renderOrder = () => {
    // console.log(orderlist);
    const orderListContainer = document.querySelector('.order-container');
    for(let i = 0; i < orderlist.length; i++){
        const link = document.createElement('a');
        const order = new DivElement('', 'order').create();
        const number = new DivElement(orderlist[i]['orderId'], 'number').create();
        const name = new DivElement(orderlist[i]['attraction'], 'name').create();
        const price = new DivElement(orderlist[i]['price'], 'price').create();

        link.href = `/thankyou?number=${orderlist[i]['orderId']}`
        link.appendChild(number);
        link.appendChild(name);
        link.appendChild(price);

        order.appendChild(link)
        orderListContainer.appendChild(order);
    }
}

const nextBtn = document.querySelector('.icon-container').children[1];
const prevBtn = document.querySelector('.icon-container').children[0];
const changeOrderPage = (e) => {
    // console.log(e.target);
    const orderContainer = document.querySelector('.order-container');
    orderContainer.innerHTML = '';
    e.target.className === 'next'? page ++: page --;
    page < 0? page = 0:'';
    nextPage === 'NULL'? page --: '';
    fetchOrder();
}
nextBtn.addEventListener('click', changeOrderPage)
prevBtn.addEventListener('click', changeOrderPage)