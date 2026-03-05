// 1. إعدادات الاتصال بقاعدة بيانات جريدة النضال
const SUPABASE_URL = 'https://rorlhuphmyaimzjkmebn.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcmxodXBobXlhaW16amttZWJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2OTUyNzksImV4cCI6MjA4ODI3MTI3OX0.3dmBmlcv2MtyCVETHHL2JlS56CppYKyAp6llLxUuClQ';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let nidalArchive = [];

// 2. جلب الأعداد من السحاب فور فتح الموقع
async function fetchIssues() {
    console.log("جاري جلب الأعداد من قاعدة بيانات النضال...");
    const { data, error } = await _supabase
        .from('issues')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        console.error("خطأ في جلب البيانات:", error.message);
        document.getElementById('main-h').innerText = "خطأ في الاتصال بقاعدة البيانات";
    } else {
        nidalArchive = data;
        renderDropdown();
        if (data && data.length > 0) {
            // عرض آخر عدد تم نشره تلقائياً
            loadOtherIssue(data.length - 1);
        } else {
            document.getElementById('main-h').innerText = "مرحباً بك في جريدة النضال. لا يوجد أعداد منشورة حالياً، اضغط على زر (+) لإضافة العدد الأول.";
        }
    }
}

// 3. دالة إضافة عدد جديد (+) ونشره للعالم
async function addNewIssue() {
    const mHeadline = prompt("📌 عنوان المانشيت الرئيسي:");
    if (!mHeadline) return; // إلغاء إذا لم يتم إدخال عنوان

    const mArticle = prompt("📝 نص المقال الرئيسي:");
    const sHeadline = prompt("📎 عنوان المقال الجانبي:");
    const sArticle = prompt("🖋️ نص المقال الجانبي:");

    const nextIssueNum = (nidalArchive.length + 1).toString();
    const today = new Date().toLocaleDateString('ar-SA', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    const newIssue = {
        issue_number: nextIssueNum,
        date: today,
        main_headline: mHeadline,
        main_article: mArticle,
        second_headline: sHeadline,
        second_article: sArticle
    };

    // إرسال البيانات إلى Supabase
    const { error } = await _supabase.from('issues').insert([newIssue]);

    if (error) {
        alert("حدث خطأ أثناء النشر: " + error.message);
    } else {
        alert("✅ تم نشر العدد رقم " + nextIssueNum + " في جريدة النضال بنجاح!");
        fetchIssues(); // تحديث الأرشيف وعرض العدد الجديد
    }
}

// 4. بناء قائمة الأعداد في القائمة المنسدلة
function renderDropdown() {
    const select = document.getElementById('archive-select');
    if (!select) return;
    
    select.innerHTML = '';
    nidalArchive.forEach((issue, index) => {
        let opt = document.createElement('option');
        opt.value = index;
        opt.innerText = `العدد رقم ${issue.issue_number}`;
        select.appendChild(opt);
    });
}

// 5. عرض محتوى العدد المختار في الصفحة
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
        
        // تحديث القائمة المنسدلة لتطابق الاختيار
        const select = document.getElementById('archive-select');
        if (select) select.value = index;

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// 6. محرك صوت الضجيج الكلاسيكي
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

// تشغيل جلب البيانات عند تحميل الصفحة
window.onload = fetchIssues;
