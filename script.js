let audioCtx, noiseNode, isPlaying = false;

// دالة التنقل الذكي بين الأعداد
function loadOtherIssue(fileName) {
    console.log("جاري تحميل العدد: " + fileName);
    
    // إزالة أي ملف بيانات قديم موجود
    const oldScript = document.getElementById('data-script');
    if (oldScript) oldScript.remove();

    // إنشاء عنصر سكريبت جديد
    const newScript = document.createElement('script');
    newScript.id = 'data-script';
    
    // إضافة "رقم عشوائي" للرابط لمنع المتصفح من قراءة النسخة القديمة المخزنة
    newScript.src = fileName + "?t=" + new Date().getTime();
    
    newScript.onload = () => {
        console.log("تم تحميل البيانات بنجاح");
        updatePage(); // تحديث النصوص فوراً
    };

    newScript.onerror = () => {
        console.error("خطأ: لم يتم العثور على الملف " + fileName);
        alert("عذراً، تعذر تحميل هذا العدد. تأكد من وجود الملف في GitHub بنفس الاسم.");
    };

    document.body.appendChild(newScript);
}

// دالة توزيع النصوص على القالب
function updatePage() {
    if (typeof nidalData !== 'undefined') {
        document.getElementById('badge-display').innerText = "العدد: " + nidalData.issueNumber;
        document.getElementById('issue-display').innerText = "العدد: " + nidalData.issueNumber;
        document.getElementById('date-display').innerText = nidalData.date;
        document.getElementById('main-h').innerText = nidalData.mainHeadline;
        document.getElementById('main-t').innerText = nidalData.mainArticle;
        document.getElementById('sec-h').innerText = nidalData.secondHeadline;
        document.getElementById('sec-t').innerText = nidalData.secondArticle;
        
        // التمرير لأعلى الصفحة عند تبديل العدد
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// تشغيل الضجيج الكلاسيكي
function toggleNoise() {
    const btn = document.getElementById('music-btn');
    if (!isPlaying) {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const bufferSize = 2 * audioCtx.sampleRate;
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) { output[i] = Math.random() * 2 - 1; }
        noiseNode = audioCtx.createBufferSource();
        noiseNode.buffer = noiseBuffer;
        noiseNode.loop = true;
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

// التنفيذ عند أول دخول للموقع
window.onload = updatePage;
