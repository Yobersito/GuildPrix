// js/ranking.js
(function () {
  const data = JSON.parse(localStorage.getItem("prixResults") || "[]");
  if (!Array.isArray(data) || data.length === 0) {
    console.warn("[ranking.js] Sin datos. Primero abre PRIX para generar localStorage.prixResults.");
    return;
  }

  // Orden descendente por puntos (winsSubtotal). Si empata, por totalNet.
  const sorted = data.slice().sort((a, b) =>
    (b.winsSubtotal - a.winsSubtotal) || (b.totalNet - a.totalNet)
  );

  // Top 1–6
  const top = sorted.slice(0, 6);

  // Podio 2°, 1°, 3° (tu HTML lo muestra en ese orden visual)
  const podiumNames = document.querySelectorAll(".podium-card .name");
  if (podiumNames.length >= 3) {
    podiumNames[0].textContent = top[1]?.name || ""; // 2°
    podiumNames[1].textContent = top[0]?.name || ""; // 1°
    podiumNames[2].textContent = top[2]?.name || ""; // 3°
  }

  // Lista 4°–6°
  const list = document.querySelector("ul.rank-list");
  if (!list) return;

  const ensureLi = (i) => {
    let li = list.querySelectorAll("li.rank-row")[i];
    if (!li) {
      li = document.createElement("li");
      li.className = "rank-row";
      li.innerHTML = `
        <span class="rank-badge"></span>
        <span class="rank-name"></span>
        <span class="rank-right">
          <span class="rank-points"></span>
          <span class="rank-delta same"><i class="bi bi-dash-lg"></i></span>
          <span class="rank-tag"></span>
        </span>`;
      list.appendChild(li);
    }
    return li;
  };

  const maxPts = Math.max(1, top[0]?.winsSubtotal ?? 0);

  for (let i = 0; i < 3; i++) {
    const rankIdx = i + 3;      // 3->4°, 4->5°, 5->6°
    const player  = top[rankIdx];
    const li      = ensureLi(i);

    li.querySelector(".rank-badge").textContent = String(rankIdx + 1);
    li.querySelector(".rank-name").textContent  = player?.name ?? "";
    li.querySelector(".rank-points").textContent = String(player?.winsSubtotal ?? 0);

    // barra visual vía CSS --pct (0.2 mínimo para que se vea)
    const pct = player ? Math.max(0.2, Math.min(1, (player.winsSubtotal / maxPts) || 0)) : 0.2;
    li.style.setProperty("--pct", String(pct));
  }
})();
