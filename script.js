let audioCtx, noiseNode, isPlaying = false;

function loadOtherIssue(fileName) {
    const oldScript = document.getElementById('data-script');
    if(oldScript) oldScript.remove();
    const newScript = document.createElement('script');
    newScript.id = 'data-script';
    newScript.src = fileName + "?v=" + new Date().getTime();
    newScript.onload = () => { updatePage(); };
    document.body.appendChild(newScript);
}

function updatePage() {
    if (typeof nidalData !== 'undefined') {
        document.getElementById('badge-display').innerText = "العدد: " + nidalData.issueNumber;
        document.getElementById('issue-display').innerText = "العدد: " + nidalData.issueNumber;
        document.getElementById('date-display').innerText = nidalData.date;
        document.getElementById('main-h').innerText = nidalData.mainHeadline;
        document.getElementById('main-t').innerText = nidalData.mainArticle;
        document.getElementById('sec-h').innerText = nidalData.secondHeadline;
        document.getElementById('sec-t').innerText = nidalData.secondArticle;
    }
}

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

window.onload = updatePage;
