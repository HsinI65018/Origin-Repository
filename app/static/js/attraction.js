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
        init()
    }).catch((e) => {
        console.log(e);
    })
}

//Create empty element
function createElement(){
    const descContainer = document.createElement('div');
    const addressContainer = document.createElement('div');
    const transportContainer = document.createElement('div');
    const addressTitle = document.createElement('div');
    const transportTitle = document.createElement('div');
    const addressContent = document.createElement('div');
    const transportContent = document.createElement('div');

    return {"descContainer":descContainer, "addressContainer":addressContainer, "transportContainer":transportContainer, "addressTitle":addressTitle, "transportTitle":transportTitle, "addressContent":addressContent, "transportContent":transportContent}
}

//Append data in empty element
function appendElement(element, title, subtitle, desc, address, transport){
    titleContainer.textContent = title;
    subtitleContainer.textContent = subtitle;

    element["descContainer"].textContent = desc;
    element["descContainer"].setAttribute('class', 'desc-container');

    element["addressTitle"].textContent = '景點地址：';
    element["addressContent"].textContent = address;
    element["addressContainer"].appendChild(element["addressTitle"]);
    element["addressContainer"].appendChild(element["addressContent"]);
    element["addressContainer"].setAttribute('class', 'address-container');

    element["transportTitle"].textContent = '交通方式：';
    element["transportContent"].textContent = transport;
    element["transportContainer"].appendChild(element["transportTitle"]);
    element["transportContainer"].appendChild(element["transportContent"]);
    element["transportContainer"].setAttribute('class', 'transport-container');

    return {"descContainer":element["descContainer"], "addressContainer":element["addressContainer"], "transportContainer":element["transportContainer"]}
}

//separate images process
function initImage(){
    const images = data['images'];
    for(let i = 0; i < images.length; i++){
        const img = document.createElement('img');
        const spot = document.createElement('div');
        const innerSpot = document.createElement('div');

        img.src = images[i];
        img.setAttribute('id', i)
        spot.setAttribute('class', 'spot');

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

function init(){
    const element = createElement();

    const title = data['name'];
    const subtitle = data['category'] + ' at ' + data['mrt'];
    const desc = data['description'];
    const address = data['address'];
    const transport = data['transport'];

    const container = appendElement(element, title, subtitle, desc, address, transport);

    main.appendChild(container["descContainer"]);
    main.appendChild(container["addressContainer"]);
    main.appendChild(container["transportContainer"]);

    initImage();
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
        prevImage(showImg, rightImg, totalPage)
    }else if(target === 'right'){
        nextImage(showImg, rightImg, totalPage)
    }
}
rightBtn.addEventListener('click', changeImage);
leftBtn.addEventListener('click', changeImage);


//ticket controller
const amBtn = document.querySelector('#am');
const pmBtn = document.querySelector('#pm');

function changeAttribute(click, unClick, ticketPrice){
    const price = document.querySelector('#price');
    click.setAttribute('class', 'inner-radio-btn');
    unClick.removeAttribute('class', 'inner-radio-btn');
    price.textContent = `新台幣 ${ticketPrice} 元`;
}

function changePrice(e){
    const target = e.target.id;
    const amInnerBtn = document.querySelector('#am>div');
    const pmInnerBtn = document.querySelector('#pm>div');
    
    if(target === 'am'){
        changeAttribute(amInnerBtn, pmInnerBtn, price=2000)
    }else if(target === 'pm'){
        changeAttribute(pmInnerBtn, amInnerBtn, price=2500)
    }
}
amBtn.addEventListener('click', changePrice);
pmBtn.addEventListener('click', changePrice);