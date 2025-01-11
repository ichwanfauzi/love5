(function (canvas) {
    var context = canvas.getContext("2d"),
      particles = new ParticlePool(settings.particles.length),
      particleRate = settings.particles.length / settings.particles.duration,
      time;
  
    // Fungsi untuk menghitung titik-titik pada bentuk hati
    function pointOnHeart(t) {
      return new Point(
        160 * Math.pow(Math.sin(t), 3),
        130 * Math.cos(t) - 
        50 * Math.cos(2 * t) - 
        20 * Math.cos(3 * t) - 
        10 * Math.cos(4 * t) + 
        25
      );
    }
  
    // Membuat gambar hati
    var image = (function () {
      var canvas = document.createElement("canvas"),
        context = canvas.getContext("2d");
      canvas.width = settings.particles.size;
      canvas.height = settings.particles.size;
  
      function to(t) {
        var point = pointOnHeart(t);
        point.x =
          settings.particles.size / 2 + (point.x * settings.particles.size) / 350;
        point.y =
          settings.particles.size / 2 - (point.y * settings.particles.size) / 350;
        return point;
      }
  
      context.beginPath();
      var t = -Math.PI;
      var point = to(t);
      context.moveTo(point.x, point.y);
      while (t < Math.PI) {
        t += 0.01;
        point = to(t);
        context.lineTo(point.x, point.y);
      }
      context.closePath();
      context.fillStyle = "#f50b02";
      context.fill();
  
      var image = new Image();
      image.src = canvas.toDataURL();
      return image;
    })();
  
    // Fungsi untuk memulai animasi
    function render() {
      requestAnimationFrame(render);
  
      var newTime = new Date().getTime() / 1000,
        deltaTime = newTime - (time || newTime);
      time = newTime;
  
      // Bersihkan kanvas untuk menggambar ulang
      context.clearRect(0, 0, canvas.width, canvas.height);
  
      var amount = particleRate * deltaTime;
      for (var i = 0; i < amount; i++) {
        var pos = pointOnHeart(Math.PI - 2 * Math.PI * Math.random());
        var dir = pos.clone().length(settings.particles.velocity);
        particles.add(
          canvas.width / 2 + pos.x,
          canvas.height / 2 - pos.y,
          dir.x,
          -dir.y
        );
      }
  
      particles.update(deltaTime);
      particles.draw(context, image);
    }
  
    // Mengatur ukuran kanvas agar sesuai dengan ukuran jendela
    function onResize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  
    // Respon terhadap perubahan ukuran jendela
    window.onresize = onResize;
  
    // Inisialisasi dan mulai animasi setelah ukuran kanvas disesuaikan
    setTimeout(function () {
      onResize();
      render();
    }, 10);
  })(document.getElementById("pinkboard"));
  