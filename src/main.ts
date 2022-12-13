import { createApp } from 'vue';
import './style.css';
import App from './App.vue';

createApp(App).mount('#app');

/*
*
*  onMounted(async () => {
   const request = indexedDB.open('archive');
   request.onupgradeneeded = (e: IDBVersionChangeEvent) => {
     console.log(e);
     let db: IDBDatabase = e.target?.result;
     console.log(db.objectStoreNames);

     db.createObjectStore('temperature', {keyPath: 't'});
     getData<ItemData>('../data/temperature.json').then(res=>{
       return new Promise((resolve, reject) => {
         let tx = db.transaction(['temperature'], 'readwrite');
         tx.oncomplete = () => {
           console.log(db.objectStoreNames);
           resolve();
         };
         let store = tx.objectStore('temperature');
         res.forEach(item => {
           store.add(item);
         })
       });
     });
   };
   //        precipitation.value = await getData<ItemData>('../data/precipitation.json');
 });
*
*
* */
