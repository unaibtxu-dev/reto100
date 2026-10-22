/* Reto 100 Nube 1.5 — cálculo puro de tendencias y raciones.
   No cambia el estado: el usuario debe confirmar la propuesta desde app.js. */
window.R100_MONTHLY = (() => {
  'use strict';
  const proteinFoods = new Set(['chicken','turkey','beef','salmon','hake','tuna','tofu','skyr','eggs','eggwhites','whites','yogurt']);
  const carbFoods = new Set(['rice','pasta','couscous','gnocchi','oats','potato','bread','sweetpotato','quinoa']);
  const validISO = d => /^\d{4}-\d{2}-\d{2}$/.test(String(d)) && Number.isFinite(Date.parse(`${d}T12:00:00Z`));
  const round1 = x => Math.round(x * 10) / 10;
  const round5 = x => Math.max(5, Math.round(x / 5) * 5);
  const clamp = (x, low, high) => Math.max(low, Math.min(high, x));
  const totals = (rows, getFood) => rows.reduce((sum, r) => {
    const food = getFood(r.food);
    for (const key of ['kcal','p','c','f']) sum[key] += Number(food[key] || 0) * r.qty / 100;
    return sum;
  }, {kcal:0,p:0,c:0,f:0});
  function recentMean(logs, date) {
    if (!validISO(date)) return {valid:false,n:0,mean:null};
    const end = Date.parse(`${date}T12:00:00Z`), from = end - 6 * 86400000;
    const distinct = new Map();
    for (const x of Array.isArray(logs) ? logs : []) {
      if (!x || !validISO(x.date) || !Number.isFinite(+x.weight) || +x.weight < 40 || +x.weight > 220) continue;
      const d = Date.parse(`${x.date}T12:00:00Z`);
      if (d >= from && d <= end) distinct.set(x.date, +x.weight);
    }
    const vals = [...distinct.values()];
    return {valid:vals.length>=3, n:vals.length, mean:vals.length>=3?round1(vals.reduce((a,b)=>a+b,0)/vals.length):null};
  }
  function planDay(rows, target, proteinTarget, getFood) {
    if (!Array.isArray(rows) || !Number.isFinite(target) || !Number.isFinite(proteinTarget)) throw Error('Datos de raciones no válidos');
    const items = rows.map(x => ({slot:x.slot,food:x.food,before:x.qty,qty:x.qty,locked:!!x.locked,reason:x.reason||''}));
    const before = totals(items, getFood);
    const editableProtein = items.filter(x => !x.locked && proteinFoods.has(x.food) && x.qty >= 20 && getFood(x.food).p > 8);
    const pAvailable = editableProtein.reduce((v,x) => v + getFood(x.food).p * x.qty / 100, 0);
    const pDeficit = Math.max(0, proteinTarget - before.p - 10);
    // Los cambios en proteína son moderados. No se intenta forzar una meta alta
    // solo aumentando mucha carne, especialmente si ya sobra energía en el día.
    if (pDeficit >= 10 && pAvailable > 0 && target >= before.kcal - 100) {
      const scale = clamp(pDeficit / pAvailable, 0, .20);
      for (const r of editableProtein) r.qty = round5(r.qty * (1 + scale));
    }
    const mid = totals(items, getFood);
    const editableCarb = items.filter(x => !x.locked && carbFoods.has(x.food) && x.qty >= 20 && getFood(x.food).kcal > 10);
    const carbEnergy = editableCarb.reduce((v,x)=>v+getFood(x.food).kcal*x.qty/100,0);
    if (carbEnergy > 0 && Math.abs(target - mid.kcal) >= 55) {
      const scale = clamp((target - mid.kcal) / carbEnergy, -.30, .30);
      for (const r of editableCarb) r.qty = round5(r.qty * (1 + scale));
    }
    const after = totals(items, getFood);
    const changes = items.filter(x => !x.locked && Math.abs(x.qty - x.before) >= 1);
    return {before, after, items, changes, lockedSlots:new Set(items.filter(x=>x.locked).map(x=>x.slot)).size,
      unresolved:Math.abs(target-after.kcal)>125 || after.p<proteinTarget-15};
  }
  return {recentMean,planDay,totals};
})();
