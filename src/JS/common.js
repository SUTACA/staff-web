//config.jsonからバージョン情報を取得
fetch('./src/config.json')
    .then(response => {
        return response.json();
    })
    .then(data => {
        //セッションに保存
        sessionStorage.setItem('config', JSON.stringify(data));
        document.querySelector('.version').textContent = 'v' + data.version;
    });


function toggleMenu() {
    var menuItems = document.getElementById('menuItems');
    menuItems.classList.toggle('open');
}
// メニューを閉じる
window.addEventListener('click', function (e) {
    var menuItems = document.getElementById('menuItems');
    if (!e.target.closest('.menu-bar') && !e.target.closest('.menu-items') && menuItems.classList.contains('open')) {
        menuItems.classList.remove('open');
    }
});

//セッションデータ
var sessionData = {
    //初期値
    "userId": "0",
    "userName": "username",
    "userIcon": "./src/img/sutaca/icom/sutaca_icom.png",
    //admin,leader,user
    "userRole": "user",
    "loginFlg": false,
    //セッションの現時間から有効期限（5分)
    "sessionExpire": new Date().getTime() + 300000,

    "data": {},
    "volume": 0.5,

};
//login.html以外だったら実行
if (location.pathname != '/login.html') {
    fetch("./header.html")
        .then((response) => response.text())
        .then((data) => document.querySelector("#header").innerHTML = data);

    //セッションデータの取得
    if (sessionStorage.getItem('sessionData')) {
        if (sessionData.sessionExpire < new Date().getTime()) {
            //セッションの有効期限が切れている場合
            sessionStorage.removeItem('sessionData');
            location.href = './login.html?error=2';
        }
        sessionData = JSON.parse(sessionStorage.getItem('sessionData'));
        //セッションの有効期限を更新
        sessionData.sessionExpire = new Date().getTime() + 300000;
        sessionStorage.setItem('sessionData', JSON.stringify(sessionData));
        //メインコンテンツの表示
        location.href = './index.html';
    } else {
        //ログインページにリダイレクト
        location.href = './login.html';
    }
}