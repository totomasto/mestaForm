var mysql = require('mysql');
const ipc = require('electron').ipcRenderer;
var Excel = require('exceljs');

if(document.getElementById('print-pdf')){
const printPDFButton = document.getElementById('print-pdf');

printPDFButton.addEventListener('click', function(event){

ipc.send('print-to-pdf');

});

ipc.on('wrote-pdf', function(event, path){

const message = `Wrote PDF to : ${path}`;
document.getElementById('pdf-path').innerHTML = message;

});
}

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Depaco123#",
  database: "mestadb"

});



function loadCategories(){
var categories = "";
con.query("select distinct(`structure`) from products where name != 'Discount acordat'  ",function (err, result, fields){
if(err) throw err
for (var i = 0; i < result.length; i++) {

categories += "<a id='"+result[i].structure+"' onclick='setSelectedCategory(this.id)' href='subProducts.html'>";
categories +=    "<div class='col-md-2'>"+
                        "<div class='ibox'>"+
                            "<div class='ibox-content product-box'>"+
                                "<div class='product-imitation'>"+
                                    "<p><font color='11B800' size='5' face='calibri'>"+ result[i].structure +""+
                                    "</font></label><br></p>"+
                                    "<img alt='image' class='img-circle' width='200px' height='200px' alt='avatar' src='img/"+ result[i].structure+ ".jpg'/><br><br><br><br>"+

                                "</div>"+
                            "</div>"+
                        "</div>"+
                    "</div></a>";
if(document.getElementById('categoriesDiv')){
document.getElementById('categoriesDiv').innerHTML = categories;
}

}
});

}


function loadSubProducts(category){
var categories = "";
con.query("select distinct(`attribute`) from products where structure = '"+ category +"' ",function (err, result, fields){
if(err) throw err
for (var i = 0; i < result.length; i++) {

  categories += "<a id='"+result[i].attribute+"' onclick='setSelectedSubProduct(this.id)' href='orderProduct.html'>";
categories +=    "<div class='col-md-2'>"+
                        "<div class='ibox'>"+
                            "<div class='ibox-content product-box'>"+
                                "<div class='product-imitation'>"+
                                    "<p><font color='11B800' size='5' face='calibri'>"+ result[i].attribute +""+
                                    "</font></label><br></p>"+
                                    "<img alt='image' class='img-circle' width='200px' height='200px' alt='avatar' src='img/"+ result[i].attribute+ ".jpg'/><br><br><br><br>"+
                                     "<h2>"+ localStorage.getItem('categorySelected') +"</h2>"+
                                "</div>"+
                            "</div>"+
                        "</div>"+
                    "</div></a>";
if(document.getElementById('categoriesDiv')){
document.getElementById('categoriesDiv').innerHTML = categories;
}

}
});

}

function loadProduct(subProductSelected){

  con.query("select distinct(color) from products where attribute = '"+ subProductSelected +"' and structure = '"+ localStorage.getItem('categorySelected') +"' ",function (err, result, fields){
  if(err) throw err
  var productColor = document.getElementById('productColor');
  for (var i = 0; i < result.length; i++) {

    var option = document.createElement('option');
    option.text = result[i].color;
    option.value= result[i].color;
    productColor.add(option);

         }
    });
}

if(document.querySelector('#productColor')){
document.querySelector('#productColor').addEventListener('change', function(){
var productColor = document.getElementById('productColor').value;
  con.query("select distinct(bulk) from products where attribute = '"+localStorage.getItem('subProductSelected') +"' and structure = '"+ localStorage.getItem('categorySelected') +"' and color = '"+ productColor +"' ",function (err, result, fields){
  if(err) throw err
  var productBulk = document.getElementById('productBulk');
  for (var i = 0; i < result.length; i++) {

    var option = document.createElement('option');
    option.text = result[i].bulk;
    option.value= result[i].bulk;
    productBulk.add(option);

        }
    });
});
}
if(document.querySelector('#productBulk')){
document.querySelector('#productBulk').addEventListener('change',function(){

var productColor = document.getElementById('productColor').value;
var productBulk = document.getElementById('productBulk').value;
  con.query("select * from products where attribute = '"+localStorage.getItem('subProductSelected') +"' and structure = '"+ localStorage.getItem('categorySelected') +"' and color = '"+ productColor +"' and bulk = '"+productBulk+"' ",function (err, result, fields){
  if(err) throw err
  var group1ProductTable = document.querySelector('#group1ProductTable');

   for (var i = 0; i < result.length; i++) {
      var row = group1ProductTable.insertRow(-1);
      var cell1 = row.insertCell(-1);
      var cell2 = row.insertCell(-1);
      var cell3 = row.insertCell(-1);
      var cell4 = row.insertCell(-1);
      if(result.length > 1){
        if(document.querySelector('#productNameBox')){
         var productNameSelectBox = document.getElementById('productNameBox');
         var option = document.createElement('option');
         option.text = result[i].name;
         option.value = result[i].name;
        productNameSelectBox.add(option);
        } else {
      cell1.innerHTML = "<select class='form-control' style='width: 370px;' id='productNameBox'><option value='"+result[i].name+"'>"+result[i].name+"</option></select>"
    }
      } else {
      cell1.innerHTML = "<input class='form-control' style='width: 370px;' readonly='' id='productName' value='"+result[i].name+"'/>";
    }
      cell2.innerHTML = "<input class='form-control' type='text' id='length_"+i+"'  placeholder= '0'/>";
      cell3.innerHTML = "<input class='form-control' type='number' id='width_"+i+"' placeholder= '0'/>";
      cell4.innerHTML = "<input class='form-control' type='number' id='units_"+i+"' placeholder= '0'/>";
   }
   for (var i = result.length; i < 50; i++) {
     var row = group1ProductTable.insertRow(-1);
     var cell1 = row.insertCell(-1);
     var cell2 = row.insertCell(-1);
     var cell3 = row.insertCell(-1);
     var cell4 = row.insertCell(-1);
     cell1.innerHTML = "";
     cell2.innerHTML = "<input class='form-control' type='text' id='length_"+i+"'  placeholder= '0'/>";
     cell3.innerHTML = "<input class='form-control' type='number' id='width_"+i+"' placeholder= '0'/>";
     cell4.innerHTML = "<input class='form-control' type='number' id='units_"+i+"' placeholder= '0'/>";
           }
      });
   });
}


if(document.querySelector('#saveProduct')){
document.querySelector('#saveProduct').addEventListener('click', function(){


for (var i = 0; i < 50; i++) {
    if(document.getElementById('units_'+i).value > 0 ){
      if(document.querySelector('#productName')){
     var productName = document.getElementById('productName').value;
   } else {
     var productName = document.getElementById('productNameBox').value;
   }

     var length = document.getElementById('length_'+i).value;
     var width = document.getElementById('width_'+i).value;
     var units = document.getElementById('units_'+i).value;
     var color = document.getElementById('productColor').value;
     var product = [productName, length, width, units, color];

     var updateCurrentOrder = "INSERT INTO current_order (product_name, length, width, units, price, discount, color) VALUES ('"+product[0]+"','"+product[1]+"','"+product[2]+"','"+product[3]+"','0','0','"+product[4]+"')";
     con.query(updateCurrentOrder,function (err, result, fields){
     if(err) throw err;
   });


    }


}

window.location.replace("products.html");

  });
}


function showCurrentOrder(){

  con.query("select * from current_order inner join products on current_order.product_name = products.name ",function (err, result, fields){
  if(err) throw err
  var totalOrder = 0;
 var productsTable = document.querySelector('#sessionProducts');

for (var i = 0; i < result.length; i++) {

  var path = location.href;
  var fileName = path.split("/").pop();

  var totalMp = Number(result[i].units * (result[i].length/1000 * result[i].width/1000)).toFixed(2);
  var row = productsTable.insertRow(-1);
  var cell1 = row.insertCell(-1);
  var cell2 = row.insertCell(-1);
  var cell3 = row.insertCell(-1);
  var cell4 = row.insertCell(-1);
  var cell5 = row.insertCell(-1);
  var cell6 = row.insertCell(-1);
  var cell7 = row.insertCell(-1);
  var cell8 = row.insertCell(-1);


cell1.innerHTML = result[i].product_name;
cell2.innerHTML = result[i].units;
cell3.innerHTML = result[i].length;
cell4.innerHTML = result[i].width;
cell5.innerHTML = result[i].color;
if(result[i].name === 'Discount acordat'){
  cell6.innerHTML = result[i].discount + '%';
  var orderDiscount = result[i].discount;
  document.querySelector('#discountLine').remove();
} else {
cell6.innerHTML = result[i].price;
}
cell7.innerHTML = totalMp;
cell8.innerHTML = Number(totalMp * result[i].price).toFixed(2);
if(fileName === 'invoice.html'){
/// do nothing just for a moment
} else {
  var cell9 = row.insertCell(-1);
  cell9.innerHTML = "<button class='btn btn-success btn-rounded' id='"+result[i].name+"' onclick=''>Adauga prelucrare</button>";
  cell9.innerHTML += "<button class='btn btn-danger btn-rounded' id='"+result[i].name+"' onclick='deleteArticle(this.id)'>Sterge articol</button>";
}
      totalOrder += totalMp * result[i].price;



}
   if(orderDiscount) totalOrder = totalOrder - totalOrder * orderDiscount/100;
       document.querySelector('#wVat').innerHTML = Number(totalOrder).toFixed(2) + ' eur';
       document.querySelector('#vat').innerHTML = Number(totalOrder * 19/100).toFixed(2) + ' eur';
       document.querySelector('#total').innerHTML =  Number(totalOrder + (totalOrder * 19/100)).toFixed(2) + ' eur';


   });
}

if(document.querySelector('#finalOrder')){
document.querySelector('#finalOrder').addEventListener('click', function(){

 // window.open('address.html', 'deliveryAddress', 'width=500,height=800,scrollbars=1,resizable=1');

 window.location.replace('invoice.html');

});
}

function deleteArticle(name){

    con.query("DELETE FROM current_order WHERE product_name = '"+name+"'", function(err, result, fields){
       if(err) throw err;


    });

    location.reload();

}




function setSelectedCategory(category){

 localStorage.setItem('categorySelected', category);

}

function getSelectedCategory(){

loadSubProducts(localStorage.getItem('categorySelected'));

}

function setSelectedSubProduct (subProduct){

localStorage.setItem('subProductSelected', subProduct);

}

function getSelectedSubProduct(){

loadProduct(localStorage.getItem('subProductSelected'));

}


if(document.querySelector('#newOrder')){
document.querySelector('#newOrder').addEventListener('click', function(){

    if(confirm("Esti sigur ca vrei sa incepi o comanda noua ? Comanda curenta va fi stearsa complet.")){

      var deleteCurrentOrder = "DELETE FROM current_order";
      con.query(deleteCurrentOrder,function (err, result, fields){
      if(err) throw err
      });

       localStorage.clear();

      window.location.replace("index.html");
    } else {
    }

});
}

if(document.querySelector('#addDeliveryAddress')){
document.querySelector('#addDeliveryAddress').addEventListener('click', function(){

      localStorage.setItem('judet',document.getElementById('orderRegion').value);
      localStorage.setItem('oras',document.getElementById('orderCity').value);
      localStorage.setItem('adresa',document.getElementById('orderAddress').value);
      localStorage.setItem('telefon',document.getElementById('orderPhone').value);
      localStorage.setItem('data',document.getElementById('orderDate').value);
      localStorage.setItem('obs',document.getElementById('orderObs').value);






});
}


function openInvoice(){

window.open('invoice.html', 'invoiceWindow', 'width=1000,height=1000,scrollbars=1,resizable=1');


}


if(document.querySelector('#newCurrentOrder')){
  document.querySelector('#newCurrentOrder').addEventListener('click', function(){

    var deleteCurrentOrder = "DELETE FROM current_order";
    con.query(deleteCurrentOrder,function (err, result, fields){
    if(err) throw err
    });
    localStorage.clear();
    window.location.replace("products.html");

  });
}

if(document.querySelector('#discountLine')){
document.querySelector('#discountLine').addEventListener('click', function(){
  var productsTable = document.querySelector('#sessionProducts');
 var row = productsTable.insertRow(-1);
   var cell1 = row.insertCell(-1);
   var cell2 = row.insertCell(-1);
   var cell3 = row.insertCell(-1);
   var cell4 = row.insertCell(-1);
   var cell5 = row.insertCell(-1);
   var cell6 = row.insertCell(-1);
   var cell7 = row.insertCell(-1);
   var cell8 = row.insertCell(-1);
   var cell9 = row.insertCell(-1);
 cell1.innerHTML = '<h3>Linie discount comanda</h3>';
 cell2.innerHTML = 1;
 cell3.innerHTML = 0;
 cell4.innerHTML = 0;
 cell5.innerHTML = 0;
 cell6.innerHTML = '<input type="number" style="width: 80px; height: 30px;" class="form-control" value="-" id="discountInput" />';
 cell7.innerHTML = "";
 cell8.innerHTML = "";
 cell9.innerHTML = '<button type="button" class="btn btn-primary" onclick="saveDiscount();" >Salveaza discount</button>';



});

}



function saveDiscount(){

var discountValue = document.getElementById('discountInput').value;
var query = "INSERT INTO current_order (product_name, discount) VALUES ('Discount acordat', '"+ discountValue +"' )";

con.query(query, function(err, result, fields){
if(err) throw err;

});

location.reload();

}



function zoom() {
    document.body.style.zoom = "80%"
}




function exportOrderExcel(){

    var workbook = new Excel.Workbook();

    workbook.creator = 'Formular Comanda';
    workbook.lastModifiedBy = 'Formular Comanda';
    workbook.created = new Date(1985, 8, 30);
    workbook.modified = new Date();
    workbook.lastPrinted = new Date(2016, 9, 27);

// must create one more sheet.
    var worksheet = workbook.addWorksheet("Export formular comanda");

    worksheet.columns = [
    { header: 'An', key: 'an', width: 10 },
    { header: 'Luna', key: 'luna', width: 32 },
    { header: 'Tip Document', key: 'tipdoc', width: 10, outlineLevel: 1 },
    { header: 'Total comenzi', key: 'totcomenzi', width: 32 },
    { header: 'Nr. Document', key: 'nrdoc', width: 32 },
    { header: 'Agent', key: 'agent', width: 32 },
    { header: 'Data', key: 'data', width: 32 },
    { header: 'Cod Client', key: 'codclient', width: 32 },
    { header: 'Locatie', key: 'locatie', width: 32 },
    { header: 'Moneda', key: 'moneda', width: 32 },
    { header: 'Total articole', key: 'totarticole', width: 32 },
    { header: 'Observatii', key: 'obs', width: 32 },
    { header: 'Produse', key: 'produse', width: 32 }

];

// Add a couple of Rows by key-value, after the last current row, using the column keys
// worksheet.addRow({id: 1, name: 'John Doe', dob: new Date(1970,1,1)});
// worksheet.addRow({id: 2, name: 'Jane Doe', dob: new Date(1965,1,7)});
//


// you can create xlsx file now.
    workbook.xlsx.writeFile("./comenzi/comanda test .xlsx").then(function() {
        console.log("xls file is written.");
    });

}
