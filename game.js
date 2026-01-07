const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Player
const player = {
  x: 180,
  y: 180,
  size: 40,
  speed: 3
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

let joystick = {
  active: false,
  dx: 0,
  dy: 0
};

const maxDistance = 40;

// Toggle joystick
toggleBtn.addEventListener("click", () => {
  joystickEnabled = !joystickEnabled;
  base.classList.toggle("hidden", !joystickEnabled);
  toggleBtn.textContent = joystickEnabled ? "Joystick: ON" : "Joystick: OFF";
  joystick.dx = joystick.dy = 0;
});

// Joystick events
base.addEventListener("touchstart", () => joystick.active = true);
base.addEventListener("touchmove", moveJoystick);
base.addEventListener("touchend", endJoystick);

function moveJoystick(e) {
  if (!joystick.active || !joystickEnabled) return;

  const touch = e.touches[0];
  const rect = base.getBoundingClientRect();

  const x = touch.clientX - rect.left - rect.width / 2;
  const y = touch.clientY - rect.top - rect.height / 2;

  const distance = Math.min(maxDistance, Math.hypot(x, y));
  const angle = Math.atan2(y, x);

  joystick.dx = Math.cos(angle) * (distance / maxDistance);
  joystick.dy = Math.sin(angle) * (distance / maxDistance);

  stick.style.transform =
    `translate(${joystick.dx * maxDistance}px, ${joystick.dy * maxDistance}px)`;
}

function endJoystick() {
  joystick.active = false;
  joystick.dx = joystick.dy = 0;
  stick.style.transform = "translate(-50%, -50%)";
}

// Update
function update() {
  // WASD + Setas
  if (keys["w"] || keys["arrowup"]) player.y -= player.speed;
  if (keys["s"] || keys["arrowdown"]) player.y += player.speed;
  if (keys["a"] || keys["arrowleft"]) player.x -= player.speed;
  if (keys["d"] || keys["arrowright"]) player.x += player.speed;

  // Joystick
  if (joystickEnabled) {
    player.x += joystick.dx * player.speed;
    player.y += joystick.dy * player.speed;
  }

  // Limites
  player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));
}

// Draw
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "blue";
  ctx.fillRect(player.x, player.y, player.size, player.size);
}

// Loop
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
