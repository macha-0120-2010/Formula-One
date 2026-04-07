const drivers2025 = [
            'VER (Red Bull)', 'TSU (Red Bull)', 'HAM (Ferrari)', 'LEC (Ferrari)',
            'NOR (McLaren)', 'PIA (McLaren)', 'GEO (Mercedes)', 'KIM (Mercedes)',
            'ALO (Aston Martin)', 'STR (Aston Martin)', 'GAS (Alpine)', 'DOO (Alpine)',
            'HUL (Sauber)', 'BOR (Sauber)', 'LAW (RB)', 'HAD (RB)',
            'ALB (Williams)', 'SAI (Williams)', 'OCO (Haas)', 'BEA (Haas)',
        ];

        const driverConfigs = [
            { id: 'my1', team: 'my', title: 'My Team - Driver 1', color: 'bg-indigo-600', text: 'text-indigo-600', name: 'BEA (Haas)', q: 13, f: 7 },
            { id: 'my2', team: 'my', title: 'My Team - Driver 2', color: 'bg-indigo-400', text: 'text-indigo-400', name: 'DOO (Alpine)', q: 10, f: 21 },
            { id: 'op1', team: 'op', title: 'Opponent - Driver 1', color: 'bg-rose-600', text: 'text-rose-600', name: 'VER (Red Bull)', q: 8, f: 3 },
            { id: 'op2', team: 'op', title: 'Opponent - Driver 2', color: 'bg-rose-400', text: 'text-rose-400', name: 'HAM (Ferrari)', q: 17, f: 10 },
        ];

        const defaultMachineStats = {
            my: { s: 74, c: 58, pu: 44, qu: 70, drs: 27, pit_s: 4, pit_ms: 75 },
            op: { s: 69, c: 57, pu: 54, qu: 59, drs: 30, pit_s: 4, pit_ms: 78 },
        };

        const state = {};

        function init() {
            const scoreSelect = document.getElementById('scoreNum');
            for (let i = 0; i <= 100; i++) {
                const opt = document.createElement('option');
                opt.value = i; opt.textContent = i;
                if (i === 45) opt.selected = true;
                scoreSelect.appendChild(opt);
            }
            initMachineSelects();
            renderDrivers();
        }

        function initMachineSelects() {
            const stats = ['S', 'C', 'PU', 'Qu', 'DRS'];
            const teams = ['my', 'op'];
            teams.forEach((t) => {
                stats.forEach((s) => {
                    const sel = document.getElementById(`${t}_${s}`);
                    for (let i = 0; i <= 100; i++) {
                        const opt = document.createElement('option');
                        opt.value = i; opt.textContent = i;
                        if (i === defaultMachineStats[t][s.toLowerCase()]) opt.selected = true;
                        sel.appendChild(opt);
                    }
                });
                ['PitSec', 'PitMs'].forEach(key => {
                    const sel = document.getElementById(`${t}${key}`);
                    const max = key === 'PitSec' ? 10 : 99;
                    const start = key === 'PitSec' ? 1 : 0;
                    for (let i = start; i <= max; i++) {
                        const val = i < 10 && key === 'PitMs' ? '0' + i : i;
                        const opt = document.createElement('option');
                        opt.value = val; opt.textContent = val;
                        if (key === 'PitSec' && i === defaultMachineStats[t].pit_s) opt.selected = true;
                        if (key === 'PitMs' && i == defaultMachineStats[t].pit_ms) opt.selected = true;
                        sel.appendChild(opt);
                    }
                });
            });
        }

        function getPosLabel(n) {
            const suffix = ['th', 'st', 'nd', 'rd'];
            const v = n % 100;
            return n + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]);
        }

        function updateTireColor(selectElement) {
            const val = selectElement.value.toLowerCase();
            selectElement.classList.remove('tire-s', 'tire-m', 'tire-h', 'tire-w');
            selectElement.classList.add(`tire-${val}`);
        }

        function clearRecord(btn) {
            const row = btn.closest('.flex');
            const selects = row.querySelectorAll('select');
            selects.forEach(s => s.selectedIndex = 0);
        }

        function renderDrivers() {
            const container = document.getElementById('driversContainer');
            container.innerHTML = '';
            driverConfigs.forEach((d) => {
                state[d.id] = { stints: d.id === 'my2' ? 2 : 3 };
                const section = document.createElement('div');
                section.className = 'driver-section space-y-3';
                section.dataset.driverId = d.id;
                section.dataset.teamType = d.team;

                let qOptions = '', fOptions = '';
                for (let i = 1; i <= 24; i++) {
                    qOptions += `<option value="${i}" ${i === d.q ? 'selected' : ''}>${getPosLabel(i)}</option>`;
                    fOptions += `<option value="${i}" ${i === d.f ? 'selected' : ''}>${getPosLabel(i)}</option>`;
                }

                let secOptions = '<option value="">-</option>';
                for (let i = 1; i <= 60; i++) secOptions += `<option value="${i}">${i}</option>`;
                let msOptions = '<option value="">-</option>';
                for (let i = 0; i <= 999; i++) {
                    const val = i.toString().padStart(3, '0');
                    msOptions += `<option value="${val}">${val}</option>`;
                }
                
                let pitSecOptions = '<option value="">-</option>';
                for (let i = 1; i <= 10; i++) pitSecOptions += `<option value="${i}">${i}</option>`;
                let pitMsOptions = '<option value="">-</option>';
                for (let i = 0; i <= 99; i++) {
                    const val = i.toString().padStart(2, '0');
                    pitMsOptions += `<option value="${val}">${val}</option>`;
                }

                section.innerHTML = `
                    <div class="flex justify-between items-center px-2">
                        <div class="flex items-center gap-2">
                            <div class="w-1 h-3 ${d.color} rounded-full"></div>
                            <h2 class="text-[9px] font-black uppercase tracking-tighter ${d.text}">${d.title}</h2>
                        </div>
                        <div class="flex items-center bg-white rounded-full border border-slate-100 p-0.5 shadow-sm">
                            <button onclick="changeStintCount('${d.id}', -1)" class="w-6 h-6 flex items-center justify-center text-slate-300 font-bold">-</button>
                            <span class="text-[7px] font-black px-1.5 text-slate-400">STINT</span>
                            <button onclick="changeStintCount('${d.id}', 1)" class="w-6 h-6 flex items-center justify-center text-slate-900 font-bold hover:text-indigo-600">+</button>
                        </div>
                    </div>
                    <div class="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 space-y-5">
                        <div class="flex gap-2">
                            <div class="w-1/2 flex flex-col gap-2 border-r pr-2">
                                <div class="flex items-center justify-between">
                                    <label class="text-[8px] font-black text-slate-300 uppercase">予選</label>
                                    <select class="pos-select qualy-val">${qOptions}</select>
                                </div>
                                <div class="flex items-center justify-between">
                                    <label class="text-[8px] font-black text-slate-300 uppercase">本戦</label>
                                    <select class="pos-select final-val">${fOptions}</select>
                                </div>
                            </div>
                            <div class="w-1/2 flex flex-col gap-1 pl-2">
                                <label class="text-[8px] font-black text-slate-300 uppercase">ドライバー</label>
                                <select class="w-full bg-slate-50 p-3 rounded-xl font-bold text-[10px] outline-none border-none h-full driver-name-val">
                                    ${drivers2025.map(n => `<option ${n === d.name ? 'selected' : ''}>${n}</option>`).join('')}
                                </select>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-3 pt-2 border-t border-slate-50">
                            <div class="space-y-1">
                                <label class="text-[7px] font-black text-slate-400 uppercase tracking-widest px-1 flex justify-between">Fastest Lap <button onclick="clearRecord(this)" class="text-slate-300 hover:text-red-400">×</button></label>
                                <div class="flex items-center gap-0.5">
                                    <select class="record-select f-lap-sec flex-1">${secOptions}</select>
                                    <span class="text-[8px] text-slate-300 font-bold">.</span>
                                    <select class="record-select f-lap-ms flex-1">${msOptions}</select>
                                </div>
                            </div>
                            <div class="space-y-1">
                                <label class="text-[7px] font-black text-slate-400 uppercase tracking-widest px-1 flex justify-between">Fastest Pit <button onclick="clearRecord(this)" class="text-slate-300 hover:text-red-400">×</button></label>
                                <div class="flex items-center gap-0.5">
                                    <select class="record-select f-pit-sec flex-1">${pitSecOptions}</select>
                                    <span class="text-[8px] text-slate-300 font-bold">.</span>
                                    <select class="record-select f-pit-ms flex-1">${pitMsOptions}</select>
                                </div>
                            </div>
                        </div>

                        <div id="stints-${d.id}" class="grid grid-cols-1 gap-2 border-t pt-4"></div>
                    </div>
                `;
                container.appendChild(section);
                renderStints(d.id);
            });
        }

        function renderStints(id) {
            const container = document.getElementById(`stints-${id}`);
            const count = state[id].stints;
            container.innerHTML = '';
            for (let i = 1; i <= count; i++) {
                const card = document.createElement('div');
                card.className = 'stint-card';
                let initialTire = 'S';
                if (id === 'my2') initialTire = 'H';
                else if (i > 1 && i % 2 === 0) initialTire = 'M';

                card.innerHTML = `
                    <div class="flex justify-between items-center px-1">
                        <span class="text-[7px] font-black text-slate-300 uppercase italic tracking-widest">Stint ${i}</span>
                        <div class="flex items-center gap-2">
                            <span class="text-[8px] font-black text-slate-400 uppercase">Tire & Lap</span>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <div class="flex-1 relative">
                            <select class="tire-select tire-val" onchange="updateTireColor(this)">
                                <option value="S" class="opt-s" ${initialTire === 'S' ? 'selected' : ''}>SOFT (S)</option>
                                <option value="M" class="opt-m" ${initialTire === 'M' ? 'selected' : ''}>MEDIUM (M)</option>
                                <option value="H" class="opt-h" ${initialTire === 'H' ? 'selected' : ''}>HARD (H)</option>
                                <option value="W" class="opt-w" ${initialTire === 'W' ? 'selected' : ''}>WET (W)</option>
                            </select>
                        </div>
                        <div class="flex items-center bg-white rounded-xl px-2 border-2 border-slate-100 shadow-inner">
                            <button onclick="step(this, -1)" class="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-slate-600 font-black">-</button>
                            <input type="number" value="3" class="w-8 text-center text-[11px] font-black outline-none bg-transparent lap-val">
                            <button onclick="step(this, 1)" class="w-8 h-8 flex items-center justify-center text-slate-900 hover:text-indigo-600 font-black">+</button>
                        </div>
                    </div>`;
                container.appendChild(card);
                updateTireColor(card.querySelector('.tire-val'));
            }
        }

        window.changeStintCount = (id, delta) => {
            let newVal = state[id].stints + delta;
            if (newVal >= 1 && newVal <= 5) {
                state[id].stints = newVal;
                renderStints(id);
            }
        };

        window.step = (btn, delta) => {
            const inp = btn.parentNode.querySelector('input');
            let v = parseInt(inp.value) + delta;
            if (v < 0) v = 0;
            inp.value = v;
        };

        function generateReport() {
            const reportArea = document.getElementById('reportArea');
            const reportText = document.getElementById('reportText');
            const circuit = document.getElementById('circuit').value;
            const weather = document.getElementById('weather').value;
            const score = document.getElementById('scoreNum').value;
            const status = document.getElementById('scoreStatus').value;

            const getM = (t) => ({
                s: document.getElementById(`${t}_S`).value,
                c: document.getElementById(`${t}_C`).value,
                pu: document.getElementById(`${t}_PU`).value,
                qu: document.getElementById(`${t}_Qu`).value,
                drs: document.getElementById(`${t}_DRS`).value,
                pit: document.getElementById(`${t}PitSec`).value + '.' + document.getElementById(`${t}PitMs`).value,
            });
            const myM = getM('my');
            const opM = getM('op');

            const dData = [];
            document.querySelectorAll('.driver-section').forEach(section => {
                const teamType = section.dataset.teamType;
                const name = section.querySelector('.driver-name-val').value;
                const q = section.querySelector('.qualy-val').value;
                const f = section.querySelector('.final-val').value;
                
                const flSec = section.querySelector('.f-lap-sec').value;
                const flMs = section.querySelector('.f-lap-ms').value;
                const fl = flSec && flMs ? `${flSec}.${flMs}` : '記録なし';

                const fpSec = section.querySelector('.f-pit-sec').value;
                const fpMs = section.querySelector('.f-pit-ms').value;
                const fp = fpSec && fpMs ? `${fpSec}.${fpMs}` : '記録なし';

                const stints = Array.from(section.querySelectorAll('.stint-card'))
                    .map(card => card.querySelector('.tire-val').value + card.querySelector('.lap-val').value)
                    .join('-');
                
                dData.push({ teamType, name, q, f, stints, fl, fp });
            });

            const analysis = `2025年 ${circuit}。天候: ${weather}。
スコア差: ${score} (${status})。

【Machine Config】
自チーム: S${myM.s} C${myM.c} PU${myM.pu} Qu${myM.qu} DRS${myM.drs} Pit ${myM.pit}s
相手チーム: S${opM.s} C${opM.c} PU${opM.pu} Qu${opM.qu} DRS${opM.drs} Pit ${opM.pit}s

【Race Results】
${dData.map(d => {
    const teamLabel = d.teamType === 'my' ? '[自チーム]' : '[相手チーム]';
    return `${teamLabel} ${d.name}: 予選${d.q}位 → 決勝${d.f}位 (${d.stints}) | FL: ${d.fl} | FPit: ${d.fp}s`;
}).join('\n')}

【Insights】
${document.getElementById('userNotes').value}`;

            reportText.textContent = analysis;
            reportArea.classList.remove('hidden');
            reportArea.scrollIntoView({ behavior: 'smooth' });
        }

        function copyToClipboard() {
            const text = document.getElementById('reportText').textContent;
            const textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            const btn = event.target;
            const old = btn.textContent;
            btn.textContent = "コピーしました！";
            setTimeout(() => btn.textContent = old, 2000);
        }

        window.onload = init;
