   //スクロール禁止
   //document.addEventListener('touchmove', function (e) { e.preventDefault(); }, { passive: false });
   //document.addEventListener('mousewheel', function (e) { e.preventDefault(); }, { passive: false });

const { sweetAlert, Swal } = require("./common");

   // Webカメラの起動
   const video = document.getElementById('video');
   let contentWidth;
   let contentHeight;
   //画面サイズを取得
   const width = window.innerWidth;
   const height = window.innerHeight;

   const media = navigator.mediaDevices.getUserMedia({ audio: false, video: { width: width, height: height } })
       .then((stream) => {
           video.srcObject = stream;
           video.onloadeddata = () => {
               video.play();
               contentWidth = video.clientWidth;
               contentHeight = video.clientHeight;
               canvasUpdate(); // 次で記述
               checkImage(); // 次で記述
           }
       }).catch((e) => {
           console.log(e);
       });


   // カメラ映像のキャンバス表示
   const cvs = document.getElementById('camera-canvas');
   const ctx = cvs.getContext('2d');
   const canvasUpdate = () => {
       //縦横比を保ったままリサイズ
       cvs.height = height;
       //横幅は超えない
       cvs.width = contentWidth * height / contentHeight;


        //左右反転
        if (count % 2 == 0) {
            ctx.translate(cvs.width, 0);
            ctx.scale(-1, 1);
        }
        
       ctx.drawImage(video, 0, 0, cvs.width, cvs.height);
       ctx.setTransform(1, 0, 0, 1, 0, 0);

       requestAnimationFrame(canvasUpdate);
   }


   // QRコードの検出
   const rectCvs = document.getElementById('rect-canvas');
   const rectCtx = rectCvs.getContext('2d');
   const checkImage = () => {
       // imageDataを作る
       const imageData = ctx.getImageData(0, 0, contentWidth, contentHeight);
       // jsQRに渡す
       const code = jsQR(imageData.data, contentWidth, contentHeight);

       // 検出結果に合わせて処理を実施
       if (code) {
        
           console.log("QRcodeが見つかりました", code);
           //scan.mp3を再生
           const audio = new Audio('./src/sound/scan.mp3');
           audio.play();
           drawRect(code.location);
           //QRコードの内容を取得
           const qrData = code.data;
           //QRコードの内容を表示
           document.getElementById('scan_message').innerText = qrData;
           check_gate(code.data);
           

           setTimeout(() => { checkImage() }, 2000);
       } else {
           console.log("QRcodeが見つかりません…", code);
           rectCtx.clearRect(0, 0, contentWidth, contentHeight);
           setTimeout(() => { checkImage() }, 500);
       }
      
   }


   // 四辺形の描画
   const drawRect = (location) => {
       rectCvs.width = contentWidth;
       rectCvs.height = contentHeight;
       drawLine(location.topLeftCorner, location.topRightCorner);
       drawLine(location.topRightCorner, location.bottomRightCorner);
       drawLine(location.bottomRightCorner, location.bottomLeftCorner);
       drawLine(location.bottomLeftCorner, location.topLeftCorner)
   }

   // 線の描画
   const drawLine = (begin, end) => {
       rectCtx.lineWidth = 4;
       rectCtx.strokeStyle = "#red";
       rectCtx.beginPath();
       rectCtx.moveTo(begin.x, begin.y);
       rectCtx.lineTo(end.x, end.y);
       rectCtx.stroke();
   }

   //カメラ切り替え
   let count = 0;
   function camera_change() {
       count++;
       if (count % 2 == 0) {
           const media = navigator.mediaDevices.getUserMedia({ audio: false, video: { width: width, height: height } })
               .then((stream) => {
                   video.srcObject = stream;
                   video.onloadeddata = () => {
                       video.play();
                       contentWidth = video.clientWidth;
                       contentHeight = video.clientHeight;
                       canvasUpdate(); // 次で記述
                       checkImage(); // 次で記述
                   }
               }).catch((e) => {
                   console.log(e);
               });
       } else {
           const media = navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: "environment" } })
               .then((stream) => {
                   video.srcObject = stream;
                   video.onloadeddata = () => {
                       video.play();
                       contentWidth = video.clientWidth;
                       contentHeight = video.clientHeight;
                       canvasUpdate(); // 次で記述
                       checkImage(); // 次で記述
                   }
               }).catch((e) => {
                   console.log(e);
               });
       }
   };


   function check_gate(data) {
    const prefix = data.split('-')[0]; // SA
    // permissionオブジェクトのprefixプロパティの値を取得
    if (permission.hasOwnProperty(prefix)) {
        console.log(permission[prefix]);
        if(permission[prefix] === true){
            console.log('Permission granted');
            //scan.mp3を再生
            const audio = new Audio('./src/sound/success.mp3');
            audio.play();

            /*履歴を追加*/
            const apiKey = 'YOUR_API_KEY4'; 
            const url =`https://script.google.com/macros/s/AKfycbzuRX-iFgUNYRw5RTtpd2W3enzK7IyiTQ7Vgm5XIMfylW1GRHj4YS3IoGIKFbe8hLqHxA/exec?apiKey=${apiKey}&email=${encodeURIComponent(sessionData1.userId)}&userId=${encodeURIComponent(data)}&locationId=${encodeURIComponent(sessionData1.locationId)}`
        
            try {
                const response =  fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTPエラー ${response.status}`);
                }
            } catch (error) {
                console.log(`エラー: ${error.message}`);
            }
            //成功 
            //sessionstorage.data のからdata検索して団体名＋名前を表示
            //[['AA-24-001'	'玉田 丈翔'	'-'	'大学祭実行委員会'	'-'	'運営（大祭）'	'運営'	'委員長'"],....]
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
        }else{
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

