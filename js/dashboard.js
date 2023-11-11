// Konfigurasi Firebase SDK
var firebaseConfig = {
    // Masukkan konfigurasi Firebase Anda di sini
    apiKey: "AIzaSyDDKW5FbKsbWPv_bIUmzFf-O-yHMsTwKRQ",
    authDomain: "testcoba-cad39.firebaseapp.com",
    databaseURL: "https://testcoba-cad39-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "testcoba-cad39",
    storageBucket: "testcoba-cad39.appspot.com",
    messagingSenderId: "268681879283",
    appId: "1:268681879283:web:977b23ac1fd00a983b2186",
    measurementId: "G-DGWH3YYZJ6"
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
  var database = firebase.database();
  
  // Daftar tabel
  var tables = ['category', 'subcategory', 'creator', 'post', 'users'];
  
  // Dapatkan referensi ke tabel Firebase
  var tableRefs = tables.map(function(tableName) {
    return database.ref(tableName);
  });
  
  // Ambil jumlah data dari setiap tabel dan tampilkan dalam CardView
  tableRefs.forEach(function(tableRef) {
    tableRef.once('value', function(snapshot) {
      var tableData = snapshot.val();
      var tableSize = tableData ? Object.keys(tableData).length : 0;
      createCard(tableRef.key, tableSize);
    });
  });
  
  // Fungsi untuk membuat CardView
  function createCard(tableName, tableSize) {
    var cardContainer = document.getElementById('cardContainer');
  
    var cardview = document.createElement('div');
    cardview.className = 'cardview';
  
    var title = document.createElement('h3');
    title.textContent = tableName;
  
    var size = document.createElement('p');
    size.textContent = 'Jumlah Data: ' + tableSize;
  
    cardview.appendChild(title);
    cardview.appendChild(size);
  
    cardContainer.appendChild(cardview);
  }
