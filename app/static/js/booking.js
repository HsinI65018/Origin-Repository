import DivElement from './divElement.js'
let attractionData;

const fetchBookingInfo = async() => {
    const response = await fetch('/api/booking');
    const data = await response.json();
    attractionData = data['data'];
    attractionData === 'null'? defaultRender():attractionRender();
}
fetchBookingInfo();

const defaultRender = () => {
    const main = document.querySelector('main');
    const hr = document.querySelector('.hr');
    const bookingInfo = document.querySelector('.booking-info');
    const noBooking = document.querySelector('.no-booking');
    const footer = document.querySelector('footer');
    main.setAttribute('class', 'hide');
    hr.setAttribute('class', 'hide');
    bookingInfo.setAttribute('class', 'hide');
    noBooking.classList.remove('hide');
    footer.setAttribute('class', 'pop-up');
}
const attractionRender = () => {
    const imageContainer = document.querySelector('.img-container');
    const titleContainer = document.querySelector('.info-container>div>.title-container');
    const dateContainer = document.querySelector('.date-container');
    const timeContainer = document.querySelector('.time-container');
    const priceContainer = document.querySelector('.price-container');
    const addressContainer = document.querySelector('.address-container');
    const image = document.createElement('img');

    const img = attractionData['attraction']['image'];
    const title = attractionData['attraction']['name'];
    const address = attractionData['attraction']['address'];
    const date = attractionData['date'];
    const time = attractionData['time'];
    const price = attractionData['price'];
    
    image.src = img;
    titleContainer.textContent = '台北一日遊：' + title;
    titleContainer.href = `/attraction/${attractionData['attraction']['id']}`;
    let timeRange;
    time === 'morning'? timeRange='早上 9 點到下午 2 點': timeRange='下午 2 點到晚上 9 點';

    const dateTitle = new DivElement('日期：', 'info-title').create();
    const timeTitle = new DivElement('時間：', 'info-title').create();
    const priceTitle = new DivElement('費用：', 'info-title').create();
    const addressTitle = new DivElement('地點：', 'info-title').create();

    const dateContent = new DivElement(date, '').create();
    const timeContent = new DivElement(timeRange, '').create();
    const priceContent = new DivElement('新台幣 '+price+' 元', '').create();
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

const deleteBtn = document.querySelector('.delete-icon');
const deleteBooking = async () => {
    const response = await fetch('/api/booking', {method: "DELETE"});
    const data = await response.json();
    window.location = '/booking';
}
deleteBtn.addEventListener('click', deleteBooking)