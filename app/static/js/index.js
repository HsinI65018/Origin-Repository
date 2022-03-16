const main = document.querySelector('main');
const errorDiv = document.createElement('div');
const searchForm = document.querySelector('.searchForm');
const word = document.querySelector('input');
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
        init(jsonData['nextPage'], keyword)
    }).catch((e) => {
        errorDiv.textContent = `查無 '${keyword}' 的結果`;
        errorDiv.setAttribute('class', 'errorDiv');
        main.appendChild(errorDiv);
    })
}

//Create empty element
function createElement(){
    const divContainer = document.createElement('div');
    const imgContainer = document.createElement('div');
    const img = document.createElement('img');
    const info = document.createElement('div');
    const title = document.createElement('div');
    const subtitle = document.createElement('div');
    const subtitleMrt = document.createElement('div');
    const subtitleCategory = document.createElement('div');
    const link = document.createElement('a');

    return {"divContainer":divContainer,"imgContainer":imgContainer,"img":img,"info":info,"title":title,"subtitle":subtitle,"subtitleMrt":subtitleMrt,"subtitleCategory":subtitleCategory,"link":link}
}

//Append data in empty element
function appendElement(element, name, mrt, category, image, id, index){
    element["img"].src = image;
    element["title"].textContent = name;
    element["subtitleMrt"].textContent = mrt;
    element["subtitleCategory"].textContent = category;
    element["link"].href = `/attraction/${id}`;
    
    element["imgContainer"].appendChild(element["img"]);
    element["subtitle"].appendChild(element["subtitleMrt"]);
    element["subtitle"].appendChild(element["subtitleCategory"]);
    element["title"].setAttribute('class', 'title');
    element["subtitle"].setAttribute('class', 'subtitle');
    element["imgContainer"].setAttribute('class', 'imageContainer');
    
    element["info"].appendChild(element["title"]);
    element["info"].appendChild(element["subtitle"]);
    element["info"].setAttribute('class', 'info');

    element["link"].appendChild(element["imgContainer"]);
    element["link"].appendChild(element["info"])
    element["divContainer"].appendChild(element["link"]);

    if(index === data.length-1){
        element["divContainer"].setAttribute('class', 'last-child');
    }
    
    return element["divContainer"]
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

function init(page, keyword){
    for(let i = 0; i < data.length; i++){
        const element = createElement();

        const name = data[i]['name'];
        const mrt = data[i]['mrt'];
        const category = data[i]['category'];
        const image = data[i]['images'][0];
        const id = data[i]['id'];
        
        const divContainer = appendElement(element, name, mrt, category, image, id, index=i)
        
        main.appendChild(divContainer);
    }
    observator(page, keyword);
}

//Remove init data
function removeData(){
    const divs = document.querySelectorAll('main > div');
    divs.forEach((div) => {
        div.remove();
    })
}
//search
function search(e){
    e.preventDefault();
    removeData()
    fetchApi(initpage, word.value);
    word.value = '';
}
searchForm.addEventListener('submit',search);