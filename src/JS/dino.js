const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let score = 0;
let highScore = 0;
let gameOver = false;
let obstacleTimer = 0;
let groundOffset = 0;
let speed = 6;
let obstacles = [];

// キャンバスのサイズをビューポートのサイズに合わせる
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight-100;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ゲームの基本設定
let dinoSize = canvas.height * 0.05; // 高さの8%
let dino = {
    x: 50,
    y: canvas.height - dinoSize - (canvas.height * 0.1), // 地面からの距離を確保
    width: dinoSize,
    height: dinoSize,
    dy: 0,
    gravity: 0.6,
    jumpPower: -15,
    grounded: false
};

// 雲の初期設定
let clouds = [
    { x: 0, y: canvas.height * 0.1, width: canvas.width * 0.3, height: canvas.height * 0.1 },
    { x: canvas.width * 0.5, y: canvas.height * 0.15, width: canvas.width * 0.3, height: canvas.height * 0.12 },
    { x: canvas.width * 0.8, y: canvas.height * 0.12, width: canvas.width * 0.35, height: canvas.height * 0.15 },
    { x: canvas.width * 1.1, y: canvas.height * 0.14, width: canvas.width * 0.3, height: canvas.height * 0.1 },
    { x: canvas.width * 1.4, y: canvas.height * 0.1, width: canvas.width * 0.3, height: canvas.height * 0.12 }
];

// 背景の描画
function drawBackground() {
    ctx.fillStyle = '#F5F5F5'; // 空の色
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 大きな地面
    let groundHeight = canvas.height * 0.1; // 地面の高さを画面の10%
    ctx.fillStyle = '#828282'; // 草の色
    ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);

    // 地面に白線の破線を追加
    ctx.strokeStyle = 'white'; // 白線の色
    ctx.lineWidth = 4; // 白線の太さ
    ctx.setLineDash([200, 100]); // 破線のパターン
    ctx.lineDashOffset = -groundOffset; // 破線のオフセットを設定
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - (groundHeight / 2)); // 地面の中央に配置
    ctx.lineTo(canvas.width, canvas.height - (groundHeight / 2));
    ctx.stroke();
    ctx.setLineDash([]); // 破線をリセット
}

// 雲の描画とスクロール
function drawClouds() {
    ctx.fillStyle = '#FFFFFF'; // 雲の色
    clouds.forEach(cloud => {
        ctx.fillRect(cloud.x, cloud.y, cloud.width, cloud.height);
        cloud.x -= 0.5 * speed / 6; // 初期速度が0.5、speedが6のときに等しい
        if (cloud.x + cloud.width < 0) {
            cloud.x = canvas.width; // 右端に戻る
        }
    });
}

// 障害物のランダムな生成
function generateObstacle() {
    const obstacleTypes = [
        { width: canvas.width * 0.1, height: canvas.height * 0.1-20 },
        { width: canvas.width * 0.2, height: canvas.height * 0.1-20 },
    ];
    const randomType = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
    return {
        x: canvas.width,
        y: canvas.height - (canvas.height * 0.1) - randomType.height+20,
        width: randomType.width,
        height: randomType.height,
        dx: -speed
    };
}

// ゲームのメインループ
function gameLoop() {
    if (gameOver) {
        ctx.font = '30px Arial';
        ctx.fillText('Game Over!' , canvas.width /3.5, canvas.height / 2);
        ctx.fillText('スコア: ' + score, canvas.width / 3.5, canvas.height / 2+40);
        if (score > highScore) {
            highScore = score;
            const sessionData = JSON.parse(sessionStorage.getItem('sessionData'));
            sessionData.highScore = highScore;
            sessionStorage.setItem('sessionData', JSON.stringify(sessionData));

            ctx.fillText('最高記録更新！', canvas.width / 3.5, canvas.height / 2 + 80);
        } else {
            ctx.fillText('最高スコア: ' + highScore, canvas.width /3.5, canvas.height / 2 + 80);
        }
        return;
    }
    score++;

    speed = 6 + score / 2000;

    requestAnimationFrame(gameLoop);
    drawBackground();
    drawClouds();

    obstacleTimer++;
    if (obstacleTimer > Math.floor(Math.random() * 30) + 70) {
        obstacles.push(generateObstacle());
        obstacleTimer = 0;
    }

    dino.dy += dino.gravity;
    dino.y += dino.dy;

    if (dino.y + dino.height > canvas.height - (canvas.height * 0.1)) {
        dino.y = canvas.height - (canvas.height * 0.1) - dino.height;
        dino.grounded = true;
        dino.dy = 0;
    }

    obstacles.forEach(obstacle => {
        ctx.fillStyle = 'green';
        obstacle.dx = -speed;
        obstacle.x += obstacle.dx;

        if (
            dino.x < obstacle.x + obstacle.width &&
            dino.x + dino.width > obstacle.x &&
            dino.y < obstacle.y + obstacle.height &&
            dino.y + dino.height > obstacle.y
        ) {
            gameOver = true;
        }
    });

    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);

    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    ctx.fillStyle = 'black';
    ctx.fillRect(dino.x, dino.y, dino.width, dino.height);

    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(dino.x, dino.y + dino.height + 2);
    ctx.lineTo(dino.x + dino.width, dino.y + dino.height + 2);
    ctx.stroke();

    ctx.font = '30px Arial';
    ctx.fillText('スコア: ' + score, 10, 200);
    ctx.fillText('最高スコア記録: ' + highScore, 10, 240);
    //サイズ変更

    groundOffset -= speed;
}

function jump() {
    if (gameOver) {
        resetGame();
    } else {
        if (dino.grounded) {
            dino.dy = dino.jumpPower;
            dino.grounded = false;
        }
    }
}

function resetGame() {
    dino = {
        x: 50,
        y: canvas.height - dinoSize - (canvas.height * 0.1),
        width: dinoSize,
        height: dinoSize,
        dy: 0,
        gravity: 0.6,
        jumpPower: -15,
        grounded: false
    };
    obstacles = [];
    score = 0;
    gameOver = false;
    obstacleTimer = 0;
    groundOffset = 0;
    speed = 6;
    gameLoop();
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        jump();
    }
});
canvas.addEventListener('mousedown', jump);
canvas.addEventListener('touchstart', jump);

gameLoop();
