import { Auth } from './auth.js';
import { ProductStore } from './products.js';
import { createProductElement } from './ui.js';

const auth = window.appAuth = new Auth();
const store = window.appStore = new ProductStore();

// UI elements
const authPanel = document.getElementById('auth-panel');
const authForm = document.getElementById('auth-form');
const authTitle = document.getElementById('auth-title');
const authMsg = document.getElementById('auth-msg');
const authUsername = document.getElementById('auth-username');
const authPassword = document.getElementById('auth-password');
const authSwitch = document.getElementById('auth-switch');
const authSubmit = document.getElementById('auth-submit');
const btnLogin = document.getElementById('btn-login');
const btnRegister = document.getElementById('btn-register');
const btnLogout = document.getElementById('btn-logout');
const userGreet = document.getElementById('user-greet');
const userEmail = document.getElementById('user-email');
const detailsPanel = document.getElementById('details-panel');

const listEl = document.getElementById('product-list');
const searchEl = document.getElementById('search');
const categoryFilter = document.getElementById('category-filter');
const addNewBtn = document.getElementById('add-new');

const productForm = document.getElementById('product-form');
const idInput = document.getElementById('product-id');
const nameInput = document.getElementById('name');
const categoryInput = document.getElementById('category');
const priceInput = document.getElementById('price');
const clearBtn = document.getElementById('clear-btn');

let mode='login'; // or 'register'

function setAuthUI() {
  const cur = auth.getCurrent();
  if (cur) {
    btnLogin.style.display='none'; btnRegister.style.display='none';
    btnLogout.style.display='inline-block';
    authPanel.style.display='none'; detailsPanel.style.display='block';
    userGreet.textContent = 'Привет, ' + cur.email.split('@')[0];
    userEmail.textContent = cur.email;
  } else {
    btnLogin.style.display='inline-block'; btnRegister.style.display='inline-block';
    btnLogout.style.display='none';
    authPanel.style.display='block'; detailsPanel.style.display='none';
    userEmail.textContent = '';
  }
}

function refresh() {
  const q = searchEl.value;
  const byCat = categoryFilter.value;
  let items = store.search(q);
  if (byCat) items = items.filter(p=>p.category===byCat);
  renderList(items);
  // categories
  const cats = store.categories();
  categoryFilter.innerHTML = '<option value="">Все категории</option>' + cats.map(c=>`<option value="${escape(c)}">${escape(c)}</option>`).join('');
}

function renderList(items){
  listEl.innerHTML='';
  if (!items.length) { listEl.textContent = 'Товары не найдены'; return; }
  items.forEach(p=>{
    const el = createProductElement(p, {
      onEdit: (prod)=>{
        idInput.value = prod.id; nameInput.value = prod.name; categoryInput.value = prod.category; priceInput.value = prod.price;
        window.scrollTo({top:0,behavior:'smooth'});
      },
      onDelete: (id) => {
        if (!auth.getCurrent()) { alert('Только авторизованные пользователи могут удалять'); return; }
        if (confirm('Удалить товар?')) { store.delete(id); refresh(); }
      }
    });
    listEl.appendChild(el);
  });
}

function escape(s){ return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }

// Auth form submit - handle login/register
authForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const email = authUsername.value.trim();
  const pw = authPassword.value;
  try{
    if (mode==='login') {
      auth.login({email,password:pw});
      authMsg.textContent = 'Вход успешен';
    } else {
      auth.register({email,password:pw});
      authMsg.textContent = 'Регистрация успешна. Войдите.';
      mode='login'; authTitle.textContent='Вход'; authSubmit.textContent='Войти'; authSwitch.textContent='Перейти к регистрации';
    }
    authUsername.value=''; authPassword.value='';
    setAuthUI();
  } catch(err){
    authMsg.textContent = err.message;
  }
});

authSwitch.addEventListener('click', ()=>{
  if (mode==='login') {
    mode='register'; authTitle.textContent='Регистрация'; authSubmit.textContent='Зарегистрироваться'; authSwitch.textContent='Перейти к входу';
  } else {
    mode='login'; authTitle.textContent='Вход'; authSubmit.textContent='Войти'; authSwitch.textContent='Перейти к регистрации';
  }
  authMsg.textContent='';
});

btnLogin.addEventListener('click', ()=>{ authPanel.style.display='block'; window.scrollTo({top:0,behavior:'smooth'}); });
btnRegister.addEventListener('click', ()=>{ mode='register'; authTitle.textContent='Регистрация'; authSubmit.textContent='Зарегистрироваться'; authSwitch.textContent='Перейти к входу'; authPanel.style.display='block'; window.scrollTo({top:0,behavior:'smooth'}); });
btnLogout.addEventListener('click', ()=>{ auth.logout(); setAuthUI(); refresh(); });

// product form
productForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  if (!auth.getCurrent()) { alert('Только авторизованные пользователи могут добавлять или редактировать'); return; }
  const id = idInput.value;
  const data = { name: nameInput.value.trim(), category: categoryInput.value.trim(), price: Number(priceInput.value) };
  if (!data.name) return alert('Введите название');
  if (id) store.update(id,data); else store.add(data);
  productForm.reset(); idInput.value=''; refresh();
});

clearBtn.addEventListener('click', ()=>{ productForm.reset(); idInput.value=''; });

searchEl.addEventListener('input', ()=>refresh());
categoryFilter.addEventListener('change', ()=>refresh());
addNewBtn.addEventListener('click', ()=>{ if (!auth.getCurrent()) return alert('Войдите чтобы добавлять товары'); productForm.reset(); idInput.value=''; window.scrollTo({top:0,behavior:'smooth'}); });

// initial
setAuthUI();
refresh();

// expose for debugging / tests
export { auth, store };
