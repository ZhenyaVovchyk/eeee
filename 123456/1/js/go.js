


let c,
    ctx,
    w,
    h,
    cx,
    cy,
    branches,
    startHue,
    tick;

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function randInt(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
};

function Branch(hue, x, y, angle, vel) {
    let move = 15;
    this.x = x + rand(-move, move);
    this.y = y + rand(-move, move);
    this.points = [];
    this.angle = angle != undefined ? angle : rand(0, Math.PI * 1);
    this.vel = vel != undefined ? vel : rand(-4, 4);
    this.spread = 0;
    this.tick = 0;
    this.hue = hue != undefined ? hue : 200;
    this.life = 1;
    this.decay = 0.0015;
    this.dead = false;

    this.points.push({
        x: this.x,
        y: this.y
    });
}

Branch.prototype.step = function (i) {
    this.life -= this.decay;
    if (this.life <= 0) {
        this.dead = true;
    }

    if (!this.dead) {
        let lastPoint = this.points[this.points.length - 1];
        this.points.push({
            x: lastPoint.x + Math.cos(this.angle) * this.vel,
            y: lastPoint.y + Math.sin(this.angle) * this.vel
        });
        this.angle += rand(-this.spread, this.spread);
        this.vel *= 1.5;
        this.spread = this.vel * 0.09;
        this.tick++;
        this.hue += 0.6;
    } else {
        branches.splice(i, 1);
    }
};

Branch.prototype.draw = function () {
    if (!this.points.length || this.dead) {
        return false;
    }

    let length = this.points.length,
        i = length - 1,
        point = this.points[i],
        lastPoint = this.points[i - randInt(5, 100)];
    //jitter = 8;
    if (lastPoint) {
        let jitter = 2 + this.life * 2;
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(point.x + rand(-jitter, jitter), point.y + rand(-jitter, jitter));
        ctx.lineWidth = 1;
        let alpha = this.life * 0.075;
        ctx.strokeStyle = 'hsla(' + (this.hue + rand(-10, 10)) + ', 70%, 40%, ' + alpha + ')';
        ctx.stroke();
    }
}

function init() {
    c = document.getElementById('c');
    ctx = c.getContext('2d');
    startHue = 220;
    branches = [];
    reset();
    loop();
}

function reset() {
    w = window.innerWidth;
    h = window.innerHeight;
    cx = w / 2;
    cy = h / 2;
    branches.length = 0;
    c.width = w;
    c.height = h;
    tick = 0;


    for (let i = 0; i < 500; i++) {
        branches.push(new Branch(startHue, cx, cy));
    }
}

function step() {
    let i = branches.length;
    while (i--) { branches[i].step(i) }
    tick--;
}

function draw() {
    let i = branches.length;
    if (tick < 450) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 0.002;
        ctx.translate(cx, cy);
        let scale = 1 + tick * 0.00025;
        ctx.scale(scale, scale);
        ctx.translate(-cx, -cy);
        ctx.drawImage(c, rand(-150, 150), rand(-150, 150));
        ctx.restore();
    }

    ctx.globalCompositeOperation = 'lighter';
    while (i--) { branches[i].draw() }
}

function loop() {
    requestAnimationFrame(loop);
    step();
    draw();
    step();
    draw();
}

window.addEventListener('resize', reset);
window.addEventListener('click', function () {
    startHue += 160;
    reset();
});

init();


