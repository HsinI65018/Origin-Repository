const main = document.querySelector('main');
const errorDiv = document.createElement('div');
const initpage = 0;
const initKeyword = '';

fetchApi(initpage, initKeyword);

function fetchApi(page, keyword){
    fetch(`/api/attractions?page=${page}&keyword=${keyword}`,{
        method: "GET"
    })
    .then((response) => {
        if(response.ok){
            return response.json()
        }
    }).then((data) => {
        init(data['data'], data['nextPage'], keyword)
    }).catch((e) => {
        errorDiv.textContent = `查無 '${keyword}' 的結果`;
        errorDiv.setAttribute('class', 'errorDiv');
        main.appendChild(errorDiv);
    })
}

function init(data, page, keyword){
    for(let i = 0; i < data.length; i++){
        const divContainer = document.createElement('div');
        const imgContainer = document.createElement('div');
        const img = document.createElement('img');
        const info = document.createElement('div');
        const title = document.createElement('div');
        const subtitle = document.createElement('div');
        const subtitleMrt = document.createElement('div');
        const subtitleCategory = document.createElement('div');
        const link = document.createElement('a');

        const name = data[i]['name'];
        const mrt = data[i]['mrt'];
        const category = data[i]['category'];
        const image = data[i]['images'][0];
        const id = data[i]['id'];
        
        img.src = image;
        title.textContent = name;
        subtitleMrt.textContent = mrt;
        subtitleCategory.textContent = category;
        link.href = `/attraction/${id}`;

        imgContainer.appendChild(img);
        subtitle.appendChild(subtitleMrt);
        subtitle.appendChild(subtitleCategory);
        title.setAttribute('class', 'title');
        subtitle.setAttribute('class', 'subtitle');
        imgContainer.setAttribute('class', 'imageContainer');

        info.appendChild(title);
        info.appendChild(subtitle);
        info.setAttribute('class', 'info');

        link.appendChild(imgContainer);
        link.appendChild(info)
        divContainer.appendChild(link);
        if(i === data.length-1){
            divContainer.setAttribute('class', 'last-child')
        }

        main.appendChild(divContainer);
    }
    
    const lastOne = document.querySelector('.last-child');
    if(lastOne){
        const observer = new IntersectionObserver(entries => {
            if(!entries[0].isIntersecting) return
                
            if(page == 'NULL'){
                observer.unobserve(lastOne);
            }else{
                fetchApi(page, keyword)
                observer.unobserve(lastOne);
                lastOne.removeAttribute('class', 'last-child');
            }
        }, {
            threshold: 1,
        })
        observer.observe(lastOne);
    }
}

//search
const searchForm = document.querySelector('.searchForm');
const word = document.querySelector('input');

function search(e){
    const divs = document.querySelectorAll('main > div');

    e.preventDefault();
    divs.forEach((div) => {
        div.remove();
    })
    fetchApi(initpage, word.value);
    word.value = '';
}
searchForm.addEventListener('submit',search);