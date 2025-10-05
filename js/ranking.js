(function () {
  const data = JSON.parse(localStorage.getItem("prixResults") || "[]");
  if (!Array.isArray(data) || data.length === 0) {
    console.warn("[ranking.js] Sin datos. Primero abre PRIX para generar localStorage.prixResults.");
    return;
  }

  // Orden: primero por winsSubtotal; si empatan, por totalNet
  const sorted = data.slice().sort((a, b) =>
    (b.winsSubtotal - a.winsSubtotal) || (b.totalNet - a.totalNet)
  );

  // Tomamos hasta Top 6 (si hay menos jugadores, no falla)
  const top = sorted.slice(0, Math.min(sorted.length, 6));

  // ------ Podio (Top 3) ------
  const podiumNames = document.querySelectorAll(".podium-card .name");
  if (podiumNames.length >= 3) {
    podiumNames[0].textContent = top[1]?.name ?? ""; // 2°
    podiumNames[1].textContent = top[0]?.name ?? ""; // 1°
    podiumNames[2].textContent = top[2]?.name ?? ""; // 3°
  }

  // ------ Lista 4° al 6° ------
  const list = document.querySelector("ul.rank-list");
  if (!list) return;
  list.innerHTML = ""; // limpiar

  const maxPts = Math.max(1, top[0]?.winsSubtotal ?? 0);

  // Genera filas para posiciones 4,5,6 (si existen)
  top.slice(3).forEach((player, i) => {
    const rankNum = i + 4; // 4,5,6
    const li = document.createElement("li");
    li.className = "rank-row";

    const pct = Math.max(0.2, Math.min(1, (player?.winsSubtotal ?? 0) / maxPts));
    li.style.setProperty("--pct", String(pct));

    // Etiqueta simple según puesto (opcional)
    const tag =
      rankNum === 4 ? "A nada" :
      rankNum === 5 ? "Manco" :
      rankNum === 6 ? "Mas manco" : "";

    li.innerHTML = `
      <span class="rank-badge">${rankNum}</span>
      <span class="rank-name">${player?.name ?? ""}</span>
      <span class="rank-right">
        <span class="rank-points" data-bs-toggle="tooltip" title="pts">${player?.winsSubtotal ?? 0}</span>
        <span class="rank-delta same" data-bs-toggle="tooltip" title="="><i class="bi bi-dash-lg"></i></span>
        <span class="rank-tag">${tag}</span>
      </span>
    `;
    list.appendChild(li);
  });
})();
