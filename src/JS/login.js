const config = JSON.parse(sessionStorage.getItem('config'));

//エラーメッセージ表示
if (location.search) {
    var error = location.search.split('=')[1];
    if (error == 1) {
        document.querySelector('.error').innerHTML = config.errorMessage.loginError1;
    }
    if (error == 2) {
        document.querySelector('.error').innerHTML = config.errorMessage.loginError2;
    }
    if (error == 3) {
        document.querySelector('.error').innerHTML = config.errorMessage.loginError3;
    }

    //sessionStorageのログインエラー回数を追加,ログイン失敗時間もセット（なければ作成1をセット）
    if (sessionStorage.getItem('loginError')) {
        var loginError = Number(sessionStorage.getItem('loginError')) + 1;
        sessionStorage.setItem('loginError', loginError);
        sessionStorage.setItem('loginErrorTime', new Date().getTime());
    }
    else {
        sessionStorage.setItem('loginError', 1);
        sessionStorage.setItem('loginErrorTime', new Date().getTime());
    }

    console.log("エラー回数", sessionStorage.getItem('loginError'));
    console.log("エラー時間", sessionStorage.getItem('loginErrorTime'));

    //URLからパラメータを削除
    history.replaceState('', '', location.pathname);
}


//セッションデータ
if (sessionStorage.getItem('sessionData')) {

    sessionData = JSON.parse(sessionStorage.getItem('sessionData'));
    if (sessionData.sessionExpire < new Date().getTime()) {
        //セッションの有効期限が切れている場合
        sessionStorage.removeItem('sessionData');
        location.href = './login.html?error=2';
    }
    //セッションの有効期限を更新
    sessionData.sessionExpire = new Date().getTime() + 300000;
    sessionStorage.setItem('sessionData', JSON.stringify(sessionData));
    //メインコンテンツの表示
    location.href = './index.html';
}


//ログイン失敗回数が3回以上かつログイン失敗時間が10分以内の場合、アカウントロック
if (sessionStorage.getItem('loginError') >= config.loginAttempt) {
    if (new Date().getTime() - Number(sessionStorage.getItem('loginErrorTime')) < config.loginAttemptTime * 60000) {
        document.querySelector('.error').innerHTML = `アカウントがロックされています。<br>${config.loginAttemptTime}分後に再度ログインしてください。`;
        document.querySelector('.login').style.display = 'none';
        document.querySelector('.error').style.marginBottom = '200px';
    }
    else {
        sessionStorage.removeItem('loginError');
        sessionStorage.removeItem('loginErrorTime');
    }
} else if (sessionStorage.getItem('loginError') > config.loginAttempt - 3) {
    document.querySelector('.error').innerHTML += '<br>あと' + (config.loginAttempt - Number(sessionStorage.getItem('loginError'))) + '回失敗するとアカウントがロックされます。';
}

//.telに電話番号をリンク（href="tel:000-0000-0000"）
document.querySelector('.tel').href = 'tel:' + config.organization.tel;
document.querySelector('.tel').textContent = config.organization.shortName;

function login() {
    sessionData.loginFlg = true;
    sessionData.userId = '1';
    sessionData.userName = 'username';
    sessionData.userRole = 'admin';
    sessionData.loginTime= new Date().getTime();
    sessionData.loginTime2= new Date(sessionData.loginTime).toLocaleString();
    console.log("現在時間",new Date().getTime());
    //loginSessionTimeは分で設定
    sessionData.sessionExpire =(new Date().getTime()+config.loginSessionTime*60000);
    sessionData.sessionExpire2 = new Date(sessionData.sessionExpire).toLocaleString();
    sessionData.userIcon= "https://lh3.googleusercontent.com/blogger_img_proxy/AEn0k_uZwVv75AsPm_8ikWihnnBQg2J_Nm8pIQIjFwgf6nnX_XoxDhP-najnhLGEGcuuWBQgkGnHRddWz2hGyaQZZ5wQpd6M-8sNm6-bo0T7y4jwpHsbQA=w72-h72-n-k-no-nu",
    sessionStorage.setItem('sessionData', JSON.stringify(sessionData));
    sessionStorage.removeItem('loginError');
    sessionStorage.removeItem('loginErrorTime');
    location.href = './index.html';


}


function onSignIn(googleUser) {
    // ユーザーの基本プロファイル情報を取得
    var profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId()); // Google ID
    console.log("Full Name: " + profile.getName());
    console.log("Given Name: " + profile.getGivenName());
    console.log("Family Name: " + profile.getFamilyName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail()); // プライバシーポリシーに基づいて取り扱うこと

    // ログイン成功時にメッセージを表示
    document.getElementById('title-message').innerText = `ようこそ、${profile.getName()}さん！`;

    // ここでログイン後の他の処理を行うことができます。
}

// サインアウト処理の追加
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
        document.getElementById('title-message').innerText = 'サインアウトしました。';
    });
}
