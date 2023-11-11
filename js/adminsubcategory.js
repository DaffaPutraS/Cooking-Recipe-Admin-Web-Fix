// -------------------- CREATE SUB-CATEGORY STARTS----------------------- //

// Fungsi untuk menambah Sub Category
function addSubCategoryAdmin() {
    var idsubcategory = document.getElementById('id_subcategory').value;
    var name = document.getElementById('name').value;
    var subcategorydescription = document.getElementById('subcategorydescription').value;
    var id_category = document.getElementById('categorySelect').value;

    var data = {
        id_subcategory: idsubcategory,
        name: name,
        description: subcategorydescription,
        id_category: id_category
    };

    var subcategoryID = firebase.database().ref().child('subcategory').push().key;

    var updates = {};
    updates['/subcategory/' + subcategoryID] = data;

    firebase.database().ref().update(updates)
        .then(function () {
            alert('Sub-Category created successfully!');
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

// Mendengarkan submit form sub-category admin
const subcategoryadminForm = document.getElementById('subcategoryadminForm');
if (subcategoryadminForm) {
    subcategoryadminForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addSubCategoryAdmin();
    });
}

// -------------------- CREATE SUB-CATEGORY ENDS----------------------- //


// -------------------- READ SUB-CATEGORY STARTS----------------------- //


// Mendapatkan data subcategory dari Firebase dan menampilkan di HTML
var categorySelect = document.getElementById('categorySelect');
firebase.database().ref('category').on('child_added', function (snapshot) {
    var category = snapshot.val();
    var option = document.createElement('option');
    option.value = category.id_category;
    option.text = category.id_category + " - " + category.name;
    categorySelect.appendChild(option);
});

var editCategorySelect = document.getElementById('editCategorySelect');
firebase.database().ref('category').on('child_added', function (snapshot) {
    var category = snapshot.val();
    var option = document.createElement('option');
    option.value = category.id_category;
    option.text = category.id_category + " - " + category.name;
    editCategorySelect.appendChild(option);
});

var subcategoryTable = document.getElementById('subcategoryTable').getElementsByTagName('tbody')[0];

firebase.database().ref('subcategory').on('child_added', function (snapshot) {
    var subcategory = snapshot.val();
    var row = subcategoryTable.insertRow(-1);
    var idCell = row.insertCell(0);
    var nameCell = row.insertCell(1);
    var descriptionCell = row.insertCell(2);
    var categoryCell = row.insertCell(3);
    var actionCell = row.insertCell(4);

    idCell.innerHTML = subcategory.id_subcategory;
    nameCell.innerHTML = subcategory.name;
    descriptionCell.innerHTML = subcategory.description;
    categoryCell.innerHTML = subcategory.id_category;

    var buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');

    var editButton = document.createElement('button');
    editButton.innerHTML = 'Edit';
    editButton.classList.add('edit-button');
    editButton.addEventListener('click', function () {
        editSubcategory(snapshot.key, subcategory);
    });
    buttonContainer.appendChild(editButton);

    var delButton = document.createElement('button');
    delButton.innerHTML = 'Hapus';
    delButton.classList.add('delete-button');
    delButton.addEventListener('click', function () {
        deleteSubcategory(snapshot.key);
    });
    buttonContainer.appendChild(delButton);

    actionCell.appendChild(buttonContainer);
});

// -------------------- READ SUB-CATEGORY ENDS----------------------- //


// -------------------- UPDATE SUB-CATEGORY STARTS----------------------- //


// Fungsi untuk mengedit data subkategori
function editSubcategory(subcategoryID, subcategory) {
    var editModal = document.getElementById('editModal');
    var editIDInput = document.getElementById('editId_Subcategory');
    var editNameInput = document.getElementById('editName');
    var editSubcategoryDescriptionInput = document.getElementById('editSubcategoryDescription');
    var editCategoryInput = document.getElementById('editCategorySelect');
    var saveEditButton = document.getElementById('saveEditButton');
    var closeButton = document.getElementsByClassName('close')[0];
    
    editIDInput.value = subcategory.id_subcategory;
    editNameInput.value = subcategory.name;
    editSubcategoryDescriptionInput.value = subcategory.description;
    editCategoryInput.value = subcategory.id_category;

    editModal.style.display = 'block';

    function saveEdit() {
        var newID_Subcategory = editIDInput.value;
        var newName = editNameInput.value;
        var newSubcategoryDescription = editSubcategoryDescriptionInput.value;
        var newCategory = editCategoryInput.value;

        var updates = {};
        updates['/subcategory/' + subcategoryID + '/id_subcategory'] = newID_Subcategory;
        updates['/subcategory/' + subcategoryID + '/name'] = newName;
        updates['/subcategory/' + subcategoryID + '/description'] = newSubcategoryDescription;
        updates['/subcategory/' + subcategoryID + '/id_category'] = newCategory;

        firebase.database().ref().update(updates)
            .then(function () {
                alert('Sub-category updated successfully!');
                reloadPage('');
                editModal.style.display = 'none';
            })
            .catch(function (error) {
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

// -------------------- UPDATE SUB-CATEGORY ENDS----------------------- //


// -------------------- DELETE SUB-CATEGORY STARTS----------------------- //

// Fungsi untuk menghapus data subkategori
function deleteSubcategory(subcategoryID) {
    if (confirm('Apakah anda yakin ingin menghapusnya?')) {
        firebase.database().ref('subcategory').child(subcategoryID).remove()
            .then(function () {
                alert('Sub-category deleted successfully!');
                reloadPage('');
            })
            .catch(function (error) {
                alert(error.message);
            });
    }
}

// -------------------- DELETE SUB-CATEGORY ENDS----------------------- //
