//エラーメッセージ表示?error=2
if (location.search) {
    var error = location.search.split('=')[1];
    if(error == 1){
        document.querySelector('.error').innerHTML = 'ログインに失敗しました。<br>アカウント情報を確認してください。';
    }
    if (error == 2) {
        document.querySelector('.error').innerHTML = 'セッションの有効期限が切れました。<br>再度ログインしてください。';
    }

    //sessionStorageのログインエラー回数を追加,ログイン失敗時間もセット（なければ作成1をセット）
    if(sessionStorage.getItem('loginError')){
        var loginError = Number(sessionStorage.getItem('loginError')) + 1;
        sessionStorage.setItem('loginError', loginError);
        sessionStorage.setItem('loginErrorTime', new Date().getTime());
    }
    else{
        sessionStorage.setItem('loginError', 1);
        sessionStorage.setItem('loginErrorTime', new Date().getTime());
    }

    console.log("エラー回数",sessionStorage.getItem('loginError'));
    console.log("エラー時間",sessionStorage.getItem('loginErrorTime'));

    //URLからパラメータを削除
    history.replaceState('', '', location.pathname);
}

if (sessionStorage.getItem('sessionData')) {
    if(sessionData.sessionExpire < new Date().getTime()){
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
}

//ログイン失敗回数が3回以上かつログイン失敗時間が10分以内の場合、アカウントロック

var config = JSON.parse(sessionStorage.getItem('config')); 
console.info(config)
if(sessionStorage.getItem('loginError') >= 5){
    if(new Date().getTime() - Number(sessionStorage.getItem('loginErrorTime')) < config.loginAttemptTime*60000){
        document.querySelector('.error').innerHTML = `アカウントがロックされています。<br>${config.loginAttemptTime}分後に再度ログインしてください。`;
        document.querySelector('.login').style.display = 'none';
    }
    else{
        sessionStorage.removeItem('loginError');
        sessionStorage.removeItem('loginErrorTime');
    }
}else if(sessionStorage.getItem('loginError') >config.loginAttempt-3){
    document.querySelector('.error').innerHTML += '<br>あと'+(config.loginAttempt-Number(sessionStorage.getItem('loginError')))+'回失敗するとアカウントがロックされます。';
}


function login() {


}