const sessionDatas = JSON.parse(sessionStorage.getItem('sessionData'));
console.log(sessionDatas);
//menu-icom-srcのsrcをsessionData.userIconに変更
setTimeout(() => {
    document.querySelector('.menu-icom-src').src = sessionDatas.userIcon;
    document.querySelector('#user_name').innerHTML = sessionDatas.userName;
    document.querySelector('#data_date').innerHTML = new Date(sessionDatas.loginTime).toLocaleString();
}, 1000);