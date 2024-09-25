// スクロール禁止
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, { passive: false });
document.addEventListener('mousewheel', function (e) { e.preventDefault(); }, { passive: false });

// Webカメラの起動
const video = document.getElementById('video');
let contentWidth;
let contentHeight;

// 画面サイズを取得
const width = window.innerWidth;
const height = window.innerHeight;

let currentStream = null; // 現在のストリームを保持

const startCamera = (videoConstraints) => {
    if (currentStream) {
        stopStream(currentStream);
    }

    navigator.mediaDevices.getUserMedia({ audio: false, video: videoConstraints })
        .then((stream) => {
            currentStream = stream; // ストリームを保存
            video.srcObject = stream;
            video.onloadeddata = () => {
                video.play();
                contentWidth = video.videoWidth;  // 正確な映像サイズを取得
                contentHeight = video.videoHeight;
                canvasUpdate(); // 次で記述
                checkImage(); // 次で記述
            }
        }).catch((e) => {
            console.log(e);
        });
};

// カメラストリームの停止
const stopStream = (stream) => {
    stream.getTracks().forEach(track => track.stop());
};

// 初回カメラ起動
startCamera({ width: { ideal: width }, height: { ideal: height } });

// カメラ映像のキャンバス表示
const cvs = document.getElementById('camera-canvas');
const ctx = cvs.getContext('2d');

const canvasUpdate = () => {
    // 縦横比を保ったままリサイズ
    cvs.height = height;
    cvs.width = contentWidth * height / contentHeight;

    // 左右反転
    if (count % 2 == 0) {
        ctx.translate(cvs.width, 0);
        ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, cvs.width, cvs.height);
    ctx.setTransform(1, 0, 0, 1, 0, 0); // 反転を戻す

    requestAnimationFrame(canvasUpdate);
};

// QRコードの検出
const rectCvs = document.getElementById('rect-canvas');
const rectCtx = rectCvs.getContext('2d');

const checkImage = () => {
    const imageData = ctx.getImageData(0, 0, cvs.width, cvs.height); // キャンバスのサイズで取得
    const code = jsQR(imageData.data, cvs.width, cvs.height); // jsQRに渡す

    if (code) {
        console.log("QRcodeが見つかりました", code);
        const audio = new Audio('https://aquarabbit62.sakura.ne.jp/sutaca-test/src/sound/scan.mp3');
        audio.play();
        drawRect(code.location);
        document.getElementById('scan_message').innerText = code.data;
        check_gate(code.data);
        setTimeout(checkImage, 3000); // 次の検出を2秒後に行う
    } else {
        //console.log("QRcodeが見つかりません…", code);
        rectCtx.clearRect(0, 0, cvs.width, cvs.height); // キャンバスをクリア
        setTimeout(checkImage, 500); // 0.5秒後に再実行
    }
};

// 四辺形の描画
const drawRect = (location) => {
    rectCvs.width = contentWidth;
    rectCvs.height = contentHeight;
    drawLine(location.topLeftCorner, location.topRightCorner);
    drawLine(location.topRightCorner, location.bottomRightCorner);
    drawLine(location.bottomRightCorner, location.bottomLeftCorner);
    drawLine(location.bottomLeftCorner, location.topLeftCorner);
};

// 線の描画
const drawLine = (begin, end) => {
    rectCtx.lineWidth = 4;
    rectCtx.strokeStyle = "#FF0000"; // 赤色に修正
    rectCtx.beginPath();
    rectCtx.moveTo(begin.x, begin.y);
    rectCtx.lineTo(end.x, end.y);
    rectCtx.stroke();
};

// カメラ切り替え
let count = 0;

function camera_change() {
    count++;
    if (count % 2 == 0) {
        startCamera({ width: { ideal: width }, height: { ideal: height } });
    } else {
        startCamera({ facingMode: "environment" });
    }
}

// QRコード検出後の処理
function check_gate(data) {
    const prefix = data.split('-')[0];
    const data2 = sessionData1.data;
    let name = '登録名なし';
    let organization = '';
    let tel = '';
    let student = '';
    try {
    if (permission.hasOwnProperty(prefix)) {
        console.log(permission[prefix]);
        if (permission[prefix] === true) {
            for (let i = 0; i < data2.length; i++) {
                if (data2[i][0] == data) {
                    name = data2[i][1];
                    organization = data2[i][3];
                    if (data2[i][4] != "-" && data2[i][4] != '') {
                        tel = data2[i][4];
                    }
                    if (data2[i][2] != "-" && data2[i][2] != '') {
                        student = data2[i][2];
                    }
                    break;
                }
            }

            if (name == '登録名なし') {
                // パスが見つからない場合
                console.log('パスが見つかりません');
                const audio = new Audio('https://aquarabbit62.sakura.ne.jp/sutaca-test/src/sound/fail.mp3');
                audio.play();
                Swal.fire({
                    title: '立ち入り不可',
                    html: `無効なパスです。`,
                    icon: 'error'
                });
                return;
            }

            const audio = new Audio('https://aquarabbit62.sakura.ne.jp/sutaca-test/src/sound/success.mp3');
            audio.play();

            Swal.fire({
                title: '立ち入り可能',
                html: `所属団体：${organization}<br>パスID：${data}<br>登録名：${name}<br>${student ? `学生番号：${student}` : ''}<br>${tel ? `電話番号：<a class='tels' href="tel:${tel}">${tel}</a>` : ''}`,
                icon: 'success'
            });

            const apiKey = 'YOUR_API_KEY4';
            const url = `https://script.google.com/macros/s/AKfycbzuRX-iFgUNYRw5RTtpd2W3enzK7IyiTQ7Vgm5XIMfylW1GRHj4YS3IoGIKFbe8hLqHxA/exec?apiKey=${apiKey}&email=${encodeURIComponent(sessionData1.userId)}&userId=${encodeURIComponent(data)}&locationId=${encodeURIComponent(sessionData1.locationId)}`;

            try {
                const response = fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTPエラー ${response.status}`);
                }
            } catch (error) {
                console.log(`エラー: ${error.message}`);
            }
        } else {
            // 権限がない場合
            const audio = new Audio('https://aquarabbit62.sakura.ne.jp/sutaca-test/src/sound/fail.mp3');
            audio.play();
            Swal.fire({
                title: '立ち入り不可',
                html: `入場権限がありません。<br>管理者に問い合わせてください。`,
                icon: 'error'
            });
        }
    }} catch (error) {
        console.log(`エラー: ${error.message}`);
    }
}
