class DivElement{
    constructor(context, className){
        this.context = context;
        this.className = className;
    }
    create(){
        let div = document.createElement('div');
        div.textContent = this.context;
        div.setAttribute('class', `${this.className}`)
        return div
    }
}

export default DivElement;