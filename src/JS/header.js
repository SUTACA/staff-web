config = JSON.parse(sessionStorage.getItem('config'));

// メニューを閉じる(beforeをクリックした時)
window.addEventListener('click', function (e) {
    var menuItems = document.getElementById('menuItems');
    console.log(e.target);
    if (!e.target.closest('.menu-bar') && !e.target.closest('.menu-items') && menuItems.classList.contains('open')) {
        menuItems.classList.remove('open');
        document.getElementById('background1').style.display = 'none';
    }
});

function closeMenu() {
    menuItems.classList.remove('open');
    document.getElementById('background1').style.display = 'none';
}

function toggleMenu() {
    var menuItems = document.getElementById('menuItems');
    menuItems.classList.toggle('open');
    document.getElementById('background1').style.display = 'block';
}


function logout() {
    closeMenu()
    sessionStorage.removeItem('sessionData');
    location.href = './login.html';
}

function changeLocation(){
    closeMenu()
    Swal.fire({
        title: config.systemMessage.locationMessage1,
        input: 'text',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: config.systemMessage.save,
        cancelButtonText: config.systemMessage.cancel,
        showLoaderOnConfirm: true,
        inputPlaceholder: '現在: '+sessionData1.locationId,

        preConfirm: (locationId) => {
            //16進数かどうかチェック
            if (!/^[0-9A-Fa-f]{1,4}$/.test(locationId)) {
                Swal.showValidationMessage(config.errorMessage.locationError1);
            }
            sessionData1.locationId = locationId;
            sessionStorage.setItem('sessionData', JSON.stringify(sessionData1));
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: config.systemMessage.locationMessage2,
                icon: 'success'
            });
            load();
        }
    });
}

function changeVolume() {
    //音量変更　音量をセッションストレージに保存
    //調整用のポップアップをSweetAlertで表示
    closeMenu()
    Swal.fire({
        title: '音量調整',
        input: 'range',
        inputAttributes: {
            min: 0,
            max: 100,
            step: 1
        },
        inputValue: config.volume == undefined ? 50 : config.volume,
        showCancelButton: true,
        confirmButtonText: config.systemMessage.save,
        cancelButtonText: config.systemMessage.cancel,
        inputAttributes: {
            autocapitalize: 'off'
        },
        preConfirm: (volume) => {
            config.volume = volume;
            sessionStorage.setItem('config', JSON.stringify(config));
        },
        allowOutsideClick: () => !Swal.isLoading()
    });
}