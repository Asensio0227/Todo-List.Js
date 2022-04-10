const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.links');
const linksContainer = document.querySelector('.links-container');
const form = document.querySelector('.todo-form');
const todo = document.getElementById('todo');
const alert = document.querySelector('.alert');
const submit = document.querySelector('.submit-btn');
const clearBtn = document.querySelector('.clear-btn');
const container = document.querySelector('.todo-container');
const list = document.querySelector('.todo-list');

toggle.addEventListener('click', () => {
  const linksheight = links.getBoundingClientRect().height;
  const containerheight = linksContainer.getBoundingClientRect().height;

  if (containerheight === 0) {
    linksContainer.style.height = `${linksheight}px`;
  } else {
    linksContainer.style.height = '0px';
  }
});

let isEditing;
let editflag = false;
let editID = "";

form.addEventListener('submit', chlorine);

clearBtn.addEventListener('click', clearItems);

window.addEventListener('DOMContentLoaded', setupitems);

function chlorine(e) {
  e.preventDefault();
  const value = todo.value;
  const id = new Date().getTime().toString();
  if (value && !editflag) {
    createitems(id,value);
    container.classList.add('show-container');
    addtolocalstorage(id, value);
    showAlert('activity added successfully', 'success');
    setbacktodefault();
  } else if (value && editflag) {
    editflag.innerHTML = value;
    editlocalStorage(editID, value);
    showAlert('activity updated successfully', 'success');
    setbacktodefault();
  } else {
    showAlert('please enter activity', 'danger');
  }
}

// ************* Buttons *************
function checkItems(e) {
  const element = e.currentTarget.parentElement.parentElement;
  editID = element.dataset.id;
  if (element.checked) {
    togglecomplete(e.target);
  }
}

function togglecomplete(type) {
  if (type.checked === false) {
    type.checked = false;
  } else {
    type.checked = true;
  }
  showAlert('checked', 'success')
};

function editItems(e) { 
  const element = e.currentTarget.parentElement.parentElement;
  isEditing= e.currentTarget.parentElement.previousElementSibling;
  todo.value = isEditing.innerHTML;
  editID = element.dataset.id;
  submit.textContent = 'edit';
  editflag=true;
}

function deleteItems(e) { 
  const element = e.currentTarget.parentElement.parentElement;
  const id = e.currentTarget.dataset.id;

  list.removeChild(element);
  if (list.children.length === 0) {
    container.classList.remove('show-container')
  }
  removefromlocalstorage(id);
  showAlert('activity removed from list', 'danger');
  setbacktodefault();
}

function clearItems() {
  const items = document.querySelectorAll('.todo-item');

  items.forEach((item) => {
    list.removeChild(item);
  })
  container.classList.remove('show-container');
  localStorage.removeItem('list');
  showAlert('List empty', 'danger');
  setbacktodefault();
}

// *********** end fo buttons ***********

const showAlert = (text, action) => {
  alert.classList.add(`alert-${action}`);
  alert.textContent = text;
  setTimeout(() => {
    alert.classList.remove(`alert-${action}`);
    alert.textContent = '';
  }, 3000)
};

const setbacktodefault = () => {
  submit.textContent = 'submit';
  editID = "";
  todo.value = '';
  editflag = false;
}

// ********* local Storage ****************

function addtolocalstorage(id, value) {
  const grocery = { id, value };
  let items = getlocalStorage();
  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
}

function getlocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}


function removefromlocalstorage(id) { 
  const items = getlocalStorage();

  items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  })
  localStorage.setItem('list', JSON.stringify(items));
}

function editlocalStorage(id, value) { 
  const items = getlocalStorage();
  
  items.map((item) => {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  })
  localStorage.setItem('list', JSON.stringify(items));
}

// ********** end of local storage ****************

// ******** setupitems ************
function setupitems() { 
  const items = getlocalStorage();

  if (items.length > 0) {
    items.map((item) => {
      createitems(item.id, item.value);
    })
    container.classList.add('show-container');
  }
}

function createitems(id, value) {
  const element = document.createElement('article');
    element.classList.add('todo-item');
    const attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr);
  element.innerHTML = `
            <p class="title">${value}</p>
            <div class="btn-container">
                <input type="checkbox" class="checkbox"/>
              <button class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
              <button class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
            </div>`;
            const editBtn = element.querySelector('.edit-btn');
            editBtn.addEventListener('click', editItems);
            const deleteBtn = element.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', deleteItems);
            const checkBtn = element.querySelector('.checkbox');
            checkBtn.addEventListener('click', checkItems);
            list.appendChild(element);
}