// storage controller 
const StorageCtrl =(function(){
// public methods 
    return {
storeItem: function(item){
    let items;
    
    // check if any item in local storage 
    if(localStorage.getItem('items') === null){
items = [];
// push new item  
items.push(item);
// set ls 
localStorage.setItem('items', JSON.stringify(items));
    }else{
        // get what is already in ls 
        items = JSON.parse(localStorage.getItem('items'));

        // push new item 
        items.push(item);

        // re set ls 
        localStorage.setItem('items', JSON.stringify(items)); 
    }
},
getItemsFromStorage: function(){
    let items;
    if(localStorage.getItem('items') === null){
        items = [];
    }else {
        items = JSON.parse(localStorage.getItem('items'));
    }
    return items;
},
updateItemStorage: function(updatedItem){
    let items = JSON.parse(localStorage.getItem('items'));

    items.forEach(function(item, index){
        if(updatedItem.id === item.id){
            items.splice(index, 1, updatedItem);
        }
    });
    localStorage.setItem('items', JSON.stringify(items));
},
deleteItemFromStorage: function(id){
    let items = JSON.parse(localStorage.getItem('items'));

    items.forEach(function(item, index){
        if(id === item.id){
            items.splice(index, 1, updatedItem);
        }
    });
    localStorage.setItem('items', JSON.stringify(items));

},
clearItemsFromStorage: function(){
    localStorage.removeItem('items');
}
}
})();

// item controller 
const ItemCtrl = (function(){
// item constructor 
const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
}

// data structure 
const data = {
    items: [
        // {id:0, name:'steak Dinner', calories:1200},
        // {id:0, name:'Cookies', calories:400},
        // {id:0, name:'Eggs', calories:300}
    ],
    items:StorageCtrl.getItemsFromStorage(),
    currentItem:null,
    totalCalories:0
}

// public methods 
return {
    getItems: function(){
        return data.items
    },
    addItem:function(name, calories){
        let ID;
// create id 
if(data.items.length > 0){
ID = data.items[data.items.length - 1].id+1;
}else {
    ID = 0;
}

// calories to number 
 calories = parseInt(calories);

//  create new item 
newItem = new Item(ID, name, calories);

data.items.push(newItem);

return newItem;
    },
    getItemById: function(id){
let found = null;
// loop through items 
data.items.forEach(function(item){
    if(item.id === id){
        found = item;
    }
});
return found;
    },
    updateItem: function(name, calories){
// calories to number 
calories = parseInt(calories);

let found = null;

data.items.forEach(function(item){
if(item.id === data.currentItem.id){
item.name = name;
item.calories =calories;
found = item;
}
});
return found;
    },
    deleteItem: function(id){
// get id's 
ids = data.items.map(function(item){
return item.id;


// get index 
const index = ids.indexOf(id);

// remove item 
data.items.splice(index, 1);
});
    },
    clearAllItems: function(){
data.items = [];
    },
    setCurrentItem: function(item){
data.currentItem = item;
    },
    getCurrentItem: function(){
return data.currentItem;
    },
    getTotalCalories:function(){
        let total = 0;

        // loop through items and add cals 
        data.items.forEach(function(item){
            total += item.calories;
            // total = total + item.calories;
        });
// set total cal in data struct 
        data.totalCalories = total;

        // return total 
        return data.totalCalories;
    },
    logData: function(){
        return data;
    }
}
})();
// ui controller 
const UICtrl = (function(){
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: 'clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput:'#item-calories',
        totalCalories:'.total-calories'
    }
// public methods 
return {
    populateItemList: function(items){
        let html = '';

        items.forEach(function(item){
html += ` <li class="collection-item" id="item-${item.id}">
<strong>${item.name}: </strong> <em>${item.calories}Calories</em>
<a href="#" class="secondary-content">
  <i class="edit-item fa fa-pencil"></i>
</a>
</li>`
        });

        // insert list items 
        document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function(){
        return {
            name:document.querySelector(UISelectors.itemNameInput).value,
            calories:document.querySelector(UISelectors.itemCaloriesInput).value

        }
    },
    addListItem: function(item){
        // show the list
         document.querySelector(UISelectors.itemList).style.display = 'block';
        // create li item 
        const li = document.createElement('li');
        // add class 
        li.className = 'collection-item';
        // add id 
        li.id = `item-${item.id} `;

        // add html 
        li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories}Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>`;
        // insert item 
        document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
    },
    updateListItem: function(item){
let listItems = document.querySelectorAll(UISelectors.listItems );
   
// turn node list into an array 
listItems = Array.from(listItems);
listItems.forEach(function(listItem){
const itemID = listItem.getAttribute('id');

if(itemID === `item-${item.id}`){

    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories}Calories</em>
    <a href="#" class="secondary-content">
      <i class="edit-item fa fa-pencil"></i>
    </a>`;
}
});
},
deleteListItem: function(id){
const itemID = `#item-${id}`;
const item = document.querySelector(itemID);
item.remove();
},
    clearInput: function(){
        document.querySelector(UISelectors.itemCaloriesInput).value = '';
        document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    addItemToForm: function(){
        document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().name;
        document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
        UICtrl.showEditState();
    },
    removeItems: function(){
let listItems = document.querySelectorAll(UISelectors.listItems);

// turn node list into array 
listItems = Array.from(listItems);

listItems.forEach(function(item){
    item.remove();
});
    },
    hideList:function(){
        document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function(total){
document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState: function(){
        UICtrl.clearInput();
        document.querySelector(UISelectors.updateBtn).style.display = 'none';
        document.querySelector(UISelectors.deleteBtn).style.display = 'none';
        document.querySelector(UISelectors.addBtn).style.display = 'none';
        document.querySelector(UISelectors.backBtn).style.display = 'inline';
    },
    showEditState: function(){
        document.querySelector(UISelectors.updateBtn).style.display = 'inline';
        document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
        document.querySelector(UISelectors.addBtn).style.display = 'inline';
        document.querySelector(UISelectors.backBtn).style.display = 'none';
    },
    getSelectors: function(){
        return UISelectors;
    }
}
})(); 



// app comntroller 
const App = (function(ItemCtrl, StorageCtrl, UICtrl){
    // load event listeners 
    const loadEventListeners = function(){
        // get ui selectors 
const UISelectors = UICtrl.getSelectors();

// add item event 
document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
        
// disable submit on enter 
document.addEventListener('keypress', function(e){
if(e.keycode === 13 || e.which ===13){
    e.preventDefault();
    return false;
} 
});
// edit icon click event 
document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

// update item event 
document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
// delete item event 
document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

// back button event 
document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);
}

// clear items event 
document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemClick);


    // add item submit 
    const itemAddSubmit = function(e){
        // get form input from ui controller 
        const input = UICtrl.getItemInput();

        // check for name and calorie input 
        if(input.name !== '' && input.calories !=='' ){
// add item 
const newItem = ItemCtrl.addItem(input.name, input.calories);
        // add item to ui list 
        UICtrl.addListItem(newItem);

// get total calories 
const totalCalories = ItemCtrl.getTotalCalories();
// add total calories to ui 
UICtrl.showTotalCalories(totalCalories);

// store in local stoprage ?
StorageCtrl.storeItem(newItem);
        // clear fields 
        UICtrl.clearInput();
}
        e.preventDefault();
    }

    // edit item click 

    const itemEditClick = function(e){
if(e.target.classList.contains('edit-item')){
// get list item id (item 0, item-1 )
const listId = e.target.parentNode.parentNode.id;
// break into an array 
const listIdArr = listId.split('-');
// get the actual id 
const id = parseInt(listIdArr[1]);

// get item 
const itemToEdit = ItemCtrl.getItemById(id);

// set current item 
ItemCtrl.setCurrentItem(itemToEdit);

// add item to form 

UICtrl.addItemToForm();
}
        e.preventDefault();
    }

    // update item submit 
    const itemUpdateSubmit = function(e){
const input = UICtrl.getItemInput();

// update item 
const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
// update ui 
UICtrl.updateListItem(updateItem);
// get total calories 
const totalCalories = ItemCtrl.getTotalCalories();
// add total calories to ui 
UICtrl.showTotalCalories(totalCalories);

// update ls 
StorageCtrl.updateItemStorage(updatedItem);

UICtrl.clearEditState();

e.preventDefault();
    }

    // delete button event 
    const itemDeleteSubmit = function(e){
// get current item 
const currentItem = ItemCtrl.getCurrentItem();

// delete from data structure 
ItemCtrl.deleteItem(currentItem.id);
    //   delete from  UI 
    UICtrl.deleteListItem(currentItem.id);
// get total Calories 
    const totalCalories = ItemCtrl.getTotalCalories();
// add total calories to ui 
UICtrl.showTotalCalories(totalCalories);

// delete from local storage 
StorageCtrl.deleteItemFromStorage(currentItem.id);
        // clear edit fields 
        UICtrl.clearEditState();

e.preventDefault();
    }

    // clear items event 
    const clearAllItemClick = function(){
        // delete all items from data structure 
        ItemCtrl.clearAllItems();

        // get total Calories 
    const totalCalories = ItemCtrl.getTotalCalories();
    // add total calories to ui 
    UICtrl.showTotalCalories(totalCalories);

        // remove fron ui 
        UICtrl.removeItems();


        // clear from ls 
        StorageCtrl.clearItemsFromStorage();
        // hide UL 
        UICtrl.hideList();
    }
// public methods 
return{
    init:function(){

        // clear edit state /set initial state
UICtrl.clearEditState();

        // fetch item from data structure 
const items = ItemCtrl.getItems();

// check if any items 
if(items.length === 0){
    UICtrl.hideList();
}else{
// populate list with items 
UICtrl.populateItemList(items);
}

// get total calories 
const totalCalories = ItemCtrl.getTotalCalories();
// add total calories to ui 
UICtrl.showTotalCalories(totalCalories);

// load event listeners 
loadEventListeners    
    }
}

})(ItemCtrl, StorageCtrl, UICtrl);
// initializing app 
App.init();