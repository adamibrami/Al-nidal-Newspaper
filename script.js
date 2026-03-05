// إعدادات الاتصال والرقم السري
const SUPABASE_URL = 'https://rorlhuphmyaimzjkmebn.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcmxodXBobXlhaW16amttZWJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2OTUyNzksImV4cCI6MjA4ODI3MTI3OX0.3dmBmlcv2MtyCVETHHL2JlS56CppYKyAp6llLxUuClQ';
const ADMIN_PASSWORD = "20009999";

let _supabase;
let nidalArchive = [];

// التحقق من تحميل المكتبة والبدء
window.onload = () => {
    if (typeof supabase !== 'undefined') {
        _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        fetchIssues();
    } else {
        alert("فشل تحميل نظام السحاب. تأكد من اتصال الإنترنت أو رابط المكتبة في HTML");
    }
};

// بوابة الرقم السري
function checkAuth() {
    const pass = prompt("الرجاء إدخال الرقم السري للإدارة:");
    if (pass === ADMIN_PASSWORD) return true;
    alert("❌ رقم سري خاطئ!");
    return false;
}

// جلب البيانات من السحاب
async function fetchIssues() {
    const { data, error } = await _supabase
        .from('issues')
        .select('*')
        .order('id', { ascending: true });

    if (!error) {
        nidalArchive = data;
        renderDropdown();
        if (data.length > 0) loadOtherIssue(data.length - 1);
        else document.getElementById('main-h').innerText = "الأرشيف فارغ حالياً.";
    }
}

// إضافة عدد جديد
async function addNewIssue() {
    if (!checkAuth()) return;
    const mH = prompt("العنوان الرئيسي:");
    const mT = prompt("نص المقال:");
    const sH = prompt("العنوان الجانبي:");
    const sT = prompt("النص الجانبي:");

    if (!mH) return;

    const { error } = await _supabase.from('issues').insert([{
        issue_number: (nidalArchive.length + 1).toString(),
        date: new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        main_headline: mH,
        main_article: mT,
        second_headline: sH,
        second_article: sT
    }]);

    if (error) alert("خطأ في النشر: " + error.message);
    else fetchIssues();
}

// تعديل العدد
async function editCurrentIssue() {
    if (!checkAuth()) return;
    const idx = document.getElementById('archive-select').value;
    const item = nidalArchive[idx];
    if (!item) return;

    const newH = prompt("تعديل العنوان:", item.main_headline);
    const newT = prompt("تعديل النص:", item.main_article);

    const { error } = await _supabase.from('issues').update({ main_headline: newH, main_article: newT }).eq('id', item.id);
    if (error) alert("فشل التعديل");
    else fetchIssues();
}

// حذف العدد
async function deleteCurrentIssue() {
    if (!checkAuth()) return;
    const idx = document.getElementById('archive-select').value;
    const item = nidalArchive[idx];
    if (!item || !confirm("حذف العدد نهائياً؟")) return;

    const { error } = await _supabase.from('issues').delete().eq('id', item.id);
    if (error) alert("فشل الحذف");
    else fetchIssues();
}

// عرض البيانات
function renderDropdown() {
    const select = document.getElementById('archive-select');
    select.innerHTML = '';
    nidalArchive.forEach((item, i) => {
        let opt = document.createElement('option');
        opt.value = i; opt.innerText = `العدد رقم ${item.issue_number}`;
        select.appendChild(opt);
    });
}

function loadOtherIssue(index) {
    const data = nidalArchive[index];
    if (data) {
        document.getElementById('badge-display').innerText = "العدد: " + data.issue_number;
        document.getElementById('issue-display').innerText = "العدد: " + data.issue_number;
        document.getElementById('date-display').innerText = data.date;
        document.getElementById('main-h').innerText = data.main_headline;
        document.getElementById('main-t').innerText = data.main_article;
        document.getElementById('sec-h').innerText = data.second_headline || '';
        document.getElementById('sec-t').innerText = data.second_article || '';
        document.getElementById('archive-select').value = index;
    }
}

// محرك الضجيج
let audioCtx, noiseNode, isPlaying = false;
function toggleNoise() {
    const btn = document.getElementById('music-btn');
    if (!isPlaying) {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const bufferSize = 2 * audioCtx.sampleRate;
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) { output[i] = Math.random() * 2 - 1; }
        noiseNode = audioCtx.createBufferSource();
        noiseNode.buffer = noiseBuffer; noiseNode.loop = true;
        const filter = audioCtx.createBiquadFilter();
        filter.type = "lowpass"; filter.frequency.value = 850;
        const gain = audioCtx.createGain(); gain.gain.value = 0.02;
        noiseNode.connect(filter).connect(gain).connect(audioCtx.destination);
        noiseNode.start();
        btn.innerText = "🔇 إيقاف الضجيج"; isPlaying = true;
    } else {
        if (noiseNode) { noiseNode.stop(); noiseNode.disconnect(); }
        btn.innerText = "📻 تشغيل الضجيج"; isPlaying = false;
    }
}
