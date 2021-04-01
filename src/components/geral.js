import './geral.css';

import React from 'react';
import CsvParser from '../classes/CsvParser'

//import { parse } from 'csv';
//import csvParser from 'csv-parser';

//import csvParser from 'csv-parser';
//import { render } from '@testing-library/react';
//import { ReactComponent } from '*.svg';


const fs = window.require('fs');
const {dialog} = window.require('electron').remote;

function arrayToCsv(domParsed){ //array of array to csv string
    
    let fileString = "";
    
    console.log(fileString)
    for(var i = 0; i < domParsed.headers.length; i++){
        fileString += domParsed.headers[i].name

        if(i < domParsed.headers.length - 1){
            fileString += ','
        }
    }
    fileString += '\n';

    domParsed.accounts.forEach((account)=>{
        
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

function domParsedFilter(domParsed, element){
    
    
    domParsed.accounts = domParsed.accounts.filter((account)=>{
    
        if(account.indexOf(element) !== -1){
            return true
        } else {
            return false
        }
        
    });
 
    domParsed.headers.forEach((header)=>{

        header.columnElements = header.columnElements.filter((element)=>{
            
            for(let j = 0; j < domParsed.accounts.length; j++){

                if(domParsed.accounts[j].indexOf(element) !== -1){
                    return true;
                } else if(j === domParsed.accounts.length - 1){
                    return false;
                }

            }
        });
        
    });
    
    return domParsed;
}

function deepObjClone(source){

  if(typeof(source) !== "object"){
    return source;
  }

  if(Array.isArray(source)){
  
    let lista = [];
    
    for(let i = 0; i < source.length; i++){

      lista[i] = deepObjClone(source[i]);
      
    }

    return lista;
    
  }
  
  let copy = {}
  for(let keys in source){
    copy[keys] = deepObjClone(source[keys]); 
  }

  return copy;
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

    domFilter = (element, headerName)=>{

        let isHeader = false;
        this.state.parsed.headers.forEach((header)=>{
            if(header.name === element){
                isHeader = true;
            }
        });

        let domParsed;
        if(this.state.domParsed === null || isHeader){
            domParsed = deepObjClone(this.state.parsed)
        } else {
            domParsed = deepObjClone(this.state.domParsed)
        }
        
        if(!isHeader){
            domParsed = domParsedFilter(domParsed, element);
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
                : <button id="saveFile" onClick={() => saveFile(arrayToCsv(this.state.domParsed))}>Salvar arquivo</button>
                }
            </>
        );
    };
    
}