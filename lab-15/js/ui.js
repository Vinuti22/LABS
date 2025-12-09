export function createProductElement(product, {onEdit,onDelete}){
  const li=document.createElement('li'); li.className='product-item';
  const left=document.createElement('div'); left.innerHTML=`<strong>${escape(product.name)}</strong><div class="meta">${escape(product.category)} — ${product.price} ₸</div>`;
  const actions=document.createElement('div'); actions.className='actions';
  const edit=document.createElement('button'); edit.textContent='Изменить'; edit.className='btn ghost'; edit.addEventListener('click',()=>onEdit(product));
  const del=document.createElement('button'); del.textContent='Удалить'; del.className='btn ghost'; del.addEventListener('click',()=>onDelete(product.id));
  actions.append(edit,del); li.append(left,actions); return li;
}
function escape(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);}
