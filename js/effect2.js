// ---------------- EFFECT SIDEBAR STARTS ------------- //

const menu = document.getElementById('menu-label');
const sidebar = document.getElementsByClassName('sidebar')[0];

menu.addEventListener('click', function() {
    sidebar.classList.toggle('hide');
    console.log('ok');
})

// ---------------- EFFECT SIDEBAR ENDS ------------- //