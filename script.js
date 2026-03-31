import { perks } from "./perks.js";

window.roll = function(type) {
  const list = perks[type];
  const shuffled = [...list].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 4);
  display(selected);
};

function display(perks) {
  const ul = document.getElementById("result");
  ul.innerHTML = perks.map(p => `<li>${p.name}</li>`).join("");
}
