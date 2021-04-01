class ColumnHeader{
    constructor(name){
        this.name = name;
        this.columnElements = [];
    }

    addContent(element){
        if(this.columnElements.indexOf(element) === -1){
            this.columnElements.push(element)
        } 
    }

}

export default ColumnHeader