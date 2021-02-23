//import './Geral.css';


const fs = window.require('fs');

//const csv = require('csv-parser');


class Conta{
    constructor(nome, data){
        this.nome = nome;
        this.data = data;
    }
}

function dataInserction(params) {
    fs.readFile('src/components/contas.json', 'utf8', function (err, data) {
        if (err) {
            console.log(err)
        } else {
            const file = JSON.parse(data);
            
            var nameValue = document.getElementById("nameInput").value;
            var dataValue = document.getElementById("dataInput").value;
            
            var novaConta = new Conta(nameValue, dataValue);
            file.contas.push(novaConta);
            
            console.log(file.contas);

            const json = JSON.stringify(file);
            console.log(json);
            fs.writeFile('src/components/contas.json', json, 'utf8', function(err){
                if(err){ 
                  console.log(err); 
                 } else {
                  //Everything went OK!
            }});
        }

    });

}

function Geral() {
  return (
    <>
    <table>
        <tr>
            <th>Firstname</th>
            <th>Lastname</th>
            <th>Age</th>
        </tr>
        <tr>
            <td>Jill</td>
            <td>Smith</td>
            <td>50</td>
        </tr>
        <tr>
            <td>Eve</td>
            <td>Jackson</td>
            <td>94</td>
        </tr>
    </table>
    
    <input type="text" name="name" id="nameInput"  placeholder="Nome"/>
    <input type="text" name="data" id="dataInput"  placeholder="Data"/>
    <button id="botao" onClick={dataInserction}>Clica</button> 
    
    </>
  );
}

export default Geral;
