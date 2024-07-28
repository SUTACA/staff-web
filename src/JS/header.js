// メニューを閉じる(beforeをクリックした時)
window.addEventListener('click', function (e) {
    var menuItems = document.getElementById('menuItems');
    console.log(e.target);
    if (!e.target.closest('.menu-bar') && !e.target.closest('.menu-items') && menuItems.classList.contains('open')) {
        menuItems.classList.remove('open');
        document.getElementById('background1').style.display = 'none';
    }
});

function toggleMenu() {
    var menuItems = document.getElementById('menuItems');
    menuItems.classList.toggle('open');
    document.getElementById('background1').style.display = 'block';
}


function logout() {
    sessionStorage.removeItem('sessionData');
    location.href = './login.html';
}

function changeVolume() {
    //vol.調整ポップアップ
    var volumePopup = document.getElementById('volumePopup');
    volumePopup.classList.toggle('open');

    //音量調整
    var volume = document.getElementById('volume');
    var bgm = document.getElementById('bgm');
    volume.oninput = function () {
        bgm.volume = volume.value / 100;
    }

    //音量調整ポップアップを閉じる
    var closeVolumePopup = document.getElementById('closeVolumePopup');
    closeVolumePopup.onclick = function () {
        volumePopup.classList.remove('open');
    }
    
}