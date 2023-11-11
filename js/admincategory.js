// -------------------- CREATE CATEGORY STARTS----------------------- //

// Fungsi untuk menambah Category
function addCategoryAdmin() {
    var id_category = document.getElementById('id_category').value;
    var name = document.getElementById('name').value;
    var categorydescription = document.getElementById('categorydescription').value;

    var data = {
        id_category: id_category,
        name: name,
        description: categorydescription
    };

    var categoryID = firebase.database().ref().child('category').push().key;

    var updates = {};
    updates['/category/' + categoryID] = data;

    firebase.database().ref().update(updates)
        .then(function () {
            alert('Category created successfully!');
            reloadPage();
        })
        .catch(function (error) {
            console.log(error.message);
            // Untuk menampilkan error
        });
}

function reloadPage() {
    window.location.reload();
}

// Mendengarkan submit form category admin
const categoryadminForm = document.getElementById('categoryadminForm');
if (categoryadminForm) {
    categoryadminForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addCategoryAdmin();
    });
}

// -------------------- CREATE CATEGORY ENDS ----------------------- //


// -------------------- READ CATEGORY STARTS----------------------- //

// Mendapatkan data category dari Firebase dan menampilkan di HTML
var categoryTable = document.getElementById('categoryTable').getElementsByTagName('tbody')[0];

firebase.database().ref('category').on('child_added', function (snapshot) {
    var category = snapshot.val();
    var row = categoryTable.insertRow(-1);
    var idCell = row.insertCell(0);
    var nameCell = row.insertCell(1);
    var descriptionCell = row.insertCell(2);
    var actionCell = row.insertCell(3);

    idCell.innerHTML = category.id_category;
    nameCell.innerHTML = category.name;
    descriptionCell.innerHTML = category.description;

    var buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container'); // Tambahkan kelas CSS 'button-container'

    var editButton = document.createElement('button');
    editButton.innerHTML = 'Edit';
    editButton.classList.add('edit-button');
    editButton.addEventListener('click', function () {
        editCategory(snapshot.key, category);
    });
    buttonContainer.appendChild(editButton);

    var delButton = document.createElement('button');
    delButton.innerHTML = 'Hapus'
    delButton.classList.add('delete-button');
    delButton.addEventListener('click', function () {
        deleteCategory(snapshot.key);
    });
    buttonContainer.appendChild(delButton);

    actionCell.appendChild(buttonContainer);
});

// -------------------- READ CATEGORY ENDS----------------------- //


// -------------------- UPDATE CATEGORY STARTS----------------------- //

// Fungsi untuk mengedit data kategori
function editCategory(categoryID, category) {
    // Menampilkan popup edit
    var editModal = document.getElementById('editModal');
    var editIDInput = document.getElementById('editId_Category');
    var editNameInput = document.getElementById('editName');
    var editCategoryDescriptionInput = document.getElementById('editCategoryDescription');
    var saveEditButton = document.getElementById('saveEditButton');
    var closeButton = document.getElementsByClassName('close')[0]; // Menggunakan kelas 'close' untuk tombol silang
    editIDInput.value = category.id_category;
    editNameInput.value = category.name;
    editCategoryDescriptionInput.value = category.description;

    editModal.style.display = 'block';

    // Fungsi untuk menyimpan perubahan
    function saveEdit() {
        var newID_Category = editIDInput.value;
        var newName = editNameInput.value;
        var newCategoryDescription = editCategoryDescriptionInput.value;

        var updates = {};
        updates['/category/' + categoryID + '/id_category'] = newID_Category;
        updates['/category/' + categoryID + '/name'] = newName;
        updates['/category/' + categoryID + '/description'] = newCategoryDescription;

        firebase.database().ref().update(updates)
            .then(function () {
                alert('Category updated successfully!');
                reloadPage('');
                editModal.style.display = 'none'; // Tutup popup
            })
            .catch(function (error) {
                alert(error.message);
                // Untuk menampilkan error
            });

        // Tutup popup
        editModal.style.display = 'none';
    }

    // Fungsi untuk membatalkan pengeditan
    function cancelEdit() {
        // Tutup popup
        editModal.style.display = 'none';
    }

    // Tambahkan event listener untuk tombol-tombol pada popup
    saveEditButton.addEventListener('click', saveEdit);
    closeButton.addEventListener('click', cancelEdit); // Gunakan closeButton sebagai alternatif tombol "Cancel"
}

// -------------------- UPDATE CATEGORY ENDS----------------------- //


// -------------------- DELETE CATEGORY STARTS----------------------- //

// Fungsi untuk menghapus data kategori
function deleteCategory(categoryID) {
    if (confirm('Apakah anda yakin ingin menghapusnya?')) {
        firebase.database().ref('category').child(categoryID).remove()
            .then(function () {
                alert('Category deleted successfully!');
                reloadPage('');
            })
            .catch(function (error) {
                alert(error.message);
            });
    }
}

// -------------------- DELETE CATEGORY ENDS----------------------- //
