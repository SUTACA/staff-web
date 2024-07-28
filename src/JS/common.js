fetch("./header.html")
.then((response) => response.text())
.then((data) => {if(location.pathname != '/login.html'){document.querySelector("#header").innerHTML = data}});

//config.jsonからバージョン情報を取得
fetch('./src/config.json')
    .then(response => {
        return response.json();
    })
    .then(data => {
        //セッションに保存
        sessionStorage.setItem('config', JSON.stringify(data));
        document.querySelector('title').textContent = data.siteTitle + " | " + document.querySelector('title').textContent;
        document.querySelector('.version').textContent = 'v' + data.version;
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
    //セッションの現時間から有効期限を設定
    "sessionExpire":"",
    "data": {},
    "loginTime": "",
    "volume": 0.5,

};
//login.html以外だったら実行
if (location.pathname != '/login.html') {
    //セッションデータの取得
    if (sessionStorage.getItem('sessionData')) {
        sessionData = JSON.parse(sessionStorage.getItem('sessionData'));
        //セッションの有効期限が切れている場合
        if (sessionData.sessionExpire <= new Date().getTime()) {
            sessionStorage.removeItem('sessionData');
            location.href = './login.html?error=2';
        }else{
        //セッションの有効期限を更新
        sessionData.sessionExpire = (new Date().getTime()+JSON.parse(sessionStorage.getItem('config')).loginSessionTime*60000);
        sessionData.sessionExpire2 = new Date(sessionData.sessionExpire).toLocaleString();
        sessionStorage.setItem('sessionData', JSON.stringify(sessionData));
        }
        //メインコンテンツの表示
        if(location.pathname != '/index.html'){
            location.href = './index.html';
  
        }
    } else {
        //ログインページにリダイレクト
        location.href = './login.html';
    }
}