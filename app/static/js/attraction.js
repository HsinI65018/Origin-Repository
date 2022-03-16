const main = document.querySelector('main');
const imageContainer = document.querySelector('.img-container');
const spotContainer = document.querySelector('.spot-container');
const titleContainer = document.querySelector('.profile>.title');
const subtitleContainer = document.querySelector('.profile>.subtitle');
const descContainer = document.createElement('div');
const addressContainer = document.createElement('div');
const transportContainer = document.createElement('div');
const addressTitle = document.createElement('div');
const transportTitle = document.createElement('div');
const addressContent = document.createElement('div');
const transportContent = document.createElement('div');
const innerImgContainer = document.querySelector('.inner-img-container');
const [path, id] = window.location.pathname.split('/attraction/');

fetch(`/api/attraction/${id}`)
.then((response) => {
    if(response.ok){
        return response.json()
    }
}).then((data) => {
    init(data['data']);
}).catch((e) => {
    console.log(e);
})

function init(data){
    const title = data['name'];
    const subtitle = data['category'] + ' at ' + data['mrt'];
    const desc = data['description'];
    const address = data['address'];
    const transport = data['transport'];
    const images = data['images'];

    titleContainer.textContent = title;
    subtitleContainer.textContent = subtitle;
    descContainer.textContent = desc;
    descContainer.setAttribute('class', 'desc-container');

    addressTitle.textContent = '景點地址：';
    addressContent.textContent = address;
    addressContainer.appendChild(addressTitle);
    addressContainer.appendChild(addressContent);
    addressContainer.setAttribute('class', 'address-container');

    transportTitle.textContent = '交通方式：';
    transportContent.textContent = transport;
    transportContainer.appendChild(transportTitle);
    transportContainer.appendChild(transportContent);
    transportContainer.setAttribute('class', 'transport-container');

    main.appendChild(descContainer);
    main.appendChild(addressContainer);
    main.appendChild(transportContainer);

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

//carousel controller
const leftBtn = document.querySelector('.arrow-container').children[0];
const rightBtn = document.querySelector('.arrow-container').children[1];

function changeImage(e){
    const target = e.target.id;
    const showImg = document.querySelector('.show');
    const rightImg = document.querySelector('.right');
    const totalPage = document.querySelector('.spot-container').children.length;
    let index ,leftImg, showSpot, removtSpot;

    if(target === 'left'){
        index = parseInt(rightImg.id)-1;
        if(index < 0) {index = totalPage - 1}

        leftImg = document.getElementById(`${index}`);
        showSpot = document.getElementById(`spot_${rightImg.id}`);
        removtSpot = document.getElementById(`spot_${showImg.id}`);

        showImg.setAttribute('class', 'left');
        leftImg.setAttribute('class', 'right');
        rightImg.setAttribute('class', 'show');
        
    }else if(target === 'right'){
        index = parseInt(showImg.id)+1;
        if(index >= totalPage) index = 0;

        leftImg = document.getElementById(`${index}`);
        showSpot = document.getElementById(`spot_${index}`);
        removtSpot = document.getElementById(`spot_${showImg.id}`);

        showImg.setAttribute('class', 'right');
        leftImg.setAttribute('class', 'show');
        rightImg.setAttribute('class', 'left');
    }
    showSpot.setAttribute('class', 'inner-spot');
    removtSpot.removeAttribute('class', 'inner-spot');
}

rightBtn.addEventListener('click', changeImage);
leftBtn.addEventListener('click', changeImage);

//ticket controller
const amBtn = document.querySelector('#am');
const pmBtn = document.querySelector('#pm');

function changePrice(e){
    const target = e.target.id;
    const amInnerBtn = document.querySelector('#am>div');
    const pmInnerBtn = document.querySelector('#pm>div');
    const price = document.querySelector('#price');
    
    if(target === 'am'){
        amInnerBtn.setAttribute('class', 'inner-radio-btn');
        pmInnerBtn.removeAttribute('class', 'inner-radio-btn');
        price.textContent = '新台幣 2000 元';
    }else if(target === 'pm'){
        pmInnerBtn.setAttribute('class', 'inner-radio-btn');
        amInnerBtn.removeAttribute('class', 'inner-radio-btn');
        price.textContent = '新台幣 2500 元';
    }
}

amBtn.addEventListener('click', changePrice);
pmBtn.addEventListener('click', changePrice);