// メニューを閉じる
window.addEventListener('click', function (e) {
    var menuItems = document.getElementById('menuItems');
    if (!e.target.closest('.menu-bar') && !e.target.closest('.menu-items') && menuItems.classList.contains('open')) {
        menuItems.classList.remove('open');
    }
});

function toggleMenu() {
    var menuItems = document.getElementById('menuItems');
    menuItems.classList.toggle('open');
}


function logout() {
    sessionStorage.removeItem('sessionData');
    location.href = './login.html';
}