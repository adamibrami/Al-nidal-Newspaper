/**
 * أرشيف بيانات جريدة النضال
 * يتم تخزين الأعداد هنا مباشرة لتجنب مشاكل التحميل والـ Diff في GitHub
 */
const nidalArchive = {
    "issue1": {
        issueNumber: "١",
        date: "الخميس، ٥ مارس ٢٠٢٦",
        mainHeadline: "النضال: صوتٌ جديد يولد من رحم الكلمة في جدة",
        mainArticle: "اليوم، وفي هذه اللحظة التاريخية، نطلق العدد الأول من جريدة 'النضال'. ليست مجرد صحيفة إلكترونية، بل هي محاولة لاستعادة هيبة الكلمة المطبوعة في زمن الضجيج الرقمي. اخترنا أن يكون التصميم كلاسيكياً، يذكرنا برائحة الورق في السبعينات، لنمنح القارئ مساحة من الهدوء والتركيز.\n\nإن 'النضال' هي مشروع يهدف إلى تقديم صحافة حقيقية، تعتمد على المصادر الموثوقة وتلتزم بالحياد التام، مع التركيز على قضايا الإنسان العربي وهمومه المعاصرة. نحن هنا لنكتب التاريخ، بمدادٍ من الوعي والإدراك.",
        secondHeadline: "شؤون الساعة: تحديات العصر الرقمي",
        secondArticle: "في هذا القسم، نسلط الضوء على الأثر الذي خلفته التكنولوجيا على وعي الإنسان المعاصر. هل فقدنا القدرة على التأمل؟ 'النضال' تسعى للإجابة على هذا التساؤل من خلال مقالات تحليلية معمقة تشارككم فيها الرؤية والتحليل بصوت هادئ وسط صخب العالم."
    },
    "issue2": {
        issueNumber: "٢",
        date: "الجمعة، ٦ مارس ٢٠٢٦",
        mainHeadline: "إرنستو 'تشي' جيفارا: من معاطف الطب البيضاء إلى خنادق الحرية",
        mainArticle: "تبدأ قصة النضال لدى إرنستو جيفارا من اللحظة التي قرر فيها الطبيب الشاب أن يخلع معطفه الأبيض ليجوب قارة أمريكا اللاتينية على دراجته النارية. هناك، رأى بعينيه الفقر الممنهج والظلم الذي يرزح تحت وطأته الفلاحون، فأدرك أن 'الطب' وحده لا يشفي شعوباً تحتضر تحت وطأة الاستعمار والتبعية. \n\nلقد كان لقاؤه بفيدل كاسترو في المكسيك نقطة التحول؛ حيث تحول الطبيب الأرجنتيني إلى 'التشي' (الرفيق). لم تكن ثورته مجرد صراع عسكري، بل كانت نضالاً أخلاقياً قبل كل شيء. آمن جيفارا بأن 'الثائر الحقيقي يقوده شعور عظيم بالحب'، وهو الحب الذي دفعه لترك مناصبه الوزارية في كوبا بعد نجاح الثورة، ليعود إلى الغابات في الكونغو ثم بوليفيا، مؤمناً بأن الثورة لا تنتهي عند حدود دولة، بل هي نضال عالمي ضد الاستغلال.\n\nإن حياة جيفارا هي تجسيد لمفهوم 'الإنسان الجديد' الذي ينكر ذاته من أجل الجماعة. ورغم وقوعه في الأسر وإعدامه في غابات بوليفيا عام 1967، إلا أن موته كان الولادة الحقيقية لأسطورة لم تنطفئ. لقد تحولت صورته بـ 'البيريه' الأسود إلى رمز عالمي للنضال، لا كشخص، بل كفكرة تقول: 'بإمكانكم قتل الثائر، لكنكم لن تقتلوا الثورة'.",
        secondHeadline: "فلسفة الصمود: لماذا يبقى جيفارا ملهماً للأجيال؟",
        secondArticle: "يكمن سر بقاء جيفارا في وجدان الأجيال في 'صدق التجربة'. لم يكن منظراً يكتب من المكاتب المكيفة، بل كان أول من يمسك بالمعول في العمل التطوعي، وآخر من يأكل في الخندق. نضاله لم يكن سياسياً بحتًا، بل كان نضالاً ضد 'الأنانية البشرية'. \n\nفي هذا الجزء، نسلط الضوء على رسائله الأخيرة لأبنائه ولشعوب العالم، وكيف أرسى قواعد 'حرب العصابات' ليس فقط كالتزام عسكري، بل كمنهج للصمود الشعبي. إن 'النضال' اليوم يتمثل في الحفاظ على هذا الوعي التاريخي حياً، ليكون منارة لكل من يرفض الخضوع للواقع المرير."
    }
};

/**
 * وظيفة التنقل الفوري بين الأعداد
 */
function loadOtherIssue(issueKey) {
    const data = nidalArchive[issueKey];
    
    if (data) {
        // تحديث جميع عناصر الصفحة بناءً على العدد المختار
        document.getElementById('badge-display').innerText = "العدد: " + data.issueNumber;
        document.getElementById('issue-display').innerText = "العدد: " + data.issueNumber;
        document.getElementById('date-display').innerText = data.date;
        document.getElementById('main-h').innerText = data.mainHeadline;
        document.getElementById('main-t').innerText = data.mainArticle;
        document.getElementById('sec-h').innerText = data.secondHeadline;
        document.getElementById('sec-t').innerText = data.secondArticle;

        // العودة لأعلى الصفحة بنعومة
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

/**
 * محرك صوت الضجيج الكلاسيكي (White Noise)
 */
let audioCtx, noiseNode, isPlaying = false;

function toggleNoise() {
    const btn = document.getElementById('music-btn');
    if (!isPlaying) {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        const bufferSize = 2 * audioCtx.sampleRate;
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        noiseNode = audioCtx.createBufferSource();
        noiseNode.buffer = noiseBuffer;
        noiseNode.loop = true;

        const filter = audioCtx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 850; // تردد ناعم

        const gain = audioCtx.createGain();
        gain.gain.value = 0.02; // مستوى صوت هادئ

        noiseNode.connect(filter).connect(gain).connect(audioCtx.destination);
        noiseNode.start();
        btn.innerText = "🔇 إيقاف الضجيج"; 
        isPlaying = true;
    } else {
        if (noiseNode) { noiseNode.stop(); noiseNode.disconnect(); }
        btn.innerText = "📻 تشغيل الضجيج"; 
        isPlaying = false;
    }
}

// تحميل العدد الأول تلقائياً عند فتح الموقع
window.onload = () => {
    loadOtherIssue("issue1");
};
