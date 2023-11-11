// -------------------- CREATE CREATOR STARTS----------------------- //

// Fungsi untuk menambah Creator
// function addCreatorAdmin() {
//     var idcreator = document.getElementById('id_creator').value;
//     var name = document.getElementById('name').value;
//     var creatordescription = document.getElementById('creatordescription').value;

//     var data = {
//         id_creator: idcreator,
//         name: name,
//         description: creatordescription
//     };

//     var creatorID = firebase.database().ref().child('creator').push().key;

//     var updates = {};
//     updates['/creator/' + creatorID] = data;

//     firebase.database().ref().update(updates)
//         .then(function () {
//             alert('Creator created successfully!');
//             reloadPage();
//         })
//         .catch(function (error) {
//             console.log(error.message);
//         });
// }

// function reloadPage() {
//     window.location.reload();
// }

// // Mendengarkan submit form creator admin
// const creatoradminForm = document.getElementById('creatoradminForm');
// if (creatoradminForm) {
//     creatoradminForm.addEventListener('submit', function (event) {
//         event.preventDefault();
//         addCreatorAdmin();
//     });
// }

// -------------------- CREATE CREATOR ENDS ----------------------- //


// -------------------- READ CREATOR STARTS----------------------- //

// Mendapatkan data creator dari Firebase dan menampilkan di HTML
var usersTable = document.getElementById('usersTable').getElementsByTagName('tbody')[0];

firebase.database().ref('users').on('child_added', function (snapshot) {
    var user = snapshot.val();
    var row = creatorTable.insertRow(-1);
    var uidCell = row.insertCell(0);
    var nameCell = row.insertCell(1);
    var emailCell = row.insertCell(2);
    var passwordCell = row.insertCell(3);
    var actionCell = row.insertCell(4);

    uidCell.innerHTML = user.uid_users;
    nameCell.innerHTML = user.name;
    emailCell.innerHTML = user.email;
    passwordCell.innerHTML = user.password;

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
    delButton.innerHTML = 'Delete';
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
function editCreator(usersID, users) {
    var editModal = document.getElementById('editModal');
    var editIDInput = document.getElementById('editId_Users')
    var editNameInput = document.getElementById('editName');
    var editUsersEmailInput = document.getElementById('editUsersEmail');
    var saveEditButton = document.getElementById('saveEditButton');
    var closeButton = document.getElementsByClassName('close')[0];

    editIDInput.value = users.id_users;
    editNameInput.value = users.name;
    editEmailInput.value = users.email;
    editPasswordInput.value = users.password;

    editModal.style.display = 'block';

    function saveEdit() {
        var newID_Users = editIDInput.value;
        var newName = editNameInput.value;
        var newUsersEmail = editUsersEmailInput.value;
        var newUsersPassword = editUsersPasswordInput.value;

        var updates = {};
        updates['/users/' + usersID + '/id_users'] = newID_Users;
        updates['/users/' + usersID + '/name'] = newName;
        updates['/users/' + usersID + '/email'] = newUsersEmail;
        updates['/users/' + usersID + '/password'] = newUsersPassword;

        firebase.database().ref().update(updates)
            .then(function () {
                alert('Users updated successfully!');
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
function deleteUsers(usersID) {
    if (confirm('Apakah anda yakin ingin menghapusnya?')) {
        firebase.database().ref('users').child(usersID).remove()
            .then(function () {
                alert('Users deleted successfully!');
                reloadPage('');
            })
            .catch(function (error) {
                alert(error.message);
            });
    }
}


// -------------------- DELETE CREATOR ENDS ----------------------- //
