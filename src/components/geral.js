import './geral.css';

import React, { useState } from 'react';


const fs = window.require('fs');
const {dialog} = window.require('electron').remote;

class Conta{
    constructor(nome, data){
        this.nome = nome;
        this.data = data;
    }
}

class CsvParser{
    constructor(fileContent){
        var rows = fileContent.split('\n')

        this.headers = [];
        this.headers = rows[0].split(',')

        this.accounts = [];
        var i;
        for (i = 1; i < rows.length; i++) {
            var columns = rows[i].split(',')
            
            var newAccount = new Conta(columns[0], columns[1]);
            
            this.accounts.push(newAccount)
        }
    }
}

function dataInserction(params) {

    var nameValue = document.getElementById("nameInput").value;
    var dataValue = document.getElementById("dataInput").value;
    
    var novaConta = new Conta(nameValue, dataValue);

    fs.readFile('./contas.json', 'utf8', function (err, data) {
        if (err) {
            console.log(err)
        } else {
            const file = JSON.parse(data);
            
            file.contas.push(novaConta);
            
            console.log(file.contas);

            const json = JSON.stringify(file);
            console.log(json);
            fs.writeFile('./contas.json', json, 'utf8', function(err){
                if(err){ 
                  console.log(err); 
                 } else {
                  //Everything went OK!
            }});
        }
    });

}



function openFile(){

    let fileName = dialog.showOpenDialogSync();
    
    var data = fs.readFileSync(String(fileName), 'utf8');
    var parsed = new CsvParser(data);
    
    return parsed;
}

function Geral(){
    const [list, setList] = useState(new CsvParser("nome,numero"));
    
    let headers = list.headers.map((header) =>
        <td>{header}</td>
    );

    let accounts = list.accounts.map((account) =>
        <tr>
            <td>{account.nome}</td>
            <td>{account.data}</td>
        </tr>
    );
    console.log(headers[0].props.children);
    //{headers === undefined ? null : headers}
    //{accounts === undefined ? null : accounts}
    
    return (
        <>  
            
            <table>
                <tr>
                    {headers}
                </tr>
                {accounts}
            </table>

            <input type="text" name="name" id="nameInput"  placeholder="Nome"/>
            <input type="text" name="data" id="dataInput"  placeholder="Data"/>
            <button id="botao" onClick={dataInserction}>Clica</button>
            <input type="button" id="openFile" onClick={()=>{
                console.log("lista antes " + list)
                let a = openFile();
                console.log("clicou " + a.headers)
                setList(a);
                console.log("lista depois " + list.headers[1])
            }} value="clica fdp"/> 
            
        </>
    );
}

export default Geral;
