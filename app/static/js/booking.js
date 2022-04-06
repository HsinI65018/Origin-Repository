import DivElement from './divElement.js'
import removeLoadingStatus from './loading.js'
let attractionData;

const fetchBookingInfo = async() => {
    const response = await fetch('/api/booking');
    const data = await response.json();
    attractionData = data['data'];
    removeLoadingStatus();
    attractionData === 'null'? defaultRender():attractionRender();
}
fetchBookingInfo();

const defaultRender = () => {
    const main = document.querySelector('main');
    const hr = document.querySelector('.hr');
    const bookingInfo = document.querySelector('.booking-info');
    // const noBooking = document.querySelector('.no-booking');
    const footer = document.querySelector('footer');
    
    bookingInfo? bookingInfo.remove():'';
    main.classList.add('hide');
    hr.classList.add('hide');
    // noBooking.classList.remove('hide');
    footer.classList.add('pop-up');
}
const attractionRender = () => {
    const imageContainer = document.querySelector('.img-container');
    const titleContainer = document.querySelector('.info-container>div>.title-container');
    const dateContainer = document.querySelector('.date-container');
    const timeContainer = document.querySelector('.time-container');
    const priceContainer = document.querySelector('.price-container');
    const addressContainer = document.querySelector('.address-container');
    const totalPrice = document.querySelector('.totalPrice');
    const image = document.createElement('img');
    const noBooking = document.querySelector('.no-booking');
    noBooking.classList.add('hide');
    

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
    totalPrice.textContent = `總價：新台幣 ${price} 元`

    const dateTitle = new DivElement('日期：', 'info-title').create();
    const timeTitle = new DivElement('時間：', 'info-title').create();
    const priceTitle = new DivElement('費用：', 'info-title').create();
    const addressTitle = new DivElement('地點：', 'info-title').create();

    const dateContent = new DivElement(date, 'date').create();
    const timeContent = new DivElement(timeRange, 'time').create();
    const priceContent = new DivElement('新台幣 '+price+' 元', 'price').create();
    const addressContent = new DivElement(address, 'address').create();

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
deleteBtn.addEventListener('click', deleteBooking);


const paymentForm = document.querySelector('main>form');
const handleSubmit = (e) => {
    e.preventDefault();

    // 取得 TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus();

    // 確認是否可以 getPrime
    if (tappayStatus.canGetPrime === false) {
        console.log('can not get prime');
        return
    }

    // Get prime
    TPDirect.card.getPrime((result) => {
        console.log(result)
        if (result.status !== 0) {
            console.log('get prime error ' + result.msg);
            return
        }
        console.log('get prime 成功，prime: ' + result.card.prime);
        const contactName = document.querySelector('.contact-name').value;
        const contactEmail = document.querySelector('.contact-email').value;
        const contactPhone = document.querySelector('.contact-phone').value;
        let requestBody = {
            "prime": result.card.prime,
            "order":{
                "price": attractionData['price'],
                "trip": {
                    "attraction": {
                        "id": attractionData['attraction']['id'],
                        "name": attractionData['attraction']['name'],
                        "address": attractionData['attraction']['address'],
                        "image": attractionData['attraction']['image']
                    },
                    "date": attractionData['date'],
                    "time": attractionData['time']
                },
                "contact": {
                    "name": contactName,
                    "email": contactEmail,
                    "phone": contactPhone
                }
            }
        }
        fetch('/api/orders', {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data);
            let orderNumber = data['data']['number'];
            window.location = `/thankyou?number=${orderNumber}`;
        })
    })
}
paymentForm.addEventListener('submit', handleSubmit);