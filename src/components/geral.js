import './geral.css';

import React from 'react';

//import csvParser from 'csv-parser';
//import { render } from '@testing-library/react';
//import { ReactComponent } from '*.svg';


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
            
            this.accounts.push(columns) 
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

function dataInserction(list) {

    let content = []
    for (var i = 0; i < list.headers.length; i++) {
        
        var val = document.getElementById(list.headers[i]).value;

        document.getElementById(list.headers[i]).value = '';

        val = val.replace(/,/g, ".");

        content.push(val);
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
            alert("Um erro ocorreu ao tentar atualizar o arquivo geral" + err.message);
            console.log(err);
            return;
        }

        alert("Essa linha foi adicionada no arquivo");
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


export default class Geral extends React.Component{
    state = {
        parsed:null,
        inputs:null,
        headers:null,
        accounts:null
    };
    
    setNewParsed = (parsed)=>{

        this.setState({
            parsed: parsed
        });

        this.domElementsHandle(parsed);
    }

    domElementsHandle = (parsed)=>{
        console.log("domHadle chamado" + parsed.accounts)

        let inputs = parsed.headers.map((header) =>
            <input type="text" id={header} placeholder={header}/>
        );

        let headers = parsed.headers.map((header) =>
        <>
            <td>
                <select
                  id="demo-simple-select"
                  value={header}
                  onChange={()=>this.domFilter({header})}
                >
                    <option value={header}>{header}</option>
                    <option value="chaves">Chaves</option>
                </select>
            </td>
        </>    
        );
        
        let accounts = parsed.accounts.map((account) =>
            <tr>
                {account.map((column)=>
                    <td>{column}</td>
                )}
            </tr>
        );

        this.setState({
            inputs: inputs,
            headers: headers,
            accounts: accounts
        });

    };

    domFilter = (value)=>{
        console.log(value)
    }
    
    render(){
        return (
            <>  
                {this.state.inputs}
                
                <table>
                    <tr>
                        {this.state.headers}
                    </tr>
                    <tr>
                        <br/>
                    </tr>
                    {this.state.accounts}
                </table>

                {this.state.parsed === null ? null
                : <button id="addLineFile" onClick={() => this.setNewParsed(dataInserction(this.state.parsed))}>Adicionar linha</button>
                }
                <button id="openFile" onClick={() => this.setNewParsed(openFile())}>Carregar arquivo csv</button> 
                
            </>
        );
    };
    
}