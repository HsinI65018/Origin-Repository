import createDivElement from './createDivElement.js'

const main = document.querySelector('main');
const searchForm = document.querySelector('.searchForm');
const word = document.querySelector('.search-input');
const initpage = 0;
const initKeyword = '';
let data;

//Start point
fetchApi(initpage, initKeyword);

//Fetch backend API
function fetchApi(page, keyword){
    fetch(`/api/attractions?page=${page}&keyword=${keyword}`,{
        method: "GET"
    })
    .then((response) => {
        if(response.ok){
            return response.json()
        }
    }).then((jsonData) => {
        data = jsonData['data'];
        render(jsonData['nextPage'], keyword);
    }).catch((e) => {
        const errorDiv = new createDivElement(`查無 '${keyword}' 的結果`,'errorDiv').create();
        main.appendChild(errorDiv);
    })
}

//Loading observator
function observator(page, keyword){
    const lastOne = document.querySelector('.last-child');
    if(lastOne){
        const observer = new IntersectionObserver(entries => {
            if(!entries[0].isIntersecting) return
                
            if(page == 'NULL'){
                observer.unobserve(lastOne);
            }else{
                fetchApi(page, keyword);
                observer.unobserve(lastOne);
                lastOne.removeAttribute('class', 'last-child');
            }
        }, {
            threshold: 1,
        })
        observer.observe(lastOne);
    }
}

function render(page, keyword){
    for(let i = 0; i < data.length; i++){
        const name = data[i]['name'];
        const mrt = data[i]['mrt'];
        const category = data[i]['category'];
        const image = data[i]['images'][0];
        const id = data[i]['id'];

        const divContainer = new createDivElement('','divContainer').create();
        const imgContainer = new createDivElement('','imageContainer').create();
        const info = new createDivElement('','info').create();
        const title = new createDivElement(name, 'title').create();
        const subtitle = new createDivElement('','subtitle').create();
        const subtitleMrt = new createDivElement(mrt,'subtitleMrt').create();
        const subtitleCategory = new createDivElement(category,'subtitleCatrgory').create();
        const img = document.createElement('img');
        const link = document.createElement('a');
        
        img.src = data[i]['images'][0];
        link.href = `/attraction/${id}`;

        imgContainer.appendChild(img);
        subtitle.appendChild(subtitleMrt);
        subtitle.appendChild(subtitleCategory);

        info.appendChild(title);
        info.appendChild(subtitle);

        link.appendChild(imgContainer);
        link.appendChild(info)
        divContainer.appendChild(link);

        if(i === data.length-1){
            divContainer.setAttribute('class', 'last-child')
        }

        main.appendChild(divContainer);
    }
    observator(page, keyword);
}

//search
function search(e){
    e.preventDefault();
    main.innerHTML = '';
    fetchApi(initpage, word.value);
    word.value = '';
}
searchForm.addEventListener('submit',search);