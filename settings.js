/* Storage helper. */
const Store={
  get(k,d){try{const v=localStorage.getItem('mp_'+k);return v===null?d:JSON.parse(v)}catch{return d}},
  set(k,v){try{localStorage.setItem('mp_'+k,JSON.stringify(v))}catch{}},
  del(k){try{localStorage.removeItem('mp_'+k)}catch{}}
};
