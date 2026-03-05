const SUPABASE_URL = 'https://rorlhuphmyaimzjkmebn.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvcmxodXBobXlhaW16amttZWJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2OTUyNzksImV4cCI6MjA4ODI3MTI3OX0.3dmBmlcv2MtyCVETHHL2JlS56CppYKyAp6llLxUuClQ';
const ADMIN_PASSWORD = "20009999"; 

let _supabase;
let nidalArchive = [];

window.onload = () => {
    _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    fetchIssues();
};

function checkAuth() {
    return prompt("الرقم السري للإدارة:") === ADMIN_PASSWORD ? true : (alert("خطأ!"), false);
}

async function fetchIssues() {
    const { data, error } = await _supabase.from('issues').select('*').order('id', { ascending: true });
    if (!error) {
        nidalArchive = data;
        renderDropdown();
        if (data.length > 0) loadOtherIssue(data.length - 1);
        else document.getElementById('main-h').innerText = "الأرشيف فارغ.";
    }
}

async function addNewIssue() {
    if (!checkAuth()) return;
    const mH = prompt("العنوان:");
    const mT = prompt("المقال:");
    await _supabase.from('issues').insert([{
        issue_number: (nidalArchive.length + 1).toString(),
        date: new Date().toLocaleDateString('ar-SA'),
        main_headline: mH, main_article: mT
    }]);
    fetchIssues();
}

async function editCurrentIssue() {
    if (!checkAuth()) return;
    const item = nidalArchive[document.getElementById('archive-select').value];
    const newH = prompt("تعديل العنوان:", item.main_headline);
    const newT = prompt("تعديل النص:", item.main_article);
    await _supabase.from('issues').update({ main_headline: newH, main_article: newT }).eq('id', item.id);
    fetchIssues();
}

async function deleteCurrentIssue() {
    if (!checkAuth()) return;
    const item = nidalArchive[document.getElementById('archive-select').value];
    if (confirm("حذف؟")) {
        await _supabase.from('issues').delete().eq('id', item.id);
        fetchIssues();
    }
}

function renderDropdown() {
    const select = document.getElementById('archive-select');
    select.innerHTML = '';
    nidalArchive.forEach((item, i) => {
        let opt = document.createElement('option');
        opt.value = i; opt.innerText = `العدد ${item.issue_number}`;
        select.appendChild(opt);
    });
}

function loadOtherIssue(index) {
    const data = nidalArchive[index];
    if (data) {
        document.getElementById('issue-display').innerText = "العدد: " + data.issue_number;
        document.getElementById('date-display').innerText = data.date;
        document.getElementById('main-h').innerText = data.main_headline;
        document.getElementById('main-t').innerText = data.main_article;
    }
}
