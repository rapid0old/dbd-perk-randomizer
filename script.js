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

window.roll = function(type) {
  if (type === "survivor") {
    rollSurvivors();
    return;
  }

  // キラーは今まで通り
  const list = allPerks.filter(p => p.type === type);
  const shuffled = [...list].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 4);

  display(selected);
};

function display(perks) {
  const ul = document.getElementById("result");

  ul.innerHTML = perks.map(p => `
    <li class="perk-card">
      
      <div class="perk">
        <!-- 背景画像 -->
        <div class="perk-bg"></div>

        <!-- パーク画像 -->
        <img 
          src="${p.image}" 
          class="perk-img"
          onerror="this.src='https://via.placeholder.com/64?text=No+Image'"
        >
      </div>

      <!-- 名前 -->
      <div class="perk-name">${p.name}</div>

    </li>
  `).join("");
}
