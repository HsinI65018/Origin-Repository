const header = document.querySelector('header');
const main = document.querySelector('main');
const footer = document.querySelector('footer');

const removeLoadingStatus = () => {
    header.removeAttribute('class', 'hide');
    main.removeAttribute('class', 'hide');
    footer.removeAttribute('class', 'hide');
}

export default removeLoadingStatus;