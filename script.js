// ① CSV読み込み
async function loadCSV() {
  const res = await fetch('./perks.csv');
  const text = await res.text();

  const rows = text.trim().split("\n").slice(1);

  return rows.map(row => {
    const [type, id, name] = row.split(",");

    return {
      type,
      id,
      name,
      image: `dbd_perks/${id}.png`
    };
  });
}

let allPerks = [];

// 状態管理
let currentPlayers = [];
let currentKillerPerks = [];
let currentMode = ""; // "survivor" or "killer"

window.onload = async () => {
  allPerks = await loadCSV();
};



// ② 抽選
window.roll = function(type) {

  if (type === "survivor") {
    rollSurvivors();
    return;
  }

  // キラー
  const list = allPerks.filter(p => p.type === type);
  const shuffled = [...list].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 4);

  currentMode = "killer";
  currentKillerPerks = selected;

  display(selected);
};



// ③ キラー表示
function display(perks) {
  const ul = document.getElementById("result");

  ul.innerHTML = perks.map(p => `
    <li class="perk-card">
      <div class="perk">
        <div class="perk-bg"></div>
        <img src="${p.image}" class="perk-img">
      </div>
      <div class="perk-name">${p.name}</div>
    </li>
  `).join("");
}



// ④ サバイバー抽選
function rollSurvivors() {
  const inputs = document.querySelectorAll("#players input");

  const names = [...inputs]
    .map(input => input.value.trim())
    .filter(name => name !== "");

  if (names.length === 0) {
    alert("名前を1人以上入力してね");
    return;
  }

  const list = allPerks.filter(p => p.type === "survivor");

  currentMode = "survivor";

  currentPlayers = names.map(name => {
    const shuffled = [...list].sort(() => 0.5 - Math.random());
    return {
      name,
      perks: shuffled.slice(0, 4)
    };
  });

  displaySurvivors(currentPlayers);
}



// ⑤ サバイバー表示（indexで管理）
function displaySurvivors(players) {
  const ul = document.getElementById("result");

  ul.innerHTML = players.map((player, index) => `
    <li style="grid-column: span 4; margin-bottom: 20px;">
      
      <h3 class="player-header">
        <span class="player-name">${player.name}</span>
        <button class="reroll-btn" onclick="reroll(${index})">再抽選</button>
      </h3>

      <div style="display: flex; gap: 20px;">
        ${player.perks.map(p => `
          <div class="perk-card">
            <div class="perk">
              <div class="perk-bg"></div>
              <img src="${p.image}" class="perk-img">
            </div>
            <div class="perk-name">${p.name}</div>
          </div>
        `).join("")}
      </div>

    </li>
  `).join("");
}



// ⑥ コピー（モード分岐）
window.copyBuild = function() {

  let text = "";

  if (currentMode === "survivor") {
    currentPlayers.forEach(player => {
      text += player.name + "\n";

      player.perks.forEach(p => {
        text += "・" + p.name + "\n";
      });

      text += "\n\n";
    });

  } else if (currentMode === "killer") {
    text += "キラー構成\n";
    currentKillerPerks.forEach(p => {
      text += "・" + p.name + "\n";
    });
  }

  if (text === "") {
    alert("先に抽選してね");
    return;
  }

  text = text.trim();  // ← ★ここに入れる

  navigator.clipboard.writeText(text);
  alert("コピーしました！");
};



// ⑦ 再抽選（indexで確実に）
window.reroll = function(index) {
  const list = allPerks.filter(p => p.type === "survivor");
  const shuffled = [...list].sort(() => 0.5 - Math.random());

  if (!currentPlayers[index]) return;

  currentPlayers[index].perks = shuffled.slice(0, 4);

  displaySurvivors(currentPlayers);
};
