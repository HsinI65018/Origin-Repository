import createDivElement from './createDivElement.js'

const main = document.querySelector('main');
const imageContainer = document.querySelector('.img-container');
const spotContainer = document.querySelector('.spot-container');
const titleContainer = document.querySelector('.profile>.title');
const subtitleContainer = document.querySelector('.profile>.subtitle');
const innerImgContainer = document.querySelector('.inner-img-container');
const [path, id] = window.location.pathname.split('/attraction/');
let data;

//Start point
fetchAPI(id)

//Fetch backend API
function fetchAPI(id){
    fetch(`/api/attraction/${id}`)
    .then((response) => {
        if(response.ok){
            return response.json()
        }
    }).then((jsonData) => {
        data = jsonData['data'];
        render();
    }).catch((e) => {
        console.log(e);
    })
}

//separate images process
function renderImage(){
    const images = data['images'];
    for(let i = 0; i < images.length; i++){
        const img = document.createElement('img');
        const spot = new createDivElement('','spot').create();
        const innerSpot = new createDivElement().create();

        img.src = images[i];
        img.setAttribute('id', i);

        if(i === 0){
            img.setAttribute('class', 'show');
            innerSpot.setAttribute('class', 'inner-spot');
        }else if(i === images.length - 1){
            img.setAttribute('class', 'right');
        }else{
            img.setAttribute('class', 'left');
        }
        
        innerImgContainer.append(img);
        imageContainer.append(innerImgContainer);

        spot.appendChild(innerSpot);
        innerSpot.setAttribute('id', `spot_${i}`);
        spotContainer.appendChild(spot);
    }
}

function render(){
    const desc = data['description'];
    const address = data['address'];
    const transport = data['transport'];

    const descContainer = new createDivElement(desc, 'desc').create();
    const addressContainer = new createDivElement('','address-container').create();
    const transportContainer = new createDivElement('','transport-container').create();
    const addressTitle = new createDivElement('景點地址：','addressTitle').create();
    const transportTitle = new createDivElement('交通方式：','transportTitle').create();
    const addressContent = new createDivElement(address, 'addressContent').create();
    const transportContent = new createDivElement(transport,'transportContent').create();

    titleContainer.textContent = data['name'];
    subtitleContainer.textContent = data['category'] + ' at ' + data['mrt'];

    addressContainer.appendChild(addressTitle);
    addressContainer.appendChild(addressContent);

    transportContainer.appendChild(transportTitle);
    transportContainer.appendChild(transportContent);

    main.appendChild(descContainer);
    main.appendChild(addressContainer);
    main.appendChild(transportContainer);

    renderImage();
}

//carousel controller
const leftBtn = document.querySelector('.arrow-container').children[0];
const rightBtn = document.querySelector('.arrow-container').children[1];

function changeSpot(showSpot, removeSpot){
    showSpot.setAttribute('class', 'inner-spot');
    removeSpot.removeAttribute('class', 'inner-spot');
}

function prevImage(showImg, rightImg, totalPage){
    let index ,leftImg, showSpot, removeSpot;

    index = parseInt(rightImg.id)-1;
    if(index < 0) {index = totalPage - 1}

    leftImg = document.getElementById(`${index}`);

    showImg.setAttribute('class', 'left');
    leftImg.setAttribute('class', 'right');
    rightImg.setAttribute('class', 'show');

    showSpot = document.getElementById(`spot_${rightImg.id}`);
    removeSpot = document.getElementById(`spot_${showImg.id}`);
    changeSpot(showSpot, removeSpot)
}

function nextImage(showImg, rightImg, totalPage){
    let index ,leftImg, showSpot, removeSpot;

    index = parseInt(showImg.id)+1;
    if(index >= totalPage) index = 0;

    leftImg = document.getElementById(`${index}`);

    if(totalPage === 2){
        showImg.setAttribute('class', 'right');
        leftImg.setAttribute('class', 'show');
    }else{
        showImg.setAttribute('class', 'right');
        leftImg.setAttribute('class', 'show');
        rightImg.setAttribute('class', 'left');
    }

    showSpot = document.getElementById(`spot_${index}`);
    removeSpot = document.getElementById(`spot_${showImg.id}`);
    changeSpot(showSpot, removeSpot)
}

function changeImage(e){
    const target = e.target.id;
    const showImg = document.querySelector('.show');
    const rightImg = document.querySelector('.right');
    const totalPage = document.querySelector('.spot-container').children.length;

    if(target === 'left'){
        prevImage(showImg, rightImg, totalPage);
    }else if(target === 'right'){
        nextImage(showImg, rightImg, totalPage);
    }
}
rightBtn.addEventListener('click', changeImage);
leftBtn.addEventListener('click', changeImage);


//ticket controller
const amBtn = document.querySelector('#am');
const pmBtn = document.querySelector('#pm');

function changeAttribute(click, unClick, ticketPrice){
    const priceTag = document.querySelector('#price');
    click.setAttribute('class', 'inner-radio-btn');
    unClick.removeAttribute('class', 'inner-radio-btn');
    priceTag.textContent = `新台幣 ${ticketPrice} 元`;
}

function changePrice(e){
    const target = e.target.id;
    const amInnerBtn = document.querySelector('#am>div');
    const pmInnerBtn = document.querySelector('#pm>div');
    
    if(target === 'am'){
        changeAttribute(amInnerBtn, pmInnerBtn, 2000);
    }else if(target === 'pm'){
        changeAttribute(pmInnerBtn, amInnerBtn, 2500);
    }
}
amBtn.addEventListener('click', changePrice);
pmBtn.addEventListener('click', changePrice);