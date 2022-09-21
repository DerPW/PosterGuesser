let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let img = new Image();
let slider = 5;
let interval = 0.0005;
let allMovies = shuffle(data);
let allMovieTitles = allMovies.map(e => e.title);
let randomMovie = null;

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

window.onload = firstDraw();

function firstDraw(){
  randomMovie = allMovies.pop();
  draw(randomMovie.poster);
}

function draw(imgUrl){
  img.crossOrigin = "anonymous";
  img.src = imgUrl;
  img.onload = () => {
    canvas.height = 400;
    canvas.width = 300;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    pixelate();
  }
}

function pixelate(){
  // canvas.height = img.height;
  // canvas.width = img.width;

  let size = slider * interval;
  let w = canvas.width * size;
  let h = canvas.height * size;
  ctx.drawImage(img, 0, 0, w, h);

  ctx.mozImageSmoothingEnabled = false;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(canvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
}

document.getElementById("guess").addEventListener("submit", (e) => {
  e.preventDefault()
  guess();
});

function guess(e){
  let guess = document.getElementById("guessed");
  if(guess.value == randomMovie.title){
    alert("YEP");
    show();
    document.getElementById("next").style.visibility = "";
    document.getElementById("stop").style.visibility = "collapse"
  }
  else {
    alert("NOPE")
  }
}

function show(){
  clearInterval(i);
  slider = 140;
  interval = 0.00705;
  pixelate();
}

function reset(){
  slider = 5;
  interval = 0.0005;
  document.getElementById("guessed").value = "";
  document.getElementById("next").style.visibility = "collapse";
  document.getElementById("stop").style.visibility = ""
  document.getElementById("start").style.visibility = ""
}

function stop(){
  clearInterval(i);
}

function unpause(){
  start();
}

function start(){
  i = setInterval(() => {
    pixelate();
    if(slider >= 140) {
      clearInterval(i);
    }
    slider++;
    interval += 0.00005
  }, 100);
}

document.getElementById("next").addEventListener("click", (e) => {
  randomMovie = allMovies.pop();
  reset();
  draw(randomMovie.poster);
});

let i = null;

document.getElementById("stop").addEventListener("click", (e) =>{
  stop();
});

document.getElementById("start").addEventListener("click", (e) => {
  e.target.style.visibility = "collapse";
  slider = 5
  start();
});

//###################
function autocomplete(inp, arr) {
  var currentFocus;
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;

      if(val.trim() != ""){
        stop();
      }
      else {
        unpause();
      }

      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      this.parentNode.appendChild(a);
      for (i = 0; i < arr.length; i++) {
        if(arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()){
          b = document.createElement("DIV");
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
              b.addEventListener("click", function(e) {
              inp.value = this.getElementsByTagName("input")[0].value;
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        currentFocus++;
        addActive(x);
      } else if (e.keyCode == 38) {
        currentFocus--;
        addActive(x);
      } else if (e.keyCode == 13) {
        e.preventDefault();
        if (currentFocus > -1) {
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});
}