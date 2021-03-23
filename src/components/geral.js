import './geral.css';

import React from 'react';
import { parse } from 'csv';
import csvParser from 'csv-parser';

//import csvParser from 'csv-parser';
//import { render } from '@testing-library/react';
//import { ReactComponent } from '*.svg';


const fs = window.require('fs');
const {dialog} = window.require('electron').remote;

class columnHeader{
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
            let header = new columnHeader(headers[i]);

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

function arrayToCsv(accounts){ //array of array to csv string
    
    let fileString;
    accounts.forEach((account)=>{
        
        for (var i = 0; i < account.length; i++) {
            fileString += account[i]//deve ter um undefined
            
            if(i < account.length - 1){
                fileString += ','
            } 
        }
        fileString += '\n';
    });
    console.log("conta "+fileString)
    return fileString;
}

function dataInserction(list) {

    let content = []
    for (var i = 0; i < list.headers.length; i++) {
        
        var val = document.getElementById(list.headers[i].name).value;

        document.getElementById(list.headers[i].name).value = '';

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

function saveFile(fileContent){

    let savePath = dialog.showSaveDialogSync();

    if(savePath === undefined){
        console.log("No file selected");
        return null;
    }

    fs.writeFile(savePath, fileContent, (err) => {
        if (err) {
            alert("Um erro ocorreu ao tentar atualizar o arquivo geral" + err.message);
            console.log(err);
            return;
        }

        alert("O arquivo foi salvo em " + savePath);
    });
}

export default class Geral extends React.Component{
    state = {
        parsed:null,
        domParsed:null,
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
        if(parsed !== undefined && parsed !== null){

            let inputs = parsed.headers.map((header) =>
                <td>
                    <input type="text" id={header.name} placeholder={header.name}/>
                </td>
            );

            let headers = parsed.headers.map((header) =>
            <>
                <td>
                    
                    <select

                      onChange={(val)=>this.domFilter(val.target[val.target.options.selectedIndex].value)}
                    >
                        <option value={header.name}>{header.name}</option>
                        {header.columnElements.map((element) =>
                            <option value={element}>{element}</option>
                        )}
                        
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
        }  

    };

    domFilter = (element)=>{

        let isHeader = false;
        this.state.parsed.headers.forEach((header)=>{
            if(header.name === element){
                isHeader = true;
            }
        });

        let domParsed;
        if(this.state.domParsed === null || isHeader){
            domParsed = Object.assign({}, this.state.parsed);
        } else {
            domParsed = Object.assign({}, this.state.domParsed);
        }
        console.log(domParsed)
        console.log(this.state.parsed)
        

        if(!isHeader){
            let newAccounts = [];

            domParsed.accounts.forEach((account)=>{
            
                if(account.indexOf(element) !== -1){
                    newAccounts.push(account);
                }
            });

            domParsed.accounts = newAccounts;
            
           
        }

        this.setState({
            domParsed: domParsed
        });

        this.domElementsHandle(domParsed);
    }
    
    render(){
        return (
            <>  
                
                
                <table>
                    <tr>
                        {this.state.inputs}
                    </tr>
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

                {this.state.domParsed === null ? null
                : <button id="saveFile" onClick={() => saveFile(arrayToCsv(this.state.domParsed.accounts))}>Salvar arquivo</button>
                }
            </>
        );
    };
    
}