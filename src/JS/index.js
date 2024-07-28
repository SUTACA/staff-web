const sessionData1 = JSON.parse(sessionStorage.getItem('sessionData'));
console.log(sessionData1);

setTimeout(() => {
    document.querySelector('.menu-icom-src').src = sessionData1.userIcon;
    document.querySelector('#user_name').innerHTML = sessionData1.userName;
    document.querySelector('#data_date').innerHTML = new Date(sessionData1.loginTime).toLocaleString();
}, 1000);

