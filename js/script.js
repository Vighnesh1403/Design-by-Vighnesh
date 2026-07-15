const cursor = document.getElementById("liquid-glass-cursor");

/* Mouse target position */

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

/* Main cursor */

let currentX = mouseX;
let currentY = mouseY;

/* Trailing cursor */

let trailingX = mouseX;
let trailingY = mouseY;

/* Hover state */

let isHovering = false;

/* Mouse move */

if (cursor) {
  window.addEventListener("mousemove", (e) => {

    mouseX = e.clientX;
    mouseY = e.clientY;

    cursor.style.opacity = 1;
  });
}

/* Animation loop */

function animate() {

  if (!cursor) {
    return;
  }

  /* Main movement */

  currentX += (mouseX - currentX) * 0.22;
  currentY += (mouseY - currentY) * 0.22;

  /* Trailing effect */

  trailingX += (currentX - trailingX) * 0.12;
  trailingY += (currentY - trailingY) * 0.12;

  /* Velocity */

  const velocityX = mouseX - trailingX;
  const velocityY = mouseY - trailingY;

  const velocity = Math.min(
    Math.sqrt(velocityX * velocityX + velocityY * velocityY) * 0.04,
    8
  );

  const scale = isHovering ? 1.18 : 1 + Math.min(velocity * 0.01, 0.08);

  cursor.style.transform = `translate3d(${trailingX}px, ${trailingY}px, 0) translate(-50%, -50%) scale(${scale})`;

  requestAnimationFrame(animate);
}

if (cursor) {
  animate();
}

/* Hover targets */

const hoverTargets = document.querySelectorAll(`
  a,
  button,
  .card,
  .talk-btn,
  .nav-links a
`);

if (cursor) {
  hoverTargets.forEach((el) => {

    el.addEventListener("mouseenter", () => {

      isHovering = true;

      cursor.classList.add("is-hovering");
    });

    el.addEventListener("mouseleave", () => {

      isHovering = false;

      cursor.classList.remove("is-hovering");
    });

  });
}

/* Hide when leaving window */

if (cursor) {
  document.addEventListener("mouseleave", () => {
    cursor.style.opacity = 0;
  });

  document.addEventListener("mouseenter", () => {
    cursor.style.opacity = 1;
  });
}


// CLOCK

function updateClock(){

  const now = new Date();

  const h = String(now.getHours()).padStart(2,'0');
  const m = String(now.getMinutes()).padStart(2,'0');
  const s = String(now.getSeconds()).padStart(2,'0');

  const clock = document.getElementById("clock");

  if (clock) {
    clock.textContent = `${h}:${m}:${s}`;
  }
}

setInterval(updateClock,1000);

updateClock();


// IMAGE CHANGE ON EVERY HOVER

const hoverArea = document.querySelector(".location-hover");

const images = document.querySelectorAll(".preview-img");

if (hoverArea && images.length) {
  let current = -1; // START WITH NO ACTIVE IMAGE

  hoverArea.addEventListener("mouseenter", () => {

    // REMOVE ALL ACTIVE
    images.forEach(img => img.classList.remove("active"));

    // NEXT IMAGE
    current++;

    if(current >= images.length){
      current = 0;
    }

    // SHOW CURRENT IMAGE
    images[current].classList.add("active");

  });


  // HIDE IMAGE WHEN MOUSE LEAVES

  hoverArea.addEventListener("mouseleave", () => {

    images.forEach(img => img.classList.remove("active"));

  });
}

// design journey section
(function(){
  var section = document.getElementById('djSection');
  if(!section){
    return;
  }
  var steps = Array.prototype.slice.call(section.querySelectorAll('.dj-step'));
  var photos = Array.prototype.slice.call(section.querySelectorAll('.dj-photo'));
  var chip = document.getElementById('djChip');
  var titles = steps.map(function(s){ return s.querySelector('.dj-step-title').textContent; });

  var DURATION = 6000;
  var idx = 0;
  var segmentStart = performance.now();
  var pausedAt = null;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var raf;

  function setFill(index, pct){
    var fill = steps[index].querySelector('.dj-progress-fill');
    if(fill) fill.style.width = (pct * 100) + '%';
  }

  function goTo(newIndex){
    steps[idx].classList.remove('active');
    steps[idx].setAttribute('aria-selected','false');
    setFill(idx, 0);
    photos[idx].classList.remove('active');

    idx = newIndex;

    steps[idx].classList.add('active');
    steps[idx].setAttribute('aria-selected','true');
    photos[idx].classList.add('active');
    chip.textContent = 'Iteration 0' + (idx+1) + ' \u2014 ' + titles[idx];

    segmentStart = performance.now();
    setFill(idx, 0);
  }

  function frame(now){
    if(!reduceMotion){
      if(pausedAt === null){
        var elapsed = now - segmentStart;
        var pct = Math.min(elapsed / DURATION, 1);
        setFill(idx, pct);
        if(pct >= 1){
          goTo((idx + 1) % steps.length);
        }
      }
    }
    raf = requestAnimationFrame(frame);
  }

  steps.forEach(function(step, i){
    step.addEventListener('click', function(){
      goTo(i);
    });
  });

  section.addEventListener('mouseenter', function(){
    pausedAt = performance.now();
  });
  section.addEventListener('mouseleave', function(){
    if(pausedAt !== null){
      segmentStart += (performance.now() - pausedAt);
      pausedAt = null;
    }
  });

  section.setAttribute('tabindex','0');
  section.addEventListener('keydown', function(e){
    if(e.key === 'ArrowRight'){ goTo((idx+1) % steps.length); }
    if(e.key === 'ArrowLeft'){ goTo((idx-1+steps.length) % steps.length); }
  });

  chip.textContent = 'Iteration 01 \u2014 ' + titles[0];

  if(!reduceMotion){
    raf = requestAnimationFrame(frame);
  }
})();

