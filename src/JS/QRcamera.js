   //スクロール禁止
   //document.addEventListener('touchmove', function (e) { e.preventDefault(); }, { passive: false });
   //document.addEventListener('mousewheel', function (e) { e.preventDefault(); }, { passive: false });

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
       //縦を基準に横幅を計算（超えた分は中心にして表示）
         cvs.height = height;
            cvs.width = height * contentWidth / contentHeight;
                


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
           //音量configから
           audio.volume = config.volume==undefined?.5:config.volume/100;
           audio.play();
           drawRect(code.location);
           //QRコードの内容を取得
           const qrData = code.data;
           //QRコードの内容を表示
           document.getElementById('scan_message').innerText = qrData;


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
   //自動で左右反転
   let count = 0;
   function camera_change() {
       closeMenu();
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
           const media = navigator.mediaDevices.getUserMedia({ audio: false, video: { width: width, height: height }  })
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
