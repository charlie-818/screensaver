(function () {
  'use strict';

  function Screensaver() {
    this.canvas = document.getElementById('screensaverCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.logo = new Image();
    this.logo.src = 'logo.png';

    this.x = 0;
    this.y = 0;
    this.vx = 2;
    this.vy = 2;
    this.logoWidth = 0;
    this.logoHeight = 0;
    this.drawWidth = 0;
    this.drawHeight = 0;
    this.confetti = [];

    var self = this;

    this.logo.onload = function () {
      self.logoWidth = self.logo.naturalWidth;
      self.logoHeight = self.logo.naturalHeight;
      self.resize();
      self.start();
    };

    this.logo.onerror = function () {
      self.logoWidth = 120;
      self.logoHeight = 60;
      self.resize();
      self.start();
    };

    window.addEventListener('resize', function () { self.resize(); });
  }

  Screensaver.prototype.resize = function () {
    var w = window.innerWidth;
    var h = window.innerHeight;
    this.canvas.width = w;
    this.canvas.height = h;
    var maxSize = w >= 1920 ? 320 * 1.5 : 320;
    this.drawWidth = Math.min(this.logoWidth, maxSize);
    this.drawHeight = (this.logoHeight / this.logoWidth) * this.drawWidth;
    if (this.logoHeight > 0 && this.logoWidth > 0 && this.drawHeight > maxSize) {
      this.drawHeight = maxSize;
      this.drawWidth = (this.logoWidth / this.logoHeight) * this.drawHeight;
    }
    this.x = Math.max(0, Math.min(this.x, w - this.drawWidth));
    this.y = Math.max(0, Math.min(this.y, h - this.drawHeight));
  };

  Screensaver.prototype.bounce = function () {
    var w = this.canvas.width;
    var h = this.canvas.height;
    var jitter = 0.12;
    var dirJitter = 0.3;
    var hitX = false;
    var hitY = false;
    var cornerX = 0;
    var cornerY = 0;

    if (this.x <= 0) {
      this.vx = Math.abs(this.vx) * (1 + (Math.random() - 0.5) * jitter);
      this.vy += (Math.random() - 0.5) * dirJitter;
      this.x = 0;
      hitX = true;
      cornerX = 0;
    }
    if (this.x + this.drawWidth >= w) {
      this.vx = -Math.abs(this.vx) * (1 + (Math.random() - 0.5) * jitter);
      this.vy += (Math.random() - 0.5) * dirJitter;
      this.x = w - this.drawWidth;
      hitX = true;
      cornerX = w;
    }
    if (this.y <= 0) {
      this.vy = Math.abs(this.vy) * (1 + (Math.random() - 0.5) * jitter);
      this.vx += (Math.random() - 0.5) * dirJitter;
      this.y = 0;
      hitY = true;
      cornerY = 0;
    }
    if (this.y + this.drawHeight >= h) {
      this.vy = -Math.abs(this.vy) * (1 + (Math.random() - 0.5) * jitter);
      this.vx += (Math.random() - 0.5) * dirJitter;
      this.y = h - this.drawHeight;
      hitY = true;
      cornerY = h;
    }

    if (hitX && hitY) {
      this.spawnConfetti(cornerX, cornerY);
    }
  };

  Screensaver.prototype.spawnConfetti = function (x, y) {
    var colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#88ff00'];
    for (var i = 0; i < 150; i++) {
      var angle = Math.random() * Math.PI * 2;
      var speed = Math.random() * 8 + 4;
      this.confetti.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        life: 1.0,
        decay: Math.random() * 0.01 + 0.005
      });
    }
  };

  Screensaver.prototype.updateConfetti = function () {
    for (var i = this.confetti.length - 1; i >= 0; i--) {
      var p = this.confetti[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.15;
      p.vx *= 0.99;
      p.rotation += p.rotationSpeed;
      p.life -= p.decay;
      if (p.life <= 0) {
        this.confetti.splice(i, 1);
      }
    }
  };

  Screensaver.prototype.drawConfetti = function () {
    var ctx = this.ctx;
    for (var i = 0; i < this.confetti.length; i++) {
      var p = this.confetti[i];
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  };

  Screensaver.prototype.tick = function () {
    var ctx = this.ctx;
    var w = this.canvas.width;
    var h = this.canvas.height;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, w, h);

    ctx.drawImage(this.logo, this.x, this.y, this.drawWidth, this.drawHeight);

    this.updateConfetti();
    this.drawConfetti();

    this.x += this.vx;
    this.y += this.vy;
    this.bounce();
  };

  Screensaver.prototype.start = function () {
    var self = this;
    function loop() {
      self.tick();
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  };

  new Screensaver();
})();
