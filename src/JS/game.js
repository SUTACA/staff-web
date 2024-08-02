const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ゲームの基本設定
let dino = {
    x: 50,
    y: canvas.height - 50,  // Adjust to fit the new canvas size
    width: 20,
    height: 20,
    dy: 0,
    gravity: 0.6,
    jumpPower: -10,
    grounded: false
};

let obstacle = {
    x: canvas.width,
    y: canvas.height - 50,  // Adjust to fit the new canvas size
    width: 20,
    height: 20,
    dx: -6
};

let clouds = [
    { x: 0, y: 50, width: 100, height: 60 },
    { x: 200, y: 100, width: 120, height: 70 },
    { x: 400, y: 70, width: 150, height: 80 }
];

let score = 0;
let gameOver = false;

// 背景の描画
function drawBackground() {
    // 背景色
    ctx.fillStyle = '#F5F5F5'; // 空の色
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 地面
    ctx.fillStyle = '#828282'; // 草の色
    ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
}

// 雲の描画とスクロール
function drawClouds() {
    ctx.fillStyle = '#FFFFFF'; // 雲の色
    clouds.forEach(cloud => {
        ctx.fillRect(cloud.x, cloud.y, cloud.width, cloud.height);
        // 雲をスクロールさせる（右から左に）
        cloud.x -= 0.5;
        if (cloud.x + cloud.width < 0) {
            cloud.x = canvas.width; // 右端に戻る
        }
    });
}

// ゲームのメインループ
function gameLoop() {
    if (gameOver) {
        ctx.font = '30px Arial';
        ctx.fillText('Game Over! Your score: ' + score, canvas.width / 4, canvas.height / 2);
        return;
    }

    requestAnimationFrame(gameLoop);

    drawBackground();
    drawClouds();

    // スコアに応じた速度変化
    if (score > 0 && score % 20 === 0) {
        obstacle.dx -= 0.01;
    }

    // 恐竜の重力とジャンプ
    dino.dy += dino.gravity;
    dino.y += dino.dy;

    if (dino.y + dino.height > canvas.height - 30) {
        dino.y = canvas.height - 30 - dino.height;
        dino.grounded = true;
        dino.dy = 0;
    }

    // 障害物の移動
    obstacle.x += obstacle.dx;
    if (obstacle.x + obstacle.width < 0) {
        obstacle.x = canvas.width;
        score++;
    }

    // 衝突判定
    if (
        dino.x < obstacle.x + obstacle.width &&
        dino.x + dino.width > obstacle.x &&
        dino.y < obstacle.y + obstacle.height &&
        dino.y + dino.height > obstacle.y
    ) {
        gameOver = true;
    }

    // 恐竜の描画
    ctx.fillStyle = 'black';
    ctx.fillRect(dino.x, dino.y, dino.width, dino.height);

    // 障害物の描画
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

    // 恐竜の下に水平線を描画
    ctx.strokeStyle = 'red'; // 水平線の色
    ctx.lineWidth = 2; // 水平線の太さ
    ctx.beginPath();
    ctx.moveTo(dino.x, dino.y + dino.height + 2); // 恐竜の下部 + 2ピクセル
    ctx.lineTo(dino.x + dino.width, dino.y + dino.height + 2); // 恐竜の幅分
    ctx.stroke();

    // スコアの描画
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 20);
}

// ジャンプの処理
function jump() {
    if (gameOver) {
        resetGame();
    }else{
    if (dino.grounded) {
        dino.dy = dino.jumpPower;
        dino.grounded = false;
    }
}
}

// キーボードイベント
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        jump();
    }
});

// マウスイベント
canvas.addEventListener('mousedown', jump);

// タッチイベント
canvas.addEventListener('touchstart', jump);

// ゲーム開始
gameLoop();


// ゲームのリセット
function resetGame() {
    dino = {
        x: 50,
        y: canvas.height - 50,
        width: 20,
        height: 20,
        dy: 0,
        gravity: 0.6,
        jumpPower: -10,
        grounded: false
    };

    obstacle = {
        x: canvas.width,
        y: canvas.height - 50,
        width: 20,
        height: 20,
        dx: -6
    };

    clouds = [
        { x: 0, y: 50, width: 100, height: 60 },
        { x: 200, y: 100, width: 120, height: 70 },
        { x: 400, y: 70, width: 150, height: 80 }
    ];

    score = 0;
    gameOver = false;
    gameLoop();
}
