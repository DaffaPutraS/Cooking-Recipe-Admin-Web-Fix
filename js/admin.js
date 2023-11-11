// -------------------- KONFIGURASI STARTS----------------------- //

// Konfigurasi Firebase
const firebaseConfig = {
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
  
  // Referensi Realtime Database
  const database = firebase.database();
  
// -------------------- KONFIGURASI ENDS----------------------- //
  

// -------------------- LOGIN STARTS----------------------- //

// Fungsi untuk login
function adminlogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((adminCredential) => {
        // Mendapatkan email pengguna yang berhasil login
        const loggedInEmail = adminCredential.user.email;
  
        if (loggedInEmail === 'haikalafifsyah@gmail.com') {
          // Mengarahkan pengguna ke halaman adminregister.html
          alert('Welcome Super Admin!');
          window.location.href = 'adminregister.html';
        } else {
          // Mengarahkan pengguna ke halaman adminpanel.html
          alert('Login Sucsessful');
          window.location.href = 'adminpanel.html';
        }
      })
      .catch((error) => {
        const errorMessage = error.message;
        alert(errorMessage);
      });
  }
  
  
  // Mendengarkan submit form login
  const adminloginForm = document.getElementById('adminloginForm');
  if (adminloginForm) {
    adminloginForm.addEventListener('submit', adminlogin);
  }
  
  // -------------------- LOGIN ENDS----------------------- //
  


  // -------------------- LOGOUT STARTS ------------------ //

// Fungsi untuk logout
function logout() {
  firebase.auth().signOut()
    .then(() => {
      // Mengganti URL dengan halaman login setelah logout
      window.history.replaceState({}, '', 'adminlogin.html');
      // Mengarahkan pengguna ke halaman login
      window.location.href = 'adminlogin.html';
    })
    .catch((error) => {
      console.log(error);
    });
}


// -------------------- LOGOUT ENDS ------------------ //




// -------------------- REGISTER STARTS----------------------- //


// Fungsi untuk register akun admin
function registerAdmin(event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Menyimpan data register ke tabel admins di Realtime Database
      const user = userCredential.user;
      const adminData = {
        name: name,
        email: email,
        password: password
      };
      // Simpan data register di Realtime Database Firebase
      database.ref('admins/' + user.uid).set(adminData)
        .then(() => {
          alert('Registration successful!');
          window.location.href = 'adminlogin.html'; // Mengarahkan ke halaman login admin setelah register
        })
        .catch((error) => {
          const errorMessage = error.message;
          alert(errorMessage);
        });
    })
    .catch((error) => {
      const errorMessage = error.message;
      alert(errorMessage);
    });
}

// Mendengarkan submit form register admin
const registeradminForm = document.getElementById('registeradminForm');
if (registeradminForm) {
  registeradminForm.addEventListener('submit', registerAdmin);
}

// -------------------- REGISTER ENDS----------------------- //




// -------------------- FORGOT AND RESET STARTS----------------------- //

// Fungsi untuk mengupdate password pada Realtime Database
function resetForm(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const newName = document.getElementById('name').value;
  const newPassword = document.getElementById('newPassword').value;

  // Mengambil referensi pengguna berdasarkan email
  const adminsRef = database.ref('admins');
  adminsRef.orderByChild('email').equalTo(email).once('value', (snapshot) => {
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const userId = childSnapshot.key;
        // Mengupdate password pengguna
        adminsRef.child(userId).update({ name: newName });
        adminsRef.child(userId).update({ password: newPassword });
      });
      alert('Password updated successfully!');
      window.location.href = 'adminlogin.html'; // Redirect ke halaman login setelah mengupdate password
    } else {
      alert('Email not found!');
    }
  });
}

// Menggunakan event listener untuk mengupdate password saat form disubmit
const resetadminForm = document.getElementById('resetadminForm');
if (resetadminForm) {
  resetadminForm.addEventListener('submit', resetForm);
}

// -------------------- FORGOT AND RESET ENDS----------------------- //