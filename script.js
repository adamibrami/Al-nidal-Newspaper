const SUPABASE_URL = 'https://rorlhuphmyaimzjkmebn.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcmxodXBobXlhaW16amttZWJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2OTUyNzksImV4cCI6MjA4ODI3MTI3OX0.3dmBmlcv2MtyCVETHHL2JlS56CppYKyAp6llLxUuClQ';
const ADMIN_PASSWORD = "20009999"; 

let _supabase;
let nidalArchive = [];

// التأكد من عمل السحاب
window.onload = () => {
    if (typeof supabase !== 'undefined') {
        _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        fetchIssues();
    } else {
        alert("فشل تحميل المكتبة! تأكد من وجود سطر script الخاص بـ supabase في ملف HTML");
    }
};

// وظيفة كلمة السر
function checkAuth() {
    const pass = prompt("الرجاء إدخال رقم السر (20009999):");
    if (pass === ADMIN_PASSWORD) return true;
    alert("الرقم السري الذي أدخلته غير صحيح!");
    return false;
}

// جلب البيانات
async function fetchIssues() {
    const { data, error } = await _supabase.from('issues').select('*').order('id', { ascending: true });
    if (!error) {
        nidalArchive = data;
        renderDropdown();
        if (data.length > 0) loadOtherIssue(data.length - 1);
    }
}

// إضافة مقال (الزر +)
async function addNewIssue() {
    console.log("تم الضغط على زر الإضافة"); // للتأكد أن الزر يستجيب
    if (!checkAuth()) return; 

    const mH = prompt("العنوان الرئيسي:");
    if (!mH) return;
    const mT = prompt("النص الرئيسي:");

    const { error } = await _supabase.from('issues').insert([{
        issue_number: (nidalArchive.length + 1).toString(),
        date: new Date().toLocaleDateString('ar-SA'),
        main_headline: mH,
        main_article: mT
    }]);

    if (error) alert("خطأ في السحاب: " + error.message);
    else fetchIssues();
}

// باقي الدوال (renderDropdown, loadOtherIssue, toggleNoise) تبقى كما هي في الكود السابق
// سأضعها لك كاملة في حال أردت النسخ الشامل
function renderDropdown() {
    const select = document.getElementById('archive-select');
    if(select) {
        select.innerHTML = '';
        nidalArchive.forEach((item, i) => {
            let opt = document.createElement('option');
            opt.value = i; opt.innerText = `العدد رقم ${item.issue_number}`;
            select.appendChild(opt);
        });
    }
}

function loadOtherIssue(index) {
    const data = nidalArchive[index];
    if (data) {
        document.getElementById('badge-display').innerText = "العدد: " + data.issue_number;
        document.getElementById('main-h').innerText = data.main_headline;
        document.getElementById('main-t').innerText = data.main_article;
    }
}
