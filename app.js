// State Management
let activeDomain = 'python';
let sleepTimer = 0;
let absenceTimer = 0;
let hasSentWhatsapp = false;
let isAlerting = false;
let quizActive = false;

// Statistics
let totalStudySeconds = 0;
let alertsCount = 0;
let solvedQuizzesCount = 0;
let trackingStarted = false;
let studyTimerInterval = null;

// MediaPipe FaceMesh
let faceMesh = null;
let currentStream = null;

// Web Audio API Alarm Synth
let audioCtx = null;
let alarmOscillator = null;
let alarmGain = null;
let alarmInterval = null;

// Selectors
const video = document.getElementById('video');
const canvas = document.getElementById('overlayCanvas');
const ctx = canvas.getContext('2d');
const setupOverlay = document.getElementById('setupOverlay');
const quizOverlay = document.getElementById('quizOverlay');
const quizQuestionText = document.getElementById('quizQuestionText');
const quizOptionsContainer = document.getElementById('quizOptionsContainer');
const alarmAudio = document.getElementById('alarm');

// UI Elements for Stats & Status
const studyTimerEl = document.getElementById('studyTimer');
const alertCounterEl = document.getElementById('alertCounter');
const correctQuizzesEl = document.getElementById('correctQuizzes');
const accuracyValEl = document.getElementById('accuracyVal');
const statusMessageEl = document.getElementById('statusMessage');
const statusBarEl = document.getElementById('statusBar');
const headerStatusEl = document.getElementById('headerStatus');
const headerDotEl = document.getElementById('headerDot');

// Set up Domain Card Event Listeners
document.querySelectorAll('.domain-card').forEach(card => {
    card.addEventListener('click', () => {
        if (quizActive) return; // Freeze selections during active alert quiz
        
        document.querySelectorAll('.domain-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        activeDomain = card.getAttribute('data-domain');
        
        showStatus(`Switched study domain to: ${card.querySelector('.domain-name').innerText}`, 'info');
    });
});

// Show Status Helpers
function showStatus(msg, type = 'normal') {
    statusMessageEl.innerText = msg;
    if (type === 'alert') {
        statusBarEl.className = 'status-bar alert-active';
        headerStatusEl.innerText = 'ALERT ACTIVE';
        headerDotEl.style.background = 'var(--alert-rose)';
        headerDotEl.style.boxShadow = '0 0 12px var(--alert-rose)';
    } else if (type === 'normal') {
        statusBarEl.className = 'status-bar';
        headerStatusEl.innerText = 'Monitoring Active';
        headerDotEl.style.background = 'var(--accent-emerald)';
        headerDotEl.style.boxShadow = '0 0 12px var(--accent-emerald)';
    } else {
        statusBarEl.className = 'status-bar';
    }
}

// Start Timer
function startStudyTimer() {
    if (studyTimerInterval) clearInterval(studyTimerInterval);
    studyTimerInterval = setInterval(() => {
        if (!quizActive && trackingStarted) {
            totalStudySeconds++;
            const mins = String(Math.floor(totalStudySeconds / 60)).padStart(2, '0');
            const secs = String(totalStudySeconds % 60).padStart(2, '0');
            studyTimerEl.innerText = `${mins}:${secs}`;
            updateAccuracy();
        }
    }, 1000);
}

// Update Accuracy / Focus Rating
function updateAccuracy() {
    if (totalStudySeconds === 0) {
        accuracyValEl.innerText = "100%";
        return;
    }
    // Simple penalty model: -8% per alert triggered
    const rating = Math.max(0, 100 - (alertsCount * 8));
    accuracyValEl.innerText = `${rating}%`;
}

// Web Audio API Synthesizer Alarm
function startSynthAlarm() {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        // Setup oscillator and gain node
        alarmGain = audioCtx.createGain();
        alarmGain.gain.setValueAtTime(0, audioCtx.currentTime);
        alarmGain.connect(audioCtx.destination);

        // Repetitive alarm pattern
        let beep = true;
        alarmInterval = setInterval(() => {
            if (!isAlerting) return;
            
            // Create a short oscillator beep
            const osc = audioCtx.createOscillator();
            osc.type = 'sawtooth';
            // High frequency alert
            osc.frequency.setValueAtTime(beep ? 880 : 660, audioCtx.currentTime);
            osc.connect(alarmGain);
            
            alarmGain.gain.setValueAtTime(0.15, audioCtx.currentTime); // controlled volume
            osc.start();
            
            // Stop beep after 180ms
            setTimeout(() => {
                osc.stop();
                osc.disconnect();
            }, 180);
            
            beep = !beep;
        }, 350);
        
    } catch (e) {
        console.error("Web Audio API failed to start: ", e);
    }
}

function stopSynthAlarm() {
    if (alarmInterval) {
        clearInterval(alarmInterval);
        alarmInterval = null;
    }
    if (alarmGain) {
        alarmGain.disconnect();
        alarmGain = null;
    }
}

// Trigger Alert and pop up Multiple-Choice Question
function triggerAlert(alertType) {
    if (quizActive) return; // Prevent double alerts
    
    quizActive = true;
    isAlerting = true;
    alertsCount++;
    alertCounterEl.innerText = alertsCount;
    updateAccuracy();
    
    // Play alert sound (audio file)
    alarmAudio.play().catch(err => {
        console.log("Audio play blocked/failed, using synth fallback: ", err);
    });
    
    // Start synthetic fallback beep alarm
    startSynthAlarm();
    
    showStatus(`🚨 ALERT: STUDENT IS ${alertType === 'sleep' ? 'SLEEPING' : 'ABSENT'}!`, 'alert');
    
    // Fire WhatsApp notification
    if (!hasSentWhatsapp) {
        sendWhatsAppNotification();
        hasSentWhatsapp = true;
    }
    
    // Select and display Quiz
    displayQuiz();
}

function stopAlert() {
    isAlerting = false;
    quizActive = false;
    stopSynthAlarm();
    
    alarmAudio.pause();
    alarmAudio.currentTime = 0;
    
    showStatus("Student is studying properly", "normal");
}

// WhatsApp Webhook Function (preserved from original)
async function sendWhatsAppNotification() {
    console.log("Sending alert trigger to backend server...");
    try {
        const response = await fetch('http://localhost:3000/send-whatsapp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        if (data.success) {
            console.log("WhatsApp request processed successfully!");
        }
    } catch (err) {
        console.warn("Could not reach backend server (this is normal if no local server is running):", err);
    }
}

// Quiz display and answer verification
let currentQuestionObj = null;

function displayQuiz() {
    const questions = window.STUDY_QUESTIONS[activeDomain];
    const randomIndex = Math.floor(Math.random() * questions.length);
    currentQuestionObj = questions[randomIndex];
    
    quizQuestionText.innerText = currentQuestionObj.question;
    quizOptionsContainer.innerHTML = '';
    
    currentQuestionObj.options.forEach((option, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = option;
        btn.addEventListener('click', () => handleAnswerSelection(idx, btn));
        quizOptionsContainer.appendChild(btn);
    });
    
    quizOverlay.classList.add('active');
}

function handleAnswerSelection(selectedIdx, buttonElement) {
    if (selectedIdx === currentQuestionObj.answer) {
        // Correct answer selected!
        buttonElement.classList.add('correct');
        solvedQuizzesCount++;
        correctQuizzesEl.innerText = solvedQuizzesCount;
        
        // Play success beep
        playTone(523.25, 0.15, 'sine'); // C5
        setTimeout(() => playTone(659.25, 0.25, 'sine'), 150); // E5
        
        setTimeout(() => {
            quizOverlay.classList.remove('active');
            stopAlert();
            sleepTimer = 0;
            absenceTimer = 0;
            hasSentWhatsapp = false;
        }, 800);
    } else {
        // Wrong answer selected
        buttonElement.classList.add('wrong');
        playTone(180, 0.3, 'sawtooth'); // low buzz error tone
        
        // Allow selection of another option
        setTimeout(() => {
            buttonElement.classList.remove('wrong');
        }, 1200);
    }
}

// Utility to play simple notification sounds
function playTone(freq, duration, type = 'sine') {
    try {
        const ctxNode = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
        if (!audioCtx) audioCtx = ctxNode;
        
        const osc = ctxNode.createOscillator();
        const gain = ctxNode.createGain();
        
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.08, ctxNode.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctxNode.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(ctxNode.destination);
        
        osc.start();
        osc.stop(ctxNode.currentTime + duration);
    } catch(e) {
        console.warn("Could not play feedback tone:", e);
    }
}

// FaceMesh Landmark Connections
const FACE_OVAL = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];
const LEFT_EYE = [33, 160, 158, 133, 153, 144];
const RIGHT_EYE = [362, 385, 387, 263, 373, 380];
const LIPS = [78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308, 415, 310, 311, 312, 13, 82, 81, 80, 191];

function drawPath(landmarks, indices, closePath = true, glowColor = 'cyan') {
    ctx.beginPath();
    indices.forEach((idx, i) => {
        const x = landmarks[idx].x * canvas.width;
        const y = landmarks[idx].y * canvas.height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    if (closePath) ctx.closePath();
    
    ctx.strokeStyle = glowColor;
    ctx.lineWidth = 2;
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.shadowBlur = 0; // reset
}

// Main Frame loop and MediaPipe setup
async function init() {
    setupOverlay.style.opacity = '0';
    setTimeout(() => { setupOverlay.style.display = 'none'; }, 300);

    try {
        currentStream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: 640, height: 400, frameRate: { ideal: 30 } } 
        });
        video.srcObject = currentStream;
        
        // Wait for video to load metadata
        video.onloadedmetadata = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
        };

        // Initialize Web Audio context immediately on click event to bypass permissions
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // Initialize MediaPipe FaceMesh
        faceMesh = new FaceMesh({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
        });

        faceMesh.setOptions({
            maxNumFaces: 1, 
            refineLandmarks: true,
            minDetectionConfidence: 0.5
        });

        faceMesh.onResults((results) => {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            let personDetected = results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0;

            if (quizActive) {
                // Freeze facial analysis UI drawing in a red state while quiz is active
                if (personDetected) {
                    const landmarks = results.multiFaceLandmarks[0];
                    drawPath(landmarks, FACE_OVAL, true, 'var(--alert-rose)');
                }
                return; 
            }

            if (!personDetected) {
                absenceTimer++;
                // 90 frames equates to roughly 3-4 seconds of absence
                if (absenceTimer > 90) { 
                    triggerAlert("absence");
                }
                showStatus("No student detected in frame...", "alert");
            } else {
                absenceTimer = 0;
                const landmarks = results.multiFaceLandmarks[0]; 
                
                // Track Eye Opening
                // Left eye distance
                const leftEyeDist = landmarks[145].y - landmarks[159].y;
                // Right eye distance
                const rightEyeDist = landmarks[374].y - landmarks[386].y;
                
                const avgEyeDistance = (leftEyeDist + rightEyeDist) / 2;

                // Threshold condition: average eye opening distance
                if (avgEyeDistance < 0.010) { 
                    sleepTimer++;
                    // Draw face outlines in warning red-orange
                    drawPath(landmarks, FACE_OVAL, true, '#ff9f43');
                    drawPath(landmarks, LEFT_EYE, true, 'var(--alert-rose)');
                    drawPath(landmarks, RIGHT_EYE, true, 'var(--alert-rose)');
                    
                    // 60 frames equates to roughly 2-3 seconds of sleeping
                    if (sleepTimer > 60) { 
                        triggerAlert("sleep");
                    } else {
                        showStatus(`Closing eyes detected (${Math.round(sleepTimer/20)}s)...`, "alert");
                    }
                } else {
                    // Student is awake
                    sleepTimer = 0;
                    hasSentWhatsapp = false;
                    
                    // Draw beautiful neon cyberpunk HUD mesh paths
                    drawPath(landmarks, FACE_OVAL, true, 'var(--primary-cyan)');
                    drawPath(landmarks, LEFT_EYE, true, 'var(--accent-emerald)');
                    drawPath(landmarks, RIGHT_EYE, true, 'var(--accent-emerald)');
                    drawPath(landmarks, LIPS, true, 'var(--primary-cyan)');
                    
                    showStatus("Student is studying properly", "normal");
                }
            }
        });

        trackingStarted = true;
        startStudyTimer();
        showStatus("Proctor guard active", "normal");

        // Start processing loop
        const runAI = async () => {
            if (trackingStarted && video.readyState >= 2) {
                await faceMesh.send({ image: video });
            }
            requestAnimationFrame(runAI);
        };
        runAI();

    } catch (err) {
        console.error("Initialization failed: ", err);
        showStatus("Error: Camera access denied or library load failed.", "alert");
        setupOverlay.style.display = 'flex';
        setupOverlay.style.opacity = '1';
    }
}
