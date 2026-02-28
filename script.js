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
    if (this.x <= 0) {
      this.vx = Math.abs(this.vx) * (1 + (Math.random() - 0.5) * jitter);
      this.vy += (Math.random() - 0.5) * dirJitter;
      this.x = 0;
    }
    if (this.x + this.drawWidth >= w) {
      this.vx = -Math.abs(this.vx) * (1 + (Math.random() - 0.5) * jitter);
      this.vy += (Math.random() - 0.5) * dirJitter;
      this.x = w - this.drawWidth;
    }
    if (this.y <= 0) {
      this.vy = Math.abs(this.vy) * (1 + (Math.random() - 0.5) * jitter);
      this.vx += (Math.random() - 0.5) * dirJitter;
      this.y = 0;
    }
    if (this.y + this.drawHeight >= h) {
      this.vy = -Math.abs(this.vy) * (1 + (Math.random() - 0.5) * jitter);
      this.vx += (Math.random() - 0.5) * dirJitter;
      this.y = h - this.drawHeight;
    }
  };

  Screensaver.prototype.tick = function () {
    var ctx = this.ctx;
    var w = this.canvas.width;
    var h = this.canvas.height;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, w, h);

    ctx.drawImage(this.logo, this.x, this.y, this.drawWidth, this.drawHeight);

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
