document.addEventListener('init', function(event) {
  var page = event.target;

  if (page.id === 'page1') {
    page.querySelector('#push-button').onclick = function() {
      document.querySelector('#myNavigator').pushPage('page2.html', {data: {title: 'Page 2'}});
    };
  } else if (page.id === 'page2') {
    page.querySelector('ons-toolbar .center').innerHTML = page.data.title;
  }
});

window.fn = {};

window.fn.open = function() {
  var menu = document.getElementById('menu');
  menu.open();
};

window.fn.load = function(page) {
  var content = document.getElementById('content');
  var menu = document.getElementById('menu');
  content.load(page)
    .then(menu.close.bind(menu));
};



document.addEventListener('init',function(event){
    if(event.target.id == "home"){
        openDB(); 
        getItems();
    }

})



var db = null;

function onError(tx, e){
    alert("Something went wrong." + e.Message);
}

function onSuccess(tx, r){
    getItems();
}

function openDB(){
    db = openDatabase("Shoppinglist", "1", "Shopping list", 1024*1024);

    db.transaction(function(tx){
        tx.executeSql("CREATE TABLE IF NOT EXISTS items(ID INTEGER PRIMARY KEY ASC, item TEXT)", []);
    });
}

function getItems(){

    db.transaction(function(tx){
        tx.executeSql("SELECT * FROM items", [], renderItems, onError);
    });
}

function renderItems(tx, rs){
    var output = "";
    var list = document.getElementById('shoppinglist');

    for(i = 0; i < rs.rows.length; i++)
    {
        var row = rs.rows.item(i);
        output += "<ons-list-item>" + row.item +
        "<div class=\"right\"> <ons-button onclick='deleteItem(" + row.ID + ");')><ons-icon size=30px icon=\"trash\">" + 
        "</ons-icon></ons-button></div>" +
        "</ons-list-item>"

    }

    list.innerHTML = output;
}

function addItem()
{
    var textbox = document.getElementById("item");
    var value = textbox.value;

    db.transaction(function(tx){
        tx.executeSql("INSERT INTO items(item) VALUES(?)", [value], onSuccess, onError);
    });

    textbox.value = "";
    fn.load('home.html');
}

function deleteItem(ID)
{
    db.transaction(function(tx){
        tx.executeSql("DELETE FROM items WHERE ID=?", [ID], onSuccess, onError);
    });
}
