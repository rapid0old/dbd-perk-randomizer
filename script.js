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
  const list = allPerks.filter(p => p.type === type);

  const shuffled = [...list].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 4);

  display(selected);
};

function display(perks) {
  const ul = document.getElementById("result");

  ul.innerHTML = perks.map(p => `
    <li style="display:flex;align-items:center;gap:10px;">
      <img 
        src="${p.image}" 
        width="64"
        onerror="this.src='https://via.placeholder.com/64?text=No+Image'"
      >
      <span>${p.name}</span>
    </li>
  `).join("");
}
