const grid = document.getElementById('grid');
const stageText = document.getElementById('stage');
const status = document.getElementById('status');
const resultMedia = document.getElementById('result-media');

let stage = 1;
let highScore = localStorage.getItem('endlessHighScore') || 0;
let selectedDifficulty = localStorage.getItem('endlessDifficulty') || 'default';

const difficulties = {
  easy: 0.20,
  medium: 0.10,
  hard: 0.05,
  insane: 0.003,
  godlike: 0.0000015
};

const milestones = {
  1: { text: "Maklumlah, bre...", media: "P/QVZqckhQblg4YlpkZXVKSmVtZ1JBaUlP.jpeg" },
  10: { text: "lumayan juga lu, bre!", media: "P/QVZqQk0zOFRkZkthMURFY1ROajhnZEdU.jpeg" },
  50: { text: "50 stage, gila lu...", media: "P/FB_IMG_17342675437063342.jpg" },
  100: { text: "Stage 100?? RASIS nih anak...😐", media: "P/QVZqdS1ub1VYenpRX2Raeld5RE9rR2xT.jpeg" },
  1000: { text: "Serius? 1000? Lu warga IG ya bre?", media: "V/QVZqYWNjR1JteE83bUcyOVpKV1gwdVl1.mp4" }
};

function randColor() {
  return Math.floor(Math.random() * 180);
}

function rgbToStr(rgb) {
  return `rgb(${rgb.join(",")})`;
}

function getSimilarColor(base, diffRatio) {
  let adjust = Math.floor(255 * diffRatio);
  return base.map(v => Math.min(255, v + adjust));
}

function isYouTubeLink(url) {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

function createGrid() {
  status.textContent = "";
  resultMedia.innerHTML = "";
  stageText.textContent = `Stage: ${stage} | High Score: ${highScore}`;

  grid.innerHTML = "";
  grid.style.gridTemplateColumns = `repeat(10, 8vw)`;
  grid.style.gridGap = `1vw`;

  const baseColor = [randColor(), randColor(), randColor()];
  const diffColor = getSimilarColor(baseColor, difficulties[selectedDifficulty] || 0.08);

  const answerIndex = Math.floor(Math.random() * 100);

  for (let i = 0; i < 100; i++) {
    const circle = document.createElement('div');
    circle.className = 'circle';
    circle.style.width = '8vw';
    circle.style.height = '8vw';
    circle.style.borderRadius = '50%';
    circle.style.background = i === answerIndex ? rgbToStr(diffColor) : rgbToStr(baseColor);
    circle.style.transition = "transform 0.2s";
    circle.addEventListener('mouseover', () => {
      circle.style.transform = "scale(1.1)";
    });
    circle.addEventListener('mouseout', () => {
      circle.style.transform = "scale(1)";
    });
    circle.addEventListener('click', () => {
      if (i === answerIndex) {
        stage++;
        if (stage > highScore) {
          highScore = stage;
          localStorage.setItem('endlessHighScore', highScore);
        }
        createGrid();
      } else {
        showLoseScreen();
      }
    });
    grid.appendChild(circle);
  }
}

function showLoseScreen() {
  status.textContent = "Kalah di Stage " + stage + "!";
  grid.innerHTML = "";
  stageText.textContent = `Stage: ${stage} | High Score: ${highScore}`;

  let milestone = milestones[stage];
  if (!milestone) {
    const keys = Object.keys(milestones).map(Number).sort((a, b) => b - a);
    for (let key of keys) {
      if (stage >= key) {
        milestone = milestones[key];
        break;
      }
    }
  }

  if (milestone) {
    status.innerText += "\n" + milestone.text;

    if (isYouTubeLink(milestone.media)) {
      resultMedia.innerHTML = `
        <iframe width="300" height="200" src="${milestone.media}" frameborder="0" allowfullscreen></iframe>
      `;
    } else {
      resultMedia.innerHTML = `
        <img src="${milestone.media}" style="max-width:300px; border-radius:10px; box-shadow:0 0 10px #fff8;">
      `;
    }
  }
}

window.onload = () => {
  createGrid();
};
