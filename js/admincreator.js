// -------------------- CREATE CREATOR STARTS----------------------- //

// Fungsi untuk menambah Creator
function addCreatorAdmin() {
    var idcreator = document.getElementById('id_creator').value;
    var name = document.getElementById('name').value;
    var creatordescription = document.getElementById('creatordescription').value;

    var data = {
        id_creator: idcreator,
        name: name,
        description: creatordescription
    };

    var creatorID = firebase.database().ref().child('creator').push().key;

    var updates = {};
    updates['/creator/' + creatorID] = data;

    firebase.database().ref().update(updates)
        .then(function () {
            alert('Creator created successfully!');
            reloadPage();
        })
        .catch(function (error) {
            console.log(error.message);
        });
}

function reloadPage() {
    window.location.reload();
}

// Mendengarkan submit form creator admin
const creatoradminForm = document.getElementById('creatoradminForm');
if (creatoradminForm) {
    creatoradminForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addCreatorAdmin();
    });
}

// -------------------- CREATE CREATOR ENDS ----------------------- //


// -------------------- READ CREATOR STARTS----------------------- //

// Mendapatkan data creator dari Firebase dan menampilkan di HTML
var creatorTable = document.getElementById('creatorTable').getElementsByTagName('tbody')[0];

firebase.database().ref('creator').on('child_added', function (snapshot) {
    var creator = snapshot.val();
    var row = creatorTable.insertRow(-1);
    var idCell = row.insertCell(0);
    var nameCell = row.insertCell(1);
    var descriptionCell = row.insertCell(2);
    var actionCell = row.insertCell(3);

    idCell.innerHTML = creator.id_creator;
    nameCell.innerHTML = creator.name;
    descriptionCell.innerHTML = creator.description;

    var buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');

    var editButton = document.createElement('button');
    editButton.innerHTML = 'Edit';
    editButton.classList.add('edit-button');
    editButton.addEventListener('click', function () {
        editCreator(snapshot.key, creator);
    });
    buttonContainer.appendChild(editButton);

    var delButton = document.createElement('button');
    delButton.innerHTML = 'Hapus';
    delButton.classList.add('delete-button');
    delButton.addEventListener('click', function () {
        deleteCreator(snapshot.key);
    });
    buttonContainer.appendChild(delButton);

    actionCell.appendChild(buttonContainer);
});

// -------------------- READ CREATOR ENDS ----------------------- //


// -------------------- UPDATE CREATOR STARTS----------------------- //


// Fungsi untuk mengedit data creator
function editCreator(creatorID, creator) {
    var editModal = document.getElementById('editModal');
    var editIDInput = document.getElementById('editId_Creator')
    var editNameInput = document.getElementById('editName');
    var editCreatorDescriptionInput = document.getElementById('editCreatorDescription');
    var saveEditButton = document.getElementById('saveEditButton');
    var closeButton = document.getElementsByClassName('close')[0];

    editIDInput.value = creator.id_creator;
    editNameInput.value = creator.name;
    editCreatorDescriptionInput.value = creator.description;

    editModal.style.display = 'block';

    function saveEdit() {
        var newID_Creator = editIDInput.value;
        var newName = editNameInput.value;
        var newCreatorDescription = editCreatorDescriptionInput.value;

        var updates = {};
        updates['/creator/' + creatorID + '/id_creator'] = newID_Creator;
        updates['/creator/' + creatorID + '/name'] = newName;
        updates['/creator/' + creatorID + '/description'] = newCreatorDescription;

        firebase.database().ref().update(updates)
            .then(function () {
                alert('Creator updated successfully!');
                editModal.style.display = 'none';
                reloadPage('');
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

// -------------------- UPDATE CREATOR ENDS----------------------- //


// -------------------- DELETE CREATOR STARTS----------------------- //


// Fungsi untuk menghapus data creator
function deleteCreator(creatorID) {
    if (confirm('Apakah anda yakin ingin menghapusnya?')) {
        firebase.database().ref('creator').child(creatorID).remove()
            .then(function () {
                alert('Creator deleted successfully!');
                reloadPage('');
            })
            .catch(function (error) {
                alert(error.message);
            });
    }
}


// -------------------- DELETE CREATOR ENDS ----------------------- //
