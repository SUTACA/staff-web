// スクロール禁止
//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, { passive: false });
//document.addEventListener('mousewheel', function (e) { e.preventDefault(); }, { passive: false });

// Webカメラの起動
const video = document.getElementById('video');
let contentWidth;
let contentHeight;

// 画面サイズを取得
const width = window.innerWidth;
const height = window.innerHeight;

// キャンバスのリサイズを行う関数
const resizeCanvas = () => {
    const aspectRatio = video.videoWidth / video.videoHeight;
    const canvasAspectRatio = width / height;

    if (canvasAspectRatio > aspectRatio) {
        cvs.width = height * aspectRatio;
        cvs.height = height;
    } else {
        cvs.width = width;
        cvs.height = width / aspectRatio;
    }

    // キャンバスの中心を画面の中心に合わせる
    const xOffset = (width - cvs.width) / 2;
    const yOffset = (height - cvs.height) / 2;
    ctx.translate(xOffset, yOffset);
}

// カメラ映像のキャンバス表示
const cvs = document.getElementById('camera-canvas');
const ctx = cvs.getContext('2d');
const canvasUpdate = () => {
    resizeCanvas();
    // 左右反転
    if (count % 2 == 0) {
        ctx.translate(cvs.width, 0);
        ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, cvs.width, cvs.height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    requestAnimationFrame(canvasUpdate);
}

// メディアの取得
const media = navigator.mediaDevices.getUserMedia({ audio: false, video: { width: width, height: height } })
    .then((stream) => {
        video.srcObject = stream;
        video.onloadeddata = () => {
            video.play();
            contentWidth = video.videoWidth;
            contentHeight = video.videoHeight;
            canvasUpdate();
            checkImage();
        }
    }).catch((e) => {
        console.log(e);
    });

// QRコードの検出
const rectCvs = document.getElementById('rect-canvas');
const rectCtx = rectCvs.getContext('2d');
const checkImage = () => {
    const imageData = ctx.getImageData(0, 0, cvs.width, cvs.height);
    const code = jsQR(imageData.data, cvs.width, cvs.height);

    if (code) {
        console.log("QRcodeが見つかりました", code);
        const audio = new Audio('./src/sound/scan.mp3');
        audio.volume = config.volume == undefined ? 0.5 : config.volume / 100;
        audio.play();
        drawRect(code.location);
        document.getElementById('scan_message').innerText = code.data;

        setTimeout(() => { checkImage() }, 2000);
    } else {
        console.log("QRcodeが見つかりません…", code);
        rectCtx.clearRect(0, 0, cvs.width, cvs.height);
        setTimeout(() => { checkImage() }, 500);
    }
}

// 四辺形の描画
const drawRect = (location) => {
    rectCvs.width = cvs.width;
    rectCvs.height = cvs.height;
    drawLine(location.topLeftCorner, location.topRightCorner);
    drawLine(location.topRightCorner, location.bottomRightCorner);
    drawLine(location.bottomRightCorner, location.bottomLeftCorner);
    drawLine(location.bottomLeftCorner, location.topLeftCorner);
}

// 線の描画
const drawLine = (begin, end) => {
    rectCtx.lineWidth = 4;
    rectCtx.strokeStyle = "#FF0000"; // 赤色に修正
    rectCtx.beginPath();
    rectCtx.moveTo(begin.x, begin.y);
    rectCtx.lineTo(end.x, end.y);
    rectCtx.stroke();
}

// カメラ切り替え
// 自動で左右反転
let count = 0;
function camera_change() {
    closeMenu();
    count++;
    const constraints = count % 2 === 0 ? { audio: false, video: { width: width, height: height } } : { audio: false, video: { facingMode: "environment" } };
    
    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            video.srcObject = stream;
            video.onloadeddata = () => {
                video.play();
                contentWidth = video.videoWidth;
                contentHeight = video.videoHeight;
                canvasUpdate();
                checkImage();
            }
        }).catch((e) => {
            console.log(e);
        });
}
