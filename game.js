const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Ajustar canvas
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

// Player
const player = {
  x: 100,
  y: 100,
  size: 40,
  speed: 4
};

// Teclado
const keys = {};
document.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

// Joystick
const base = document.getElementById("joystick-base");
const stick = document.getElementById("joystick-stick");
const toggleBtn = document.getElementById("toggle");

let joystickEnabled = true;
let joystickActive = false;
let joyX = 0;
let joyY = 0;
const maxDist = 40;

// Toggle
toggleBtn.onclick = () => {
  joystickEnabled = !joystickEnabled;
  base.classList.toggle("hidden", !joystickEnabled);
  toggleBtn.textContent = joystickEnabled ? "Joystick: ON" : "Joystick: OFF";
  joyX = joyY = 0;
};

// Touch joystick
base.addEventListener("touchstart", e => {
  joystickActive = true;
  e.preventDefault();
});

base.addEventListener("touchmove", e => {
  if (!joystickActive || !joystickEnabled) return;

  const touch = e.touches[0];
  const rect = base.getBoundingClientRect();

  const x = touch.clientX - rect.left - rect.width / 2;
  const y = touch.clientY - rect.top - rect.height / 2;

  const dist = Math.min(maxDist, Math.hypot(x, y));
  const angle = Math.atan2(y, x);

  joyX = Math.cos(angle) * (dist / maxDist);
  joyY = Math.sin(angle) * (dist / maxDist);

  stick.style.transform =
    `translate(${joyX * maxDist}px, ${joyY * maxDist}px)`;
});

base.addEventListener("touchend", () => {
  joystickActive = false;
  joyX = joyY = 0;
  stick.style.transform = "translate(-50%, -50%)";
});

// Game loop
function update() {
  if (keys["w"] || keys["arrowup"]) player.y -= player.speed;
  if (keys["s"] || keys["arrowdown"]) player.y += player.speed;
  if (keys["a"] || keys["arrowleft"]) player.x -= player.speed;
  if (keys["d"] || keys["arrowright"]) player.x += player.speed;

  if (joystickEnabled) {
    player.x += joyX * player.speed;
    player.y += joyY * player.speed;
  }

  player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "blue";
  ctx.fillRect(player.x, player.y, player.size, player.size);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
