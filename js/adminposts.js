function reloadPage() {
    window.location.reload();
}

// ---------------------- CREATE POSTS STARTS-------------------- //

// Fungsi untuk menambah Post
function addPostAdmin() {
    var id_post = document.getElementById('id_post').value;
    var postName = document.getElementById('postName').value;
    var id_subcategory = document.getElementById('subcategorySelect').value;
    var ingredients = document.getElementById('ingredients').value;
    var steps = document.getElementById('steps').value;
    var imageFile = document.getElementById('imageFile').files[0];
    var id_creator = document.getElementById('creatorSelect').value;
    var admin = document.getElementById('adminSelect').value;

    // Upload file gambar ke Firebase Storage
    var storageRef = firebase.storage().ref('post_images/' + imageFile.name);
    storageRef.put(imageFile)
        .then(function (snapshot) {
            return snapshot.ref.getDownloadURL();
        })
        .then(function (imageURL) {
            // Buat objek data post
            var postData = {
                id_post: id_post,
                name: postName,
                id_subcategory: id_subcategory,
                ingredients: ingredients,
                steps: steps,
                image: imageURL,
                id_creator: id_creator,
                admin: admin
            };

            var postID = firebase.database().ref().child('post').push().key;

            var updates = {};
            updates['/post/' + postID] = postData;

            firebase.database().ref().update(updates)
                .then(function () {
                    alert('Post created successfully!');
                    reloadPage();
                })
                .catch(function (error) {
                    console.log(error.message);
                    // Untuk menampilkan error
                });
        })
        .catch(function (error) {
            console.log(error.message);
            // Untuk menampilkan error
        });
}

// Mendengarkan submit form post admin
const postAdminForm = document.getElementById('postAdminForm');
if (postAdminForm) {
    postAdminForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addPostAdmin();
    });
}

// ---------------------- CREATE POSTS ENDS-------------------- //


// ---------------------- INPUT OPTION ADMIN SAME AS LOGIN STARTS ------------------ //

// Mengisi select option dengan admin yang sedang login
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        const loggedInAdminEmail = user.email; // Ganti dengan properti email yang sesuai jika tersedia

        // Mendapatkan data pengguna dari Realtime Database
        var adminsRef = firebase.database().ref('admins');
        adminsRef.orderByChild('email').equalTo(loggedInAdminEmail).once('value', function(snapshot) {
            // Menghapus opsi admin sebelumnya
            var adminSelect = document.getElementById('adminSelect');
            while (adminSelect.firstChild) {
                adminSelect.removeChild(adminSelect.firstChild);
            }

            snapshot.forEach(function(childSnapshot) {
                var admin = childSnapshot.val();
                var adminName = admin.name;
                
                // Mengisi select option dengan admin yang sedang login
                var option = document.createElement('option');
                option.value = adminName;
                option.text = adminName;
                adminSelect.appendChild(option);
                adminSelect.disabled = true; // Membuat select option tidak dapat diubah
            });
        });
    }
});

// ---------------------- INPUT OPTION ADMIN SAME AS LOGIN ENDS ------------------ //


// ---------------------- READ POSTS STARTS-------------------- //

// Mendapatkan data subcategory dari Firebase dan menampilkan di dropdown
var subcategorySelect = document.getElementById('subcategorySelect');
firebase.database().ref('subcategory').on('child_added', function (snapshot) {
    var subcategory = snapshot.val();
    var option = document.createElement('option');
    option.value = subcategory.id_subcategory;
    option.text = subcategory.id_subcategory + " - " + subcategory.name;
    subcategorySelect.appendChild(option);
});

// Mendapatkan data creator dari Firebase dan menampilkan di dropdown
var creatorSelect = document.getElementById('creatorSelect');
firebase.database().ref('creator').on('child_added', function (snapshot) {
    var creator = snapshot.val();
    var option = document.createElement('option');
    option.value = creator.id_creator;
    option.text = creator.id_creator + " - " + creator.name;
    creatorSelect.appendChild(option);
});

// Mendapatkan data admin dari Firebase dan menampilkan di dropdown
var adminSelect = document.getElementById('adminSelect');
firebase.database().ref('admins').on('child_added', function (snapshot) {
    var admin = snapshot.val();
    var option = document.createElement('option');
    option.value = admin.name;
    option.text = admin.name;
    adminSelect.appendChild(option);
});

var editSubcategorySelect = document.getElementById('editSubcategorySelect');
firebase.database().ref('subcategory').on('child_added', function (snapshot) {
    var subcategory = snapshot.val();
    var option = document.createElement('option');
    option.value = subcategory.id_subcategory;
    option.text = subcategory.id_subcategory + " - " + subcategory.name;
    editSubcategorySelect.appendChild(option);
});

var editCreatorSelect = document.getElementById('editCreatorSelect');
firebase.database().ref('creator').on('child_added', function (snapshot) {
    var creator = snapshot.val();
    var option = document.createElement('option');
    option.value = creator.id_creator;
    option.text = creator.id_creator + " - " + creator.name;
    editCreatorSelect.appendChild(option);
});

var editAdminSelect = document.getElementById('editAdminSelect');
firebase.database().ref('admins').on('child_added', function (snapshot) {
    var admin = snapshot.val();
    var option = document.createElement('option');
    option.value = admin.name;
    option.text = admin.name;
    editAdminSelect.appendChild(option);
});

// Mendapatkan data post dari Firebase dan menampilkan di tabel
var postTable = document.getElementById('postTable').getElementsByTagName('tbody')[0];

firebase.database().ref('post').on('child_added', function (snapshot) {
    var post = snapshot.val();
    var row = postTable.insertRow(-1);
    var idCell = row.insertCell(0);
    var nameCell = row.insertCell(1);
    var subcategoryCell = row.insertCell(2);
    var ingredientsCell = row.insertCell(3);
    var stepsCell = row.insertCell(4);
    var imageCell = row.insertCell(5);
    var creatorCell = row.insertCell(6);
    var adminCell = row.insertCell(7);
    var actionCell = row.insertCell(8);

    idCell.innerHTML = post.id_post;
    nameCell.innerHTML = post.name;
    subcategoryCell.innerHTML = post.id_subcategory;
    ingredientsCell.innerHTML = post.ingredients;
    stepsCell.innerHTML = post.steps;
    imageCell.innerHTML = "<img src='" + post.image + "' style='width:100px;height:100px;'>";
    creatorCell.innerHTML = post.id_creator;
    adminCell.innerHTML = post.admin;

    var buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');

    var editButton = document.createElement('button');
    editButton.innerHTML = 'Edit';
    editButton.classList.add('edit-button');
    editButton.addEventListener('click', function () {
        editPost(snapshot.key, post);
    });
    buttonContainer.appendChild(editButton);

    var delButton = document.createElement('button');
    delButton.innerHTML = 'Hapus';
    delButton.classList.add('delete-button');
    delButton.addEventListener('click', function () {
        deletePosts(snapshot.key);
    });
    buttonContainer.appendChild(delButton);

    actionCell.appendChild(buttonContainer);
});

// ---------------------- READ POSTS ENDS-------------------- //



// ---------------------- UPDATE POSTS STARTS-------------------- //

function editPost(postID, post) {
    var editModal = document.getElementById('editModal');
    var editIDInput = document.getElementById('editId_Post');
    var editPostNameInput = document.getElementById('editPostName');
    var editSubcategorySelect = document.getElementById('editSubcategorySelect');
    var editIngredientsTextarea = document.getElementById('editIngredients');
    var editStepsTextarea = document.getElementById('editSteps');
    var editImageFileInput = document.getElementById('editImageFile');
    var editCreatorSelect = document.getElementById('editCreatorSelect');
    var editAdminSelect = document.getElementById('editAdminSelect');
    var saveEditButton = document.getElementById('saveEditButton');
    var closeButton = document.getElementsByClassName('close')[0];
    editIDInput.value = post.id_post;
    editPostNameInput.value = post.name;
    editSubcategorySelect.value = post.id_subcategory;
    editIngredientsTextarea.value = post.ingredients;
    editStepsTextarea.value = post.steps;
    editCreatorSelect.value = post.id_creator;
    editAdminSelect.value = post.admin;

    editModal.style.display = 'block';

    function saveEdit() {
        var newID_Post = editIDInput.value;
        var newName = editPostNameInput.value;
        var newSubcategory = editSubcategorySelect.value;
        var newIngredients = editIngredientsTextarea.value;
        var newSteps = editStepsTextarea.value;
        var newImageFile = editImageFileInput.files[0];
        var newCreator = editCreatorSelect.value;
        var newAdmin = editAdminSelect.value;
    
        // Mengambil referensi ke node yang akan diperbarui di Firebase Realtime Database
        var postRef = firebase.database().ref('post/' + postID);
    
        // Membuat objek untuk menyimpan data yang akan diperbarui pada Firebase Realtime Database
        var postData = {
            id_post: newID_Post,
            name: newName,
            id_subcategory: newSubcategory,
            ingredients: newIngredients,
            steps: newSteps,
            id_creator: newCreator,
            admin: newAdmin
        };
    
        // Mengupload gambar baru ke Firebase Storage jika ada
        if (newImageFile) {
            // Mendapatkan referensi ke lokasi penyimpanan gambar baru
            var storageRef = firebase.storage().ref().child('post_images/' + postID);
    
            // Upload gambar baru ke Firebase Storage
            storageRef.put(newImageFile)
                .then(function () {
                    // Mendapatkan URL gambar yang diunggah
                    return storageRef.getDownloadURL();
                })
                .then(function (downloadURL) {
                    // Memperbarui data gambar di Firebase Realtime Database
                    return postRef.update({
                        image: downloadURL
                    });
                })
                .then(function () {
                    // Tampilkan pesan sukses
                    alert('Image updated successfully!');
                })
                .catch(function (error) {
                    // Tampilkan pesan error jika terjadi kesalahan
                    alert(error.message);
                });
        }
    
        // Memperbarui data tabel lainnya di Firebase Realtime Database
        postRef.update(postData)
            .then(function () {
                // Tampilkan pesan sukses dan tutup modal
                alert('Post updated successfully!');
                editModal.style.display = 'none';
                reloadPage('');
            })
            .catch(function (error) {
                // Tampilkan pesan error jika terjadi kesalahan
                alert(error.message);
            });
    
        editModal.style.display = 'none';
    }

    function cancelEdit() {
        editModal.style.display = 'none';
    }

    saveEditButton.addEventListener('click', saveEdit);
    closeButton.addEventListener('click', cancelEdit);
}

// ---------------------- UPDATE POSTS ENDS-------------------- //


// ---------------------- DELETE POSTS STARTS-------------------- //


// Fungsi untuk menghapus data post
function deletePosts(postID) {
    if (confirm('Apakah Anda yakin ingin menghapusnya?')) {
        database.ref('post').child(postID).remove()
            .then(function () {
                alert('Post deleted successfully!');
                reloadPage('');
            })
            .catch(function (error) {
                alert(error.message);
            });
    }
}

// ---------------------- DELETE POSTS ENDS-------------------- //
