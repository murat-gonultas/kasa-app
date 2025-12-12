// ----------------------------
// LOGIN (SATRANÇ)
// ----------------------------
const correctPattern = ["a1"];
let userPattern = [];

function createChessboard() {
    setTimeout(() => {
        document.getElementById("chessboard").classList.remove("hidden");
    }, 1200);

    const board = document.getElementById("chessboard");
    const files = ["a", "b", "c", "d", "e", "f", "g", "h"];

    for (let rank = 8; rank >= 1; rank--) {
        for (let file = 0; file < 8; file++) {
            const square = document.createElement("div");
            square.classList.add("square");

            const isDark = (rank + file) % 2 === 0;
            square.classList.add(isDark ? "dark" : "light");

            const coord = files[file] + rank;
            square.dataset.pos = coord;

            square.addEventListener("click", () => {
                // Parlama efekti için class ekle
                square.classList.add("clicked");
                setTimeout(() => square.classList.remove("clicked"), 350);

                userPattern.push(coord);
                checkPattern();
            });


            board.appendChild(square);
        }
    }
}

function shakeBoard() {
    const board = document.getElementById("chessboard");
    board.classList.add("shake");
    setTimeout(() => board.classList.remove("shake"), 400);
}

function checkPattern() {
    if (userPattern.length === 1) {
        if (userPattern[0] === correctPattern[0]) {

            const board = document.getElementById("chessboard");

            // Tahta başarı animasyonu
            board.classList.add("success");

            // 1) Tahta yok olduktan sonra login ekranı kayarak kapanacak
            setTimeout(() => {
                document.getElementById("login-screen").classList.add("slide-out");
            }, 800); // tahta animasyonu bittiği anda

            // 2) Login tamamen kaybolunca ana menü fade-in olur
            setTimeout(() => {
                document.getElementById("login-screen").classList.add("hidden");
                const menu = document.getElementById("main-menu");
                menu.classList.remove("hidden");
                menu.classList.add("fade-in");
            }, 1600);
        } else {
            const errorBox = document.getElementById("error-box");
            errorBox.classList.remove("hidden");

            setTimeout(() => {
                errorBox.classList.add("hidden");
            }, 2000);

            userPattern = [];
        }
    }
}

function resetScreens() {
    document.querySelectorAll("body > div").forEach(div => {
        if (div.id !== "login-screen") {
            div.classList.add("hidden");
        }
    });
}

createChessboard();
resetScreens();

// ----------------------------
// EKRAN KONTROLLERİ
// ----------------------------
function openGelir() {
    document.getElementById("main-menu").classList.add("hidden");
    document.getElementById("gelir-screen").classList.remove("hidden");
    document.getElementById("gelir-tarih").valueAsDate = new Date();
}

function closeGelir() {
    document.getElementById("gelir-screen").classList.add("hidden");
    document.getElementById("main-menu").classList.remove("hidden");
}

function openGider() {
    document.getElementById("main-menu").classList.add("hidden");
    document.getElementById("gider-screen").classList.remove("hidden");
    document.getElementById("gider-tarih").valueAsDate = new Date();
}

function closeGider() {
    document.getElementById("gider-screen").classList.add("hidden");
    document.getElementById("main-menu").classList.remove("hidden");
}

function openRapor() {
    document.getElementById("main-menu").classList.add("hidden");
    document.getElementById("rapor-screen").classList.remove("hidden");
}

function closeRapor() {
    document.getElementById("rapor-screen").classList.add("hidden");
    document.getElementById("main-menu").classList.remove("hidden");
}

function openListe() {
    document.getElementById("main-menu").classList.add("hidden");
    document.getElementById("liste-screen").classList.remove("hidden");
    loadKayitlar();
}

function closeListe() {
    document.getElementById("liste-screen").classList.add("hidden");
    document.getElementById("main-menu").classList.remove("hidden");
}

function openEvent() {
    document.getElementById("main-menu").classList.add("hidden");
    document.getElementById("event-screen").classList.remove("hidden");
    document.getElementById("event-tarih").valueAsDate = new Date();
}

function closeEvent() {
    document.getElementById("event-screen").classList.add("hidden");
    document.getElementById("main-menu").classList.remove("hidden");
}

function openEventList() {
    document.getElementById("main-menu").classList.add("hidden");
    document.getElementById("event-list-screen").classList.remove("hidden");
    loadEventList();
}

function closeEventList() {
    document.getElementById("event-list-screen").classList.add("hidden");
    document.getElementById("main-menu").classList.remove("hidden");
}


// ----------------------------
// SUPABASE BAĞLANTISI
// ----------------------------
const supabaseUrl = "https://zsbrwlbazzuzhgyjeoin.supabase.co";
const supabaseKey =
    "sb_publishable_qHsQArF3kWZIyyNk9WdLJg_NDJcz9mz"; // kısalttım ama sende tam hali var
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);


// ----------------------------
// GELİR EKLEME
// ----------------------------
async function kaydetGelir() {
    const tarih = document.getElementById("gelir-tarih").value;
    const nakit = parseFloat(document.getElementById("gelir-nakit").value || 0);
    const kredi = parseFloat(document.getElementById("gelir-kredi").value || 0);
    const delivery = parseFloat(document.getElementById("gelir-delivery").value || 0);

    const toplam = nakit + kredi + delivery;
    const payload = { tarih, nakit, kredi, delivery, toplam };

    const { error } = await supabase.from("gelir").insert(payload);
    if (error) alert(error.message);
    else {
        alert("Gelir kaydedildi!");
        closeGelir();
    }
}


// ----------------------------
// GİDER EKLEME
// ----------------------------
async function kaydetGider() {
    const tarih = document.getElementById("gider-tarih").value;
    const tutar = parseFloat(document.getElementById("gider-tutar").value || 0);
    const aciklama = document.getElementById("gider-aciklama").value;

    if (!tarih || !tutar) {
        alert("Lütfen tarih ve tutar girin!");
        return;
    }

    const payload = { tarih, tutar, aciklama };
    const { error } = await supabase.from("gider").insert(payload);

    if (error) alert(error.message);
    else {
        alert("Gider kaydedildi!");
        closeGider();
    }
}


// ----------------------------
// KAYIT LİSTELEME
// ----------------------------
async function loadKayitlar() {
    // GELİR
    const { data: gelirler } = await supabase
        .from("gelir")
        .select("*")
        .order("tarih", { ascending: false });

    let gelirHtml = "";
    gelirler.forEach(row => {
        gelirHtml += `
            <div class="card">
                <b>${row.tarih}</b><br>
                Nakit: ${row.nakit} € |
                Kredi: ${row.kredi} € |
                Delivery: ${row.delivery} € |
                <b>Toplam: ${row.toplam} €</b><br>
                <button onclick="duzenleGelir('${row.id}')">Düzenle</button>
                <button onclick="silGelir('${row.id}')">Sil</button>
            </div>
        `;
    });
    document.getElementById("gelir-liste").innerHTML = gelirHtml;

    // GİDER
    const { data: giderler } = await supabase
        .from("gider")
        .select("*")
        .order("tarih", { ascending: false });

    let giderHtml = "";
    giderler.forEach(row => {
        giderHtml += `
            <div class="card">
                <b>${row.tarih}</b><br>
                ${row.tutar} € → ${row.aciklama}<br>
                <button onclick="duzenleGider('${row.id}')">Düzenle</button>
                <button onclick="silGider('${row.id}')">Sil</button>
            </div>
        `;
    });
    document.getElementById("gider-liste").innerHTML = giderHtml;
}


// ----------------------------
// SİLME
// ----------------------------
async function silGelir(id) {
    if (!confirm("Bu gelir kaydı silinsin mi?")) return;
    await supabase.from("gelir").delete().eq("id", id);
    loadKayitlar();
}

async function silGider(id) {
    if (!confirm("Bu gider kaydı silinsin mi?")) return;
    await supabase.from("gider").delete().eq("id", id);
    loadKayitlar();
}


// ----------------------------
// DÜZENLEME — GELİR
// ----------------------------
let aktifGelirId = null;

async function duzenleGelir(id) {
    aktifGelirId = id;

    const { data } = await supabase.from("gelir").select("*").eq("id", id).single();

    document.getElementById("edit-gelir-tarih").value = data.tarih;
    document.getElementById("edit-gelir-nakit").value = data.nakit;
    document.getElementById("edit-gelir-kredi").value = data.kredi;
    document.getElementById("edit-gelir-delivery").value = data.delivery;

    document.getElementById("edit-gelir-modal").classList.remove("hidden");
}

async function kaydetGelirDuzenleme() {
    const tarih = document.getElementById("edit-gelir-tarih").value;
    const nakit = parseFloat(document.getElementById("edit-gelir-nakit").value);
    const kredi = parseFloat(document.getElementById("edit-gelir-kredi").value);
    const delivery = parseFloat(document.getElementById("edit-gelir-delivery").value);

    const toplam = nakit + kredi + delivery;

    await supabase
        .from("gelir")
        .update({ tarih, nakit, kredi, delivery, toplam })
        .eq("id", aktifGelirId);

    document.getElementById("edit-gelir-modal").classList.add("hidden");
    loadKayitlar();
}


// ----------------------------
// DÜZENLEME — GİDER
// ----------------------------
let aktifGiderId = null;

async function duzenleGider(id) {
    aktifGiderId = id;

    const { data } = await supabase.from("gider").select("*").eq("id", id).single();

    document.getElementById("edit-gider-tarih").value = data.tarih;
    document.getElementById("edit-gider-tutar").value = data.tutar;
    document.getElementById("edit-gider-aciklama").value = data.aciklama;

    document.getElementById("edit-gider-modal").classList.remove("hidden");
}

async function kaydetGiderDuzenleme() {
    const tarih = document.getElementById("edit-gider-tarih").value;
    const tutar = parseFloat(document.getElementById("edit-gider-tutar").value);
    const aciklama = document.getElementById("edit-gider-aciklama").value;

    await supabase
        .from("gider")
        .update({ tarih, tutar, aciklama })
        .eq("id", aktifGiderId);

    document.getElementById("edit-gider-modal").classList.add("hidden");
    loadKayitlar();
}


// ----------------------------
// EVENT — "DİĞER" ALANI
// ----------------------------
document.addEventListener("DOMContentLoaded", function () {
    const select = document.getElementById("event-secim");
    const manu = document.getElementById("event-manu");

    if (select) {
        select.addEventListener("change", () => {
            if (select.value === "diger") manu.classList.remove("hidden");
            else manu.classList.add("hidden");
        });
    }
});


// ----------------------------
// EVENT EKLEME
// ----------------------------
async function kaydetEvent() {
    const tarih = document.getElementById("event-tarih").value;
    const secim = document.getElementById("event-secim").value;

    let eventText = secim;
    if (secim === "diger") {
        eventText = document.getElementById("event-manu-text").value;
    }

    if (!tarih || !eventText) {
        alert("Lütfen event bilgilerini doldur!");
        return;
    }

    const payload = { tarih, event: eventText };
    const { error } = await supabase.from("event").insert(payload);

    if (error) alert(error.message);
    else {
        alert("Event kaydedildi!");
        closeEvent();
    }
}


// ----------------------------
// EVENT LİSTELEME
// ----------------------------
async function loadEventList() {
    const { data: events } = await supabase
        .from("event")
        .select("*")
        .order("tarih", { ascending: false });

    let html = "";
    events.forEach(e => {
        html += `
            <div class="card">
                <b>${e.tarih}</b> — ${e.event}
            </div>
        `;
    });

    document.getElementById("event-list").innerHTML = html;
}


// ----------------------------
// RAPOR
// ----------------------------
async function cekRapor() {
    const bas = document.getElementById("rapor-baslangic").value;
    const bit = document.getElementById("rapor-bitis").value;

    if (!bas || !bit) {
        alert("Lütfen tarih aralığını seç!");
        return;
    }

    const bitPlusOne = new Date(bit);
    bitPlusOne.setDate(bitPlusOne.getDate() + 1);
    const bitStr = bitPlusOne.toISOString().split("T")[0];

    const { data: gelir } = await supabase
        .from("gelir")
        .select("toplam, tarih")
        .gte("tarih", bas)
        .lt("tarih", bitStr);

    let toplamGelir = 0;
    gelir.forEach(r => toplamGelir += r.toplam);

    const { data: gider } = await supabase
        .from("gider")
        .select("tutar, tarih")
        .gte("tarih", bas)
        .lt("tarih", bitStr);

    let toplamGider = 0;
    gider.forEach(r => toplamGider += r.tutar);

    const net = toplamGelir - toplamGider;

    document.getElementById("rapor-sonuc").innerHTML = `
        <p>📅 <b>${bas}</b> – <b>${bit}</b></p>
        <p>💵 <b>Toplam Gelir:</b> ${toplamGelir.toFixed(2)} €</p>
        <p>🧾 <b>Toplam Gider:</b> ${toplamGider.toFixed(2)} €</p>
        <p>📊 <b>Net Kâr / Zarar:</b> ${net.toFixed(2)} €</p>
    `;
}
