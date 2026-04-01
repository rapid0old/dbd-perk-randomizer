// ① CSV読み込み（そのまま）
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

window.onload = async () => {
  allPerks = await loadCSV();
};



// ② rollを改造（ここ重要）
window.roll = function(type) {

  if (type === "survivor") {
    rollSurvivors();   // ← ここ追加
    return;
  }

  const list = allPerks.filter(p => p.type === type);
  const shuffled = [...list].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 4);

  display(selected);
};



// ③ 通常表示（キラー用）
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



// ④ 👇 ここから追加（サバイバー用）

function rollSurvivors() {
  const inputs = document.querySelectorAll("#players input");

  const names = [...inputs]
    .map(input => input.value.trim())
    .filter(name => name !== "");

  if (names.length === 0) {
    alert("名前を1人以上入力おくれ");
    return;
  }

  const list = allPerks.filter(p => p.type === "survivor");

  const result = names.map(name => {
    const shuffled = [...list].sort(() => 0.5 - Math.random());
    return {
      name,
      perks: shuffled.slice(0, 4)
    };
  });

  displaySurvivors(result);
}



// ⑤ 👇 これが「表示処理」
function displaySurvivors(players) {
  const ul = document.getElementById("result");

  ul.innerHTML = players.map(player => `
    <li style="grid-column: span 4; margin-bottom: 20px;">
      
      <h3>${player.name}</h3>

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

function copyBuild() {
  const text = document.getElementById("result").innerText;
  navigator.clipboard.writeText(text);
}
