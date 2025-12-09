import { save, load, STORAGE_PRODUCTS } from './storage.js';

function id() { return Date.now().toString(36) + Math.random().toString(36).slice(2,7); }

export class ProductStore {
  constructor() {
    this.map = new Map();
    const saved = load(STORAGE_PRODUCTS);
    if (Array.isArray(saved)) saved.forEach(p=>this.map.set(p.id,p));
    else {
      const samples=[{id:id(),name:'Наушники Razer',category:'Аксессуары',price:45000},
      {id:id(),name:'Power Bank',category:'Аксессуары',price:12000},
      {id:id(),name:'Смартфон X',category:'Телефоны',price:180000}];
      samples.forEach(s=>this.map.set(s.id,s));
      this._persist();
    }
  }
  _persist(){ save(STORAGE_PRODUCTS, Array.from(this.map.values())); }
  add({name,category,price}){ const p={id:id(),name,category,price:Number(price)}; this.map.set(p.id,p); this._persist(); return p; }
  update(id,{name,category,price}){ if(!this.map.has(id))return null; const p={id,name,category,price:Number(price)}; this.map.set(id,p); this._persist(); return p; }
  delete(id){ const r=this.map.delete(id); this._persist(); return r; }
  getAll(){ return Array.from(this.map.values()); }
  findById(id){ return this.map.get(id)||null; }
  search(q){ const s=String(q||'').trim().toLowerCase(); if(!s) return this.getAll(); return this.getAll().filter(p=>p.name.toLowerCase().includes(s)||p.category.toLowerCase().includes(s)); }
  categories(){ return Array.from(new Set(this.getAll().map(p=>p.category))); }
}
