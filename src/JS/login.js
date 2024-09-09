const config = JSON.parse(sessionStorage.getItem('config'));

// エラーメッセージ表示
if (location.search) {
    var params = new URLSearchParams(location.search);
    var error = params.get('error');

    if (error && !isNaN(error)) {
        var errorMessages = {
            1: config.errorMessage.loginError1,
            2: config.errorMessage.loginError2,
            3: config.errorMessage.loginError3
        };

        if (errorMessages[error]) {
            document.querySelector('.error').innerHTML = errorMessages[error];
        }

        // sessionStorageのログインエラー回数を追加,ログイン失敗時間もセット（なければ作成1をセット）
        var loginError = Number(sessionStorage.getItem('loginError')) || 0;
        sessionStorage.setItem('loginError', loginError + 1);
        sessionStorage.setItem('loginErrorTime', new Date().getTime());

        console.log("エラー回数", sessionStorage.getItem('loginError'));
        console.log("エラー時間", sessionStorage.getItem('loginErrorTime'));

        // URLからパラメータを削除
        history.replaceState('', '', location.pathname);
    }
}

// セッションデータ
if (sessionStorage.getItem('sessionData')) {
    var sessionData = JSON.parse(sessionStorage.getItem('sessionData'));

    if (sessionData.sessionExpire < new Date().getTime()) {
        // セッションの有効期限が切れている場合
        sessionStorage.removeItem('sessionData');
        location.href = './login.html?error=2';
    } else {
        // セッションの有効期限を更新
        sessionData.sessionExpire = new Date().getTime() + 300000;
        sessionStorage.setItem('sessionData', JSON.stringify(sessionData));
        // メインコンテンツの表示
        location.href = './index.html';
    }
}

// ログイン失敗回数が3回以上かつログイン失敗時間が10分以内の場合、アカウントロック
if (sessionStorage.getItem('loginError') >= config.loginAttempt) {
    if (new Date().getTime() - Number(sessionStorage.getItem('loginErrorTime')) < config.loginAttemptTime * 60000) {
        document.querySelector('.error').innerHTML = `アカウントがロックされています。<br>${config.loginAttemptTime}分後に再度ログインしてください。`;
        document.querySelector('.login').style.display = 'none';
        document.querySelector('.error').style.marginBottom = '200px';
    } else {
        sessionStorage.removeItem('loginError');
        sessionStorage.removeItem('loginErrorTime');
    }
} else if (sessionStorage.getItem('loginError') > config.loginAttempt - 3) {
    document.querySelector('.error').innerHTML += '<br>あと' + (config.loginAttempt - Number(sessionStorage.getItem('loginError'))) + '回失敗するとアカウントがロックされます。';
}

// .tel に電話番号をリンク
document.querySelector('.tel').href = 'tel:' + config.organization.tel;
document.querySelector('.tel').textContent = config.organization.shortName;

async function login_check(email, name, picture) {
    const userAgent = window.navigator.userAgent;

    const ipAddress = await fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => data.ip);

    const apiKey = 'YOUR_API_KEY3'; 
    const url = `https://script.google.com/macros/s/AKfycbzuRX-iFgUNYRw5RTtpd2W3enzK7IyiTQ7Vgm5XIMfylW1GRHj4YS3IoGIKFbe8hLqHxA/exec?apiKey=${apiKey}&email=${encodeURIComponent(email)}&userAgent=${encodeURIComponent(userAgent)}&ipAddress=${encodeURIComponent(ipAddress)}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTPエラー ${response.status}`);
        }

        const result = await response.json();
        console.log(result[0]);

        if (result[0].status === 'Access Granted') {
            console.log('ログイン成功');
            login(email, name, picture, result);
            console.table(result);
        } else {
            console.log('ログイン失敗');
            location.href = './login.html?error=1';
        }
    } catch (error) {
        console.log(`エラー: ${error.message}`);
    }
}


function login(email, name, picture,result) {
    
    //resultには権限が含まれている
    // 権限情報オブジェクト　admin:"管理者",leader:"リーダー",user:"通常権限"
    var role = 'user';
    if(result[0].permission.includes('管理者')){
        var role = 'admin';
    }else if(result[0].permission.includes('リーダー')){
        var role = 'leader';
    }
    //result[0]は消す
    result.shift();

    var sessionData = {
        loginFlg: true,
        userId: email,
        userName: name,
        userRole: role,
        loginTime: new Date().getTime(),
        loginTime2: new Date().toLocaleString(),
        sessionExpire: new Date().getTime() + config.loginSessionTime * 60000,
        sessionExpire2: new Date().toLocaleString(),
        userIcon: picture,
        data: result
    };

    sessionStorage.setItem('sessionData', JSON.stringify(sessionData));
    sessionStorage.removeItem('loginError');
    sessionStorage.removeItem('loginErrorTime');
    location.href = './index.html';
}

function login_test() {
    var sessionData = {
        loginFlg: true,
        userId: '1',
        userName: 'username',
        userRole: 'admin',
        loginTime: new Date().getTime(),
        loginTime2: new Date().toLocaleString(),
        sessionExpire: new Date().getTime() + config.loginSessionTime * 60000,
        sessionExpire2: new Date().toLocaleString(),
        userIcon: "https://lh3.googleusercontent.com/blogger_img_proxy/AEn0k_uZwVv75AsPm_8ikWihnnBQg2J_Nm8pIQIjFwgf6nnX_XoxDhP-najnhLGEGcuuWBQgkGnHRddWz2hGyaQZZ5wQpd6M-8sNm6-bo0T7y4jwpHsbQA=w72-h72-n-k-no-nu"
    };
    sessionStorage.setItem('sessionData', JSON.stringify(sessionData));
    sessionStorage.removeItem('loginError');
    sessionStorage.removeItem('loginErrorTime');
    location.href = './index.html';
}
