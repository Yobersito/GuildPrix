
(function () {
  const num = (s) => {
    const n = parseFloat(String(s).replace(/[^\d.-]/g, ""));
    return Number.isFinite(n) ? n : 0;
  };

  const table = document.querySelector("table.table.sheet");
  if (!table) return;

  
  const rows = Array.from(table.querySelectorAll("tr")).map(tr =>
    Array.from(tr.querySelectorAll("th,td")).map(td => (td.textContent || "").trim())
  );

  const findRowIndex = (label) =>
    rows.findIndex(r => ((r[0] || "").toUpperCase() === label));

  const idxPisador = findRowIndex("PISADOR");
  const idx1ra     = findRowIndex("1RA HORA");
  const idx2da     = findRowIndex("2DA HORA");
  const idxSub     = findRowIndex("SUBTOTAL");
  if (idxPisador < 0 || idx1ra < 0 || idx2da < 0 || idxSub < 0) {
    console.warn("[prix.js] Faltan filas esperadas (PISADOR / 1RA HORA / 2DA HORA / SubTotal).");
    return;
  }

  
  const idxLose1 = idx1ra + 1;
  const idxLose2 = idx2da + 1;

  
  const header = rows[0] || [];
  const headerLen = header.length; 
  const playerCols = [];
  for (let c = 1; c < headerLen; c++) playerCols.push(c);

  
  const getNumAt = (rowIndex, colIndex) => {
    const row = rows[rowIndex] || [];
    const hasRowspanGap = (row.length === headerLen - 1); 
    const trueIdx = hasRowspanGap ? (colIndex - 1) : colIndex; 
    return num(row[trueIdx]);
  };

  
  const namesRow = rows[idxPisador] || [];
  const playerNames = playerCols.map(c => namesRow[c] || `P${c}`);

  
  const w1 = playerCols.map(c => getNumAt(idx1ra,  c));
  const l1 = playerCols.map(c => getNumAt(idxLose1, c));
  const w2 = playerCols.map(c => getNumAt(idx2da,  c));
  const l2 = playerCols.map(c => getNumAt(idxLose2, c));

  
  const sub = playerCols.map((_, i) => (w1[i] - l1[i]) + (w2[i] - l2[i]));

  
  const trSub = table.querySelectorAll("tr")[idxSub];
  playerCols.forEach((c, i) => {
    const cell = trSub.querySelectorAll("th,td")[c];
    if (cell) cell.textContent = String(sub[i]);
  });

  
  const totalGeneral = sub.reduce((a, b) => a + b, 0);
  const totalCell = table.querySelector(".total-num") ||
                    trSub.querySelector("td:last-child, th:last-child");
  if (totalCell) totalCell.textContent = String(totalGeneral);

 
  const payload = playerCols.map((c, i) => ({
    name: String(playerNames[i]).trim(),
    winsSubtotal: sub[i],
    totalNet: sub[i]
  })).filter(x => x.name && x.name !== "0");

  localStorage.setItem("prixResults", JSON.stringify(payload));
  console.info("[prix.js] SubTotals y TOTAL listos. Guardado en localStorage.prixResults:", payload);
})();
