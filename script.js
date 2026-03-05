// 1. إعدادات الاتصال بجريدة النضال
const SUPABASE_URL = 'https://rorlhuphmyaimzjkmebn.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcmxodXBobXlhaW16amttZWJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2OTUyNzksImV4cCI6MjA4ODI3MTI3OX0.3dmBmlcv2MtyCVETHHL2JlS56CppYKyAp6llLxUuClQ';
const ADMIN_PASSWORD = "20009999"; // الرقم السري الخاص بك

let _supabase;
let nidalArchive = [];

// 2. تشغيل المحرك فور تحميل الصفحة
window.onload = () => {
    if (typeof supabase !== 'undefined') {
        _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        fetchIssues();
    } else {
        alert("خطأ: لم يتم تحميل مكتبة الاتصال. تأكد من وجود سطر المكتبة في HTML");
    }
};

// 3. وظيفة التحقق من الرقم السري
function checkAuth() {
    const pass = prompt("الرجاء إدخال رقم السر لإدارة جريدة النضال:");
    if (pass === ADMIN_PASSWORD) {
        return true;
    } else {
        alert("⚠️ الرقم السري خاطئ! لا يمكنك إجراء تعديلات.");
        return false;
    }
}

// 4. جلب كافة الأعداد من قاعدة البيانات
async function fetchIssues() {
    const { data, error } = await _supabase
        .from('issues')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        console.error("خطأ:", error.message);
    } else {
        nidalArchive = data;
        renderDropdown();
        if (data && data.length > 0) {
            loadOtherIssue(data.length - 1);
        } else {
            document.getElementById('main-h').innerText = "الأرشيف فارغ. اضغط (+) للنشر.";
        }
    }
}

// 5. إضافة عدد جديد
async function addNewIssue() {
    if (!checkAuth()) return; // حماية

    const mH = prompt("📌 المانشيت الرئيسي:");
    if (!mH) return;
    const mT = prompt("📝 نص المقال الرئيسي:");
    const sH = prompt("📎 عنوان المقال الجانبي:");
    const sT = prompt("🖋️ نص المقال الجانبي:");

    const newEntry = {
        issue_number: (nidalArchive.length + 1).toString(),
        date: new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        main_headline: mH,
        main_article: mT,
        second_headline: sH,
        second_article: sT
    };

    const { error } = await _supabase.from('issues').insert([newEntry]);
    if (error) alert("خطأ في النشر: " + error.message);
    else fetchIssues();
}

// 6. تعديل العدد الحالي
async function editCurrentIssue() {
    if (!checkAuth()) return; // حماية

    const idx = document.getElementById('archive-select').value;
    const issue = nidalArchive[idx];
    if (!issue) return;

    const newH = prompt("تعديل العنوان:", issue.main_headline);
    const newT = prompt("تعديل النص:", issue.main_article);

    if (newH && newT) {
        const { error } = await _supabase
            .from('issues')
            .update({ main_headline: newH, main_article: newT })
            .eq('id', issue.id);
        
        if (error) alert("خطأ في التعديل: " + error.message);
        else fetchIssues();
    }
}

// 7. حذف العدد الحالي
async function deleteCurrentIssue() {
    if (!checkAuth()) return; // حماية

    const idx = document.getElementById('archive-select').value;
    const issue = nidalArchive[idx];
    if (!issue || !confirm("⚠️ هل أنت متأكد من حذف هذا العدد نهائياً من جريدة النضال؟")) return;

    const { error } = await _supabase.from('issues').delete().eq('id', issue.id);
    if (error) alert("خطأ في الحذف");
    else fetchIssues();
}

// 8. عرض البيانات وتحديث القائمة
function renderDropdown() {
    const select = document.getElementById('archive-select');
    if (!select) return;
    select.innerHTML = '';
    nidalArchive.forEach((item, i) => {
        let opt = document.createElement('option');
        opt.value = i;
        opt.innerText = `العدد رقم ${item.issue_number}`;
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
        document.getElementById('sec-h').innerText = data.second_headline;
        document.getElementById('sec-t').innerText = data.second_article;
        document.getElementById('archive-select').value = index;
    }
}

// 9. محرك الضجيج (Noise)
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
