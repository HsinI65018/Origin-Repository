import DivElement from './divElement.js'
import removeLoadingStatus from './loading.js'
let orderInfo;

const fetchOrderInfo = async () => {
    const queryString = window.location.search;
    const [queryStringName, orderNumber] = queryString.split('=');
    const response = await fetch(`/api/orders/${orderNumber}`);
    const data = await response.json();
    orderInfo = data['data'];
    removeLoadingStatus();
    renderAttraction();
    renderOrder();
};
fetchOrderInfo();

const renderAttraction = () => {
    const imageContainer = document.querySelector('.img-container');
    const titleContainer = document.querySelector('.info-container>div>.title-container');
    const dateContainer = document.querySelector('.date-container');
    const timeContainer = document.querySelector('.time-container');
    const priceContainer = document.querySelector('.price-container');
    const addressContainer = document.querySelector('.address-container');
    const image = document.createElement('img');

    const img = orderInfo['trip']['attraction']['image'];
    const title = orderInfo['trip']['attraction']['name'];
    const address = orderInfo['trip']['attraction']['address'];
    const date = orderInfo['trip']['date'];
    const time = orderInfo['trip']['time'];
    const price =orderInfo['price'];
    
    image.src = img;
    titleContainer.textContent = '台北一日遊：' + title;
    titleContainer.href = `/attraction/${orderInfo['trip']['attraction']['id']}`;
    let timeRange;
    time === 'morning'? timeRange='早上 9 點到下午 2 點': timeRange='下午 2 點到晚上 9 點';

    const dateTitle = new DivElement('日期：', 'info-title').create();
    const timeTitle = new DivElement('時間：', 'info-title').create();
    const priceTitle = new DivElement('費用：', 'info-title').create();
    const addressTitle = new DivElement('地點：', 'info-title').create();

    const dateContent = new DivElement(date, '').create();
    const timeContent = new DivElement(timeRange, '').create();
    const priceContent = new DivElement('新台幣 '+price+' 元', 'price').create();
    const addressContent = new DivElement(address, '').create();

    imageContainer.appendChild(image);

    dateContainer.appendChild(dateTitle);
    dateContainer.appendChild(dateContent);

    timeContainer.appendChild(timeTitle);
    timeContainer.appendChild(timeContent);
    
    priceContainer.appendChild(priceTitle);
    priceContainer.appendChild(priceContent);

    addressContainer.appendChild(addressTitle);
    addressContainer.appendChild(addressContent);
}

const renderOrder = () => {
    const numberContainer = document.querySelector('.number-container');
    const nameContainer = document.querySelector('.name-container');
    const emailContainer = document.querySelector('.email-container');
    const phoneContainer = document.querySelector('.phone-container');

    const number = orderInfo['number'];
    const name = orderInfo['contact']['name'];
    const email = orderInfo['contact']['email'];
    const phone = orderInfo['contact']['phone'];

    const numberTitle = new DivElement('訂單編號：', 'info-title').create();
    const nameTitle = new DivElement('聯絡姓名：', 'info-title').create();
    const emailTitle = new DivElement('聯絡信箱：', 'info-title').create();
    const phoneTitle = new DivElement('手機號碼：', 'info-title').create();

    const numberContent = new DivElement(number, '').create();
    const nameContent = new DivElement(name, '').create();
    const emailContent = new DivElement(email, '').create();
    const phoneContent = new DivElement(phone, '').create();

    numberContainer.appendChild(numberTitle);
    numberContainer.appendChild(numberContent);

    nameContainer.appendChild(nameTitle);
    nameContainer.appendChild(nameContent);
    
    emailContainer.appendChild(emailTitle);
    emailContainer.appendChild(emailContent);

    phoneContainer.appendChild(phoneTitle);
    phoneContainer.appendChild(phoneContent);
}