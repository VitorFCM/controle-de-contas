import ColumnHeader from './ColumnHeader'

class CsvParser{
    constructor(filePath, fileContent){
        this.filePath = filePath
        this.fileContent = fileContent
        

        this.headers = [];
        this.accounts = [];
        
    }

    toArray(){
        let rows = this.fileContent.split('\n');
        

        for (var i = 1; i < rows.length; i++) {
            var columns = []
            columns = rows[i].split(',')
            
            this.accounts.push(columns) 
        }
        
        //this.headers = rows[0].split(',')
        let headers = rows[0].split(',')
        for(var i = 0; i < headers.length; i++){
            let header = new ColumnHeader(headers[i]);

            this.accounts.forEach((row)=>{
                header.addContent(row[i]);
            });
            
            this.headers.push(header);
        }
    }

    newLine(newLine){
        this.accounts.push(newLine)
        if(newLine.length === this.headers.length){
            this.fileContent += '\n';
            for (var i = 0; i < newLine.length; i++) {
                this.fileContent += newLine[i]
                
                if(i < newLine.length - 1){
                    this.fileContent += ','
                } 
            }
            
            console.log("New file content " + this.fileContent);
        }
        
    }
}

export default CsvParser