// var scripts=document.getElementsByTagName("script");
// for(var i=0;i<scripts.length;i++) {
//     if(scripts[i].type=="application/processing"){
//         var src=scripts[i].src,canvas=scripts[i].nextSibling;
//         if(src&&src.indexOf("#")){
//            canvas=document.getElementById(src.substr(src.indexOf("#")+1));
//         }else{
//             while(canvas&&canvas.nodeName.toUpperCase()!="CANVAS")
//                 canvas=canvas.nextSibling;
//         }
//         if(canvas){
//             new Processing(canvas,scripts[i].text);
//         }
//     }
// }


var canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext('2d');

var mouse = {
  x: undefined,
  y: undefined
};

var maxRadius = 100;
var minRadius = 2;

var colorArray = [
  '#033077',
  '#000666',
  '#100155',
  '#111133',
  '#000044'
];

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
  });

window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    init();
  });

function Circle(x, y, dx, dy, radius) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.minRadius = radius;
  this.color = colorArray[Math.floor(Math.random() * colorArray.length)];

  this.draw = function() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

    //create the glow for the 3d effect
    var gradient = c.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
    gradient.addColorStop(0, 'white');
    gradient.addColorStop(1, this.color);
    c.fillStyle = gradient;
    c.fill();
  }

  this.update = function() {

    //reverse direction when hitting the edge
    if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }

    if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;

    //only grow circles within 100px of mouse
    if (mouse.x - this.x < 100 && mouse.x - this.x > -100
      && mouse.y - this.y < 100 && mouse.y -this.y > -100) {

      if (this.radius < maxRadius) {
        //grow the circle
        this.radius += 1;
      }
    } else if (this.radius > this.minRadius) {
        //shrink the circle
        this.radius -= 1;
    }

    this.draw();
  }
}

var circleArray = [];

function init() {

  //start with an empty array
  circleArray = [];

  for (var i = 0; i < 500; i ++){
    var radius = Math.random() * 3 + 1;

    //keep circles within window
    var x = Math.random() * (innerWidth - radius * 2) + radius;
    var y = Math.random() * (innerHeight - radius * 2) + radius;

    //subract 0.5 so that value range is -0.5 - 0.5
    //multiply by a factor to increase speed
    var dx = (Math.random() - 0.5);
    var dy = (Math.random() - 0.5);
    circleArray.push(new Circle(x, y, dx, dy, radius));
  }
}

function animate () {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, innerWidth, innerHeight);

  //draw each circle in the array
  for (var i = 0; i < circleArray.length; i++){
    circleArray[i].update();
  }


}

init();
animate();
