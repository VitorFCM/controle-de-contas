import './geral.css';

import React, { useState } from 'react';
import csvParser from 'csv-parser';


const fs = window.require('fs');
const {dialog} = window.require('electron').remote;

class Conta{
    constructor(nome, data){
        this.nome = nome;
        this.data = data;
    }
}

class CsvParser{
    constructor(filePath, fileContent){
        this.filePath = filePath
        this.fileContent = fileContent
        

        this.headers = [];
        this.accounts = [];
        
    }

    toArray(){
        var rows = this.fileContent.split('\n')
        this.headers = rows[0].split(',')

        for (var i = 1; i < rows.length; i++) {
            var columns = []
            columns = rows[i].split(',')
            
            //var newAccount = new Conta(columns[0], columns[1]);
            
            this.accounts.push(columns)
        }

    }

    ffff(){
        console.log()
    }

    newLine(newLine){
        
        if(newLine.length === this.headers.length){
            this.fileContent += '\n';
            for (var i = 0; i < newLine.length; i++) {
                this.fileContent += newLine[i]
                if(i < newLine.length - 1){
                    this.fileContent += ','
                } 
            }
            this.fileContent += '\n';

            console.log("New file content " + this.fileContent);
        }
        
    }


}

function dataInserction(list) {

    let content = []
    for (var i = 0; i < list.headers.length; i++) {
        
        var value = document.getElementById(list.headers[i]).value;
        
        content.push(value);
    }

    list.newLine(content);
    //var nameValue = document.getElementById("nameInput").value;
    //var dataValue = document.getElementById("dataInput").value;
    //
    //var novaConta = new Conta(nameValue, dataValue);
//
    //fs.readFile('./contas.json', 'utf8', function (err, data) {
    //    if (err) {
    //        console.log(err)
    //    } else {
    //        const file = JSON.parse(data);
    //        
    //        file.contas.push(novaConta);
    //        
    //        console.log(file.contas);
//
    //        const json = JSON.stringify(file);
    //        console.log(json);
    //        fs.writeFile('./contas.json', json, 'utf8', function(err){
    //            if(err){ 
    //              console.log(err); 
    //             } else {
    //              //Everything went OK!
    //        }});
    //    }
    //});


    fs.writeFile(list.filePath, list.fileContent, (err) => {
        if (err) {
            alert("An error ocurred updating the file" + err.message);
            console.log(err);
            return;
        }

        alert("The file has been succesfully saved");
    });

    return list;
}



function openFile(){

    let filePath = dialog.showOpenDialogSync();

    if(filePath === undefined){
        console.log("No file selected");
        return null;
    }

    filePath = String(filePath);

    var data = fs.readFileSync(filePath, 'utf8');
    var parsed = new CsvParser(filePath, data);
    parsed.toArray();

    return parsed;
}

function Geral(){
    const [list, setList] = useState(new CsvParser(null, "nome,numero"));
    
    let inputs = list.headers.map((header) =>
        <input type="text" id={header} placeholder={header}/>
    );
    let headers = list.headers.map((header) =>
        <td>{header}</td>
    );

    let accounts = list.accounts.map((account) =>
        <tr>
            {account.map((column)=>
                <td>{column}</td>
            )}
        </tr>
    );
    
    return (
        <>  
            {inputs}

            <button id="botao" onClick={()=>{
                let a = dataInserction(list);
                if(a !== null){
                    setList(a);
                }
            }}>Clica</button>
            
            <button id="openFile" onClick={()=>{
                let a = openFile();
                if(a !== null){
                    setList(a);
                }
                console.log("tipo do a " + typeof(a))
            }}>Carregar arquivo csv</button>
 
            <table>
                <tr>
                    {headers}
                    
                </tr>
                <tr>
                    <br/>
                </tr>
                {accounts}
            </table>

             
            
        </>
    );
}

export default Geral;
