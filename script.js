/**
 * نظام إدارة محتوى جريدة النضال
 */

// 1. البيانات الأساسية (الأعداد الدائمة)
const defaultIssues = {
    "issue1": {
        issueNumber: "١",
        date: "الخميس، ٥ مارس ٢٠٢٦",
        mainHeadline: "النضال: صوتٌ جديد يولد من رحم الكلمة في جدة",
        mainArticle: "اليوم، وفي هذه اللحظة التاريخية، نطلق العدد الأول من جريدة 'النضال'. ليست مجرد صحيفة إلكترونية، بل هي محاولة لاستعادة هيبة الكلمة المطبوعة في زمن الضجيج الرقمي.\n\nإن 'النضال' هي مشروع يهدف إلى تقديم صحافة حقيقية، تعتمد على المصادر الموثوقة وتلتزم بالحياد التام.",
        secondHeadline: "شؤون الساعة: تحديات العصر الرقمي",
        secondArticle: "في هذا القسم، نسلط الضوء على الأثر الذي خلفته التكنولوجيا على وعي الإنسان المعاصر."
    },
    "issue2": {
        issueNumber: "٢",
        date: "الجمعة، ٦ مارس ٢٠٢٦",
        mainHeadline: "إرنستو 'تشي' جيفارا: من معاطف الطب البيضاء إلى خنادق الحرية",
        mainArticle: "تبدأ قصة النضال لدى إرنستو جيفارا من اللحظة التي قرر فيها الطبيب الشاب أن يخلع معطفه الأبيض ليجوب قارة أمريكا اللاتينية على دراجته النارية. رأى بعينيه الفقر الممنهج والظلم، فأدرك أن 'الطب' وحده لا يشفي شعوباً تحتضر.\n\nآمن جيفارا بأن 'الثائر الحقيقي يقوده شعور عظيم بالحب'، وهو الحب الذي دفعه لترك مناصبه الوزارية في كوبا ليعود إلى الغابات، مؤمناً بأن الثورة لا تنتهي عند حدود دولة، بل هي نضال عالمي ضد الاستغلال.",
        secondHeadline: "فلسفة الصمود: لماذا يبقى جيفارا ملهماً؟",
        secondArticle: "يكمن سر بقاء جيفارا في 'صدق التجربة'. لم يكن منظراً يكتب من المكاتب المكيفة، بل كان أول من يمسك بالمعول في العمل التطوعي، وآخر من يأكل في الخندق."
    }
};

// 2. دمج الأعداد الأساسية مع الأعداد التي أضفتها أنت (المخزنة في المتصفح)
let customIssues = JSON.parse(localStorage.getItem('nidal_custom_db')) || {};
let fullArchive = { ...defaultIssues, ...customIssues };

// 3. دالة إضافة عدد جديد (+)
function addNewIssue() {
    const nextNum = Object.keys(fullArchive).length + 1;
    const id = "issue" + nextNum;
    
    const mHeadline = prompt("📌 أدخل عنوان المانشيت الرئيسي:");
    if (!mHeadline) return; // إلغاء إذا لم يدخل عنواناً

    const mArticle = prompt("📝 اكتب نص المقال الرئيسي:");
    const sHeadline = prompt("📎 عنوان المقال الجانبي:");
    const sArticle = prompt("🖋️ نص المقال الجانبي:");

    const newIssue = {
        issueNumber: nextNum.toString(),
        date: new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        mainHeadline: mHeadline,
        mainArticle: mArticle,
        secondHeadline: sHeadline,
        secondArticle: sArticle
    };

    // حفظ العدد الجديد
    customIssues[id] = newIssue;
    localStorage.setItem('nidal_custom_db', JSON.stringify(customIssues));
    
    // تحديث الأرشيف الكلي وإعادة بناء القائمة
    fullArchive = { ...defaultIssues, ...customIssues };
    renderDropdown();
    loadOtherIssue(id);
    
    alert("✅ تم نشر العدد رقم " + nextNum + " بنجاح!");
}

// 4. دالة بناء قائمة اختيار الأعداد
function renderDropdown() {
    const select = document.getElementById('archive-select');
    select.innerHTML = '';
    for (let key in fullArchive) {
        let opt = document.createElement('option');
        opt.value = key;
        opt.innerText = `العدد رقم ${fullArchive[key].issueNumber}`;
        select.appendChild(opt);
    }
}

// 5. دالة عرض محتوى العدد المختار
function loadOtherIssue(issueKey) {
    const data = fullArchive[issueKey];
    if (data) {
        document.getElementById('badge-display').innerText = "العدد: " + data.issueNumber;
        document.getElementById('issue-display').innerText = "العدد: " + data.issueNumber;
        document.getElementById('date-display').innerText = data.date;
        document.getElementById('main-h').innerText = data.mainHeadline;
        document.getElementById('main-t').innerText = data.mainArticle;
        document.getElementById('sec-h').innerText = data.secondHeadline;
        document.getElementById('sec-t').innerText = data.secondArticle;
        
        // تحديث القائمة لتشير للعدد الحالي
        document.getElementById('archive-select').value = issueKey;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// 6. محرك صوت الضجيج
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

// تشغيل الموقع لأول مرة
window.onload = () => {
    renderDropdown();
    // تحميل آخر عدد موجود تلقائياً
    const keys = Object.keys(fullArchive);
    loadOtherIssue(keys[keys.length - 1]);
};
