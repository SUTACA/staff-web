

function load() {
    setTimeout(() => {
        checkRole();
        document.querySelector('.menu-icom-src').src = sessionData1.userIcon;
        document.querySelector('#user_name').innerHTML = sessionData1.userName;
        document.querySelector('#data_date').innerHTML = new Date(sessionData1.loginTime).toLocaleString();
        document.querySelector('#location_id').innerHTML = sessionData1.locationId;
        permission = permission_table_create(sessionData1.locationId)
        
    }, 2000);
}

//scanPointがない場合は読み取りSweetAlertを表示させて入力を受け付けて保存する。（キャンセルはなし）
if (!sessionData1.locationId) {
    Swal.fire({
        title: config.systemMessage.locationMessage1,
        input: 'text',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: false,
        confirmButtonText: config.systemMessage.save,
        showLoaderOnConfirm: true,
        inputPlaceholder: '例: 1234',

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
} else {
    load();
}

function permission_table_create(hex) {
    // 下三桁と上一桁を分ける
    const hex1 = hex.toString().slice(-3);
    const hex2 = hex.toString().slice(0, -3);

    // 下三桁を2進数に変換
    const bin = parseInt(hex1, 16).toString(2).padStart(11, '0');
    // 上一桁を10進数に変換
    const location = parseInt(hex2, 16);

    // 権限情報オブジェクト
    const permission = {
        Point: location,
        AA: bin[0] === '1' ? true : false,
        AB: bin[1]  === '1' ? true : false,
        AC: bin[2]  === '1' ? true : false,
        VP: bin[3]  === '1' ? true : false,
        BA: bin[4]  === '1' ? true : false,
        BB: bin[5]  === '1' ? true : false,
        BC: bin[6]  === '1' ? true : false,
        CC: bin[7]  === '1' ? true : false,
        SA: bin[8]  === '1' ? true : false,
        SB: bin[9]  === '1' ? true : false,
        SC: bin[10] === '1' ? true : false,
    };

    // 表示形式に権限情報をテーブルに変換する
    const permission2 = {
        '読み取り場所番号': location,
        '運営本部': permission.AA === true ? '許可' : '不可',
        '運営': permission.AB === true ? '許可' : '不可',
        '技術': permission.AC === true ? '許可' : '不可',
        '招待ゲスト': permission.VP === true ? '許可' : '不可',
        'フェスタ': permission.BA === true ? '許可' : '不可',
        '出展企業': permission.BB === true ? '許可' : '不可',
        'PACkage': permission.BC === true ? '許可' : '不可',
        '出演者': permission.CC === true ? '許可' : '不可',
        '飲食模擬店': permission.SA === true ? '許可' : '不可',
        '展示発表': permission.SB === true ? '許可' : '不可',
        '関係者': permission.SC === true ? '許可' : '不可',
    };

    console.table(permission2);

    return permission;
}



function check_gate(data) {
    const prefix = data.split('-')[0]; // SA
    // permissionオブジェクトのprefixプロパティの値を取得
    if (permission.hasOwnProperty(prefix)) {
        console.log(permission[prefix],1);
        if (permission[prefix] === true) {
            console.log('Permission granted');
            //scan.mp3を再生
            const audio = new Audio('./src/sound/success.mp3');
            audio.play();

            const data2 = sessionData1.data;
            let name = '';
            let organization = '';
            for (let i = 0; i < data2.length; i++) {
                if (data2[i][0] == data) {
                    name = data2[i][1];
                    organization = data2[i][3];
                    break;
                }
            }
            //sweetAlert('success', '許可', organization + ' ' + name);
            Swal.fire({
                title: organization + ' ' + name,
                icon: 'success'
            });

            /*履歴を追加*/
            const apiKey = 'YOUR_API_KEY4';
            const url = `https://script.google.com/macros/s/AKfycbzuRX-iFgUNYRw5RTtpd2W3enzK7IyiTQ7Vgm5XIMfylW1GRHj4YS3IoGIKFbe8hLqHxA/exec?apiKey=${apiKey}&email=${encodeURIComponent(sessionData1.userId)}&userId=${encodeURIComponent(data)}&locationId=${encodeURIComponent(sessionData1.locationId)}`

            try {
                const response = fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTPエラー ${response.status}`);
                }
            } catch (error) {
                console.log(`エラー: ${error.message}`);
            }
        } else {
            console.log('Permission denied');
            //scan.mp3を再生
            const audio = new Audio('./src/sound/fail.mp3');
            audio.play();

            //失敗
            Swal.fire({
                title: '許可されていません',
                icon: 'error'
            });
        }
    } else {
        console.log('Permission not found');
    }
}