// Global variables
let currentStep = 1;
let circuitType = 'preemphasis';
let language = 'english';
let resistance = 1000;
let capacitance = 1;
let frequency = 1000;
let amplitude = 1;
let isSimulationRunning = false;
let animationId = null;
let time = 0;

// Voice guidance texts
const voiceTexts = {
    english: {
        preemphasis: {
            1: "Welcome to Pre-emphasis circuit simulator. This circuit boosts high frequencies. Set your component values and start the simulation.",
            2: "Now analyze the signal processing. Click 'Show Waveform Analysis' to see how the input signal gets processed.",
            3: "Examine the frequency response. Click 'Show Frequency Response' to see the Bode plot characteristics.",
            4: "Compare input and output signals. Click 'Show Signal Comparison' to see the complete analysis."
        },
        deemphasis: {
            1: "Welcome to De-emphasis circuit simulator. This circuit attenuates high frequencies. Set your component values and start the simulation.",
            2: "Now analyze the signal processing. Click 'Show Waveform Analysis' to see how the input signal gets processed.",
            3: "Examine the frequency response. Click 'Show Frequency Response' to see the Bode plot characteristics.",
            4: "Compare input and output signals. Click 'Show Signal Comparison' to see the complete analysis."
        }
    },
    hindi: {
        preemphasis: {
            1: "प्री-एम्फेसिस सर्किट सिमुलेटर में आपका स्वागत है। यह सर्किट उच्च आवृत्तियों को बढ़ाता है। अपनी कॉम्पोनेंट वैल्यू सेट करें और सिमुलेशन शुरू करें।",
            2: "अब सिग्नल प्रोसेसिंग का विश्लेषण करें। 'वेवफॉर्म एनालिसिस दिखाएं' पर क्लिक करें।",
            3: "फ्रीक्वेंसी रिस्पांस देखें। 'फ्रीक्वेंसी रिस्पांस दिखाएं' पर क्लिक करें।",
            4: "इनपुट और आउटपुट सिग्नल की तुलना करें। 'सिग्नल तुलना दिखाएं' पर क्लिक करें।"
        },
        deemphasis: {
            1: "डी-एम्फेसिस सर्किट सिमुलेटर में आपका स्वागत है। यह सर्किट उच्च आवृत्तियों को कम करता है। अपनी कॉम्पोनेंट वैल्यू सेट करें और सिमुलेशन शुरू करें।",
            2: "अब सिग्नल प्रोसेसिंग का विश्लेषण करें। 'वेवफॉर्म एनालिसिस दिखाएं' पर क्लिक करें।",
            3: "फ्रीक्वेंसी रिस्पांस देखें। 'फ्रीक्वेंसी रिस्पांस दिखाएं' पर क्लिक करें।",
            4: "इनपुट और आउटपुट सिग्नल की तुलना करें। 'सिग्नल तुलना दिखाएं' पर क्लिक करें।"
        }
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing simulator...');
    initializeControls();
    updateCircuit();
    updateValues();
    updateVoiceGuide();
    drawCircuit();
    console.log('Simulator initialized successfully');
});

// Initialize event listeners
function initializeControls() {
    console.log('Setting up event listeners...');
    
    // Step navigation
    document.querySelectorAll('.step-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const step = parseInt(e.target.getAttribute('data-step'));
            changeStep(step);
        });
    });

    // Circuit toggle
    document.getElementById('toggleCircuit').addEventListener('click', toggleCircuit);
    
    // Language toggle
    document.getElementById('toggleLanguage').addEventListener('click', toggleLanguage);
    
    // Simulation controls
    document.getElementById('startSimulation').addEventListener('click', startSimulation);
    document.getElementById('stopSimulation').addEventListener('click', stopSimulation);

    // Range inputs
    document.getElementById('resistance').addEventListener('input', updateResistance);
    document.getElementById('capacitance').addEventListener('input', updateCapacitance);
    document.getElementById('frequency').addEventListener('input', updateFrequency);
    document.getElementById('amplitude').addEventListener('input', updateAmplitude);

    // Graph buttons
    document.getElementById('showWaveform').addEventListener('click', showWaveform);
    document.getElementById('showBode').addEventListener('click', showBode);
    document.getElementById('showComparison').addEventListener('click', showComparison);

    // Voice guide
    document.getElementById('playVoice').addEventListener('click', playVoiceGuide);
    
    console.log('Event listeners set up successfully');
}

// Simulation Control Functions
function startSimulation() {
    console.log('Starting simulation...');
    isSimulationRunning = true;
    time = 0;
    
    // Update UI
    document.getElementById('startSimulation').disabled = true;
    document.getElementById('stopSimulation').disabled = false;
    document.getElementById('statusText').textContent = 'Simulation Running';
    document.getElementById('statusIndicator').classList.add('running');
    
    // Update circuits and graphs if visible
    drawCircuit();
    if (document.getElementById('waveformContainer').style.display !== 'none') {
        startWaveformAnimation();
    }
    if (document.getElementById('bodeContainer').style.display !== 'none') {
        drawBodePlot();
    }
    if (document.getElementById('comparisonContainer').style.display !== 'none') {
        startComparisonAnimation();
    }
    
    console.log('Simulation started successfully');
}

function stopSimulation() {
    console.log('Stopping simulation...');
    isSimulationRunning = false;
    
    // Update UI
    document.getElementById('startSimulation').disabled = false;
    document.getElementById('stopSimulation').disabled = true;
    document.getElementById('statusText').textContent = 'Simulation Stopped';
    document.getElementById('statusIndicator').classList.remove('running');
    
    // Stop any animation
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    
    console.log('Simulation stopped successfully');
}

// Quick set functions for preset values
function setResistance(value) {
    resistance = value;
    document.getElementById('resistance').value = value;
    updateResistanceDisplay();
}

function setCapacitance(value) {
    capacitance = value;
    document.getElementById('capacitance').value = value;
    updateCapacitanceDisplay();
}

function setFrequency(value) {
    frequency = value;
    document.getElementById('frequency').value = value;
    updateFrequencyDisplay();
}

function setAmplitude(value) {
    amplitude = value;
    document.getElementById('amplitude').value = value;
    updateAmplitudeDisplay();
}

// Step management
function changeStep(step) {
    currentStep = step;
    
    // Update step buttons
    document.querySelectorAll('.step-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-step="${step}"]`).classList.add('active');

    // Update step content
    document.querySelectorAll('.step-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`step${step}`).classList.add('active');

    // Update step info
    const steps = [
        { title: 'Circuit Selection', description: 'Choose and understand Pre-emphasis or De-emphasis circuits' },
        { title: 'Signal Analysis', description: 'Apply input signal and observe circuit behavior' },
        { title: 'Frequency Response', description: 'Analyze Bode plot characteristics' },
        { title: 'Waveform Comparison', description: 'Compare input vs output signals' }
    ];
    
    document.getElementById('stepTitle').textContent = steps[step - 1].title;
    document.getElementById('stepDescription').textContent = steps[step - 1].description;

    updateVoiceGuide();
    
    // Hide all graphs when changing steps
    hideAllGraphs();
}

// Circuit management
function toggleCircuit() {
    circuitType = circuitType === 'preemphasis' ? 'deemphasis' : 'preemphasis';
    updateCircuit();
    updateVoiceGuide();
    drawCircuit();
    
    // Hide any open graphs
    hideAllGraphs();
}

function updateCircuit() {
    const toggleBtn = document.getElementById('toggleCircuit');
    const circuitTitle = document.getElementById('circuitTitle');
    const circuitTypeTitle = document.getElementById('circuitTypeTitle');
    const outputSignalLabel = document.getElementById('outputSignalLabel');
    const comparisonOutputLabel = document.getElementById('comparisonOutputLabel');
    
    if (circuitType === 'preemphasis') {
        toggleBtn.textContent = '🔄 Switch to De-emphasis';
        circuitTitle.textContent = 'Pre-emphasis Circuit';
        circuitTypeTitle.textContent = 'Pre-emphasis Circuit';
        outputSignalLabel.textContent = 'Pre-emphasized Output';
        comparisonOutputLabel.textContent = 'Pre-emphasized Output';
        
        document.getElementById('circuitDescription').textContent = 
            'Pre-emphasis boosts high frequencies to improve signal-to-noise ratio in transmission systems.';
        document.getElementById('filterType').textContent = 'High-Pass';
        document.getElementById('application').textContent = 'FM radio transmitters, audio recording systems';
    } else {
        toggleBtn.textContent = '🔄 Switch to Pre-emphasis';
        circuitTitle.textContent = 'De-emphasis Circuit';
        circuitTypeTitle.textContent = 'De-emphasis Circuit';
        outputSignalLabel.textContent = 'De-emphasized Output';
        comparisonOutputLabel.textContent = 'De-emphasized Output';
        
        document.getElementById('circuitDescription').textContent = 
            'De-emphasis attenuates high frequencies to restore the original signal after pre-emphasis.';
        document.getElementById('filterType').textContent = 'Low-Pass';
        document.getElementById('application').textContent = 'FM radio receivers, audio playback systems';
    }
}

// Language management
function toggleLanguage() {
    language = language === 'english' ? 'hindi' : 'english';
    const toggleBtn = document.getElementById('toggleLanguage');
    toggleBtn.textContent = language === 'english' ? '🗣️ हिंदी में सुनें' : '🗣️ Listen in English';
    updateVoiceGuide();
}

// Value update functions
function updateResistance(e) {
    resistance = parseInt(e.target.value);
    updateResistanceDisplay();
}

function updateResistanceDisplay() {
    document.getElementById('resistanceValue').textContent = resistance;
    updateCalculatedValues();
    if (isSimulationRunning) {
        drawCircuit();
    }
}

function updateCapacitance(e) {
    capacitance = parseFloat(e.target.value);
    updateCapacitanceDisplay();
}

function updateCapacitanceDisplay() {
    document.getElementById('capacitanceValue').textContent = capacitance;
    updateCalculatedValues();
    if (isSimulationRunning) {
        drawCircuit();
    }
}

function updateFrequency(e) {
    frequency = parseInt(e.target.value);
    updateFrequencyDisplay();
}

function updateFrequencyDisplay() {
    document.getElementById('frequencyValue').textContent = frequency;
}

function updateAmplitude(e) {
    amplitude = parseFloat(e.target.value);
    updateAmplitudeDisplay();
}

function updateAmplitudeDisplay() {
    document.getElementById('amplitudeValue').textContent = amplitude;
}

function updateValues() {
    document.getElementById('resistanceValue').textContent = resistance;
    document.getElementById('capacitanceValue').textContent = capacitance;
    document.getElementById('frequencyValue').textContent = frequency;
    document.getElementById('amplitudeValue').textContent = amplitude;
    updateCalculatedValues();
}

function updateCalculatedValues() {
    const timeConstant = (resistance * capacitance).toFixed(2);
    const cornerFreq = Math.round(1000000 / (2 * Math.PI * resistance * capacitance));
    
    document.getElementById('timeConstant').textContent = timeConstant;
    document.getElementById('cornerFreq').textContent = cornerFreq;
    document.getElementById('bodeCornerFreq').textContent = cornerFreq;
    document.getElementById('comparisonCornerFreq').textContent = cornerFreq;
    
    // Update response slope and application
    const slope = circuitType === 'preemphasis' ? '+6' : '-6';
    const app = circuitType === 'preemphasis' ? 'FM Transmitter' : 'FM Receiver';
    
    document.getElementById('responseSlope').textContent = slope;
    document.getElementById('bodeApplication').textContent = app;
    
    // Update analysis texts
    if (circuitType === 'preemphasis') {
        document.getElementById('frequencyAnalysis').textContent = 
            'Higher frequencies are amplified with a +6dB/octave slope above the corner frequency.';
        document.getElementById('qualityAnalysis').textContent = 
            'Improves SNR by emphasizing high frequencies before transmission.';
    } else {
        document.getElementById('frequencyAnalysis').textContent = 
            'Higher frequencies are attenuated with a -6dB/octave slope above the corner frequency.';
        document.getElementById('qualityAnalysis').textContent = 
            'Restores original signal by de-emphasizing previously boosted frequencies.';
    }
}

// Circuit drawing functions
function drawCircuit() {
    console.log('Drawing circuit...');
    const svg = document.getElementById('circuitSvg');
    if (!svg) {
        console.error('Circuit SVG element not found');
        return;
    }
    
    svg.innerHTML = '';
    
    const svgNS = "http://www.w3.org/2000/svg";
    
    // Add background
    const bgRect = document.createElementNS(svgNS, 'rect');
    bgRect.setAttribute('width', '600');
    bgRect.setAttribute('height', '350');
    bgRect.setAttribute('fill', 'rgba(0,0,0,0.8)');
    svg.appendChild(bgRect);
    
    if (circuitType === 'preemphasis') {
        drawPreemphasisCircuit(svg, svgNS);
    } else {
        drawDeemphasisCircuit(svg, svgNS);
    }
    
    console.log('Circuit drawn successfully');
}

function drawPreemphasisCircuit(svg, svgNS) {
    // Title
    const title = createText(svgNS, 300, 30, 'Pre-emphasis Circuit (High-Pass Filter)', '#00ffff', '18px');
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-weight', 'bold');
    svg.appendChild(title);
    
    // Input terminal
    const inputTerminal = createCircle(svgNS, 80, 175, 6, '#ff0000');
    inputTerminal.setAttribute('stroke', '#ffffff');
    inputTerminal.setAttribute('stroke-width', '2');
    svg.appendChild(inputTerminal);
    
    const inputLabel = createText(svgNS, 50, 170, 'Vin', '#ff0000', '16px');
    inputLabel.setAttribute('font-weight', 'bold');
    svg.appendChild(inputLabel);
    
    // Input line to resistor
    const inputLine = createLine(svgNS, 86, 175, 150, 175, '#00ffff', 4);
    svg.appendChild(inputLine);
    
    // Resistor
    const resistorBody = createRectangle(svgNS, 150, 165, 100, 20, 'rgba(255,255,0,0.2)', '#ffff00', 3);
    resistorBody.setAttribute('rx', '5');
    svg.appendChild(resistorBody);
    
    const rText = createText(svgNS, 200, 155, 'R', '#ffff00', '16px');
    rText.setAttribute('text-anchor', 'middle');
    rText.setAttribute('font-weight', 'bold');
    svg.appendChild(rText);
    
    const rValue = createText(svgNS, 200, 205, resistance + 'Ω', '#ffff00', '14px');
    rValue.setAttribute('text-anchor', 'middle');
    rValue.setAttribute('font-weight', 'bold');
    svg.appendChild(rValue);
    
    // Resistor to output
    const resistorToOutput = createLine(svgNS, 250, 175, 320, 175, '#00ffff', 4);
    svg.appendChild(resistorToOutput);
    
    // Capacitor
    const cap1 = createLine(svgNS, 320, 150, 320, 200, '#ff00ff', 6);
    const cap2 = createLine(svgNS, 340, 150, 340, 200, '#ff00ff', 6);
    svg.appendChild(cap1);
    svg.appendChild(cap2);
    
    const capConn1 = createLine(svgNS, 310, 175, 320, 175, '#00ffff', 4);
    const capConn2 = createLine(svgNS, 340, 175, 350, 175, '#00ffff', 4);
    svg.appendChild(capConn1);
    svg.appendChild(capConn2);
    
    const cText = createText(svgNS, 330, 135, 'C', '#ff00ff', '16px');
    cText.setAttribute('text-anchor', 'middle');
    cText.setAttribute('font-weight', 'bold');
    svg.appendChild(cText);
    
    const cValue = createText(svgNS, 330, 230, capacitance + 'µF', '#ff00ff', '14px');
    cValue.setAttribute('text-anchor', 'middle');
    cValue.setAttribute('font-weight', 'bold');
    svg.appendChild(cValue);
    
    // Output terminal
    const outputTerminal = createCircle(svgNS, 450, 175, 6, '#00ff00');
    outputTerminal.setAttribute('stroke', '#ffffff');
    outputTerminal.setAttribute('stroke-width', '2');
    svg.appendChild(outputTerminal);
    
    const outputLabel = createText(svgNS, 470, 170, 'Vo', '#00ff00', '16px');
    outputLabel.setAttribute('font-weight', 'bold');
    svg.appendChild(outputLabel);
    
    // Output connection from resistor
    const outputConn1 = createLine(svgNS, 320, 175, 320, 120, '#00ff00', 4);
    const outputConn2 = createLine(svgNS, 320, 120, 450, 120, '#00ff00', 4);
    const outputConn3 = createLine(svgNS, 450, 120, 450, 175, '#00ff00', 4);
    svg.appendChild(outputConn1);
    svg.appendChild(outputConn2);
    svg.appendChild(outputConn3);
    
    // Ground connections
    const gndConn1 = createLine(svgNS, 350, 175, 400, 175, '#00ffff', 4);
    const gndConn2 = createLine(svgNS, 400, 175, 400, 250, '#00ffff', 4);
    const gndConn3 = createLine(svgNS, 80, 175, 80, 250, '#00ffff', 4);
    const gndConn4 = createLine(svgNS, 450, 175, 450, 250, '#00ffff', 4);
    svg.appendChild(gndConn1);
    svg.appendChild(gndConn2);
    svg.appendChild(gndConn3);
    svg.appendChild(gndConn4);
    
    // Ground symbols
    drawGroundSymbol(svg, svgNS, 80, 250);
    drawGroundSymbol(svg, svgNS, 400, 250);
    drawGroundSymbol(svg, svgNS, 450, 250);
}

function drawDeemphasisCircuit(svg, svgNS) {
    // Title
    const title = createText(svgNS, 300, 30, 'De-emphasis Circuit (Low-Pass Filter)', '#00ffff', '18px');
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-weight', 'bold');
    svg.appendChild(title);
    
    // Input terminal
    const inputTerminal = createCircle(svgNS, 80, 175, 6, '#ff0000');
    inputTerminal.setAttribute('stroke', '#ffffff');
    inputTerminal.setAttribute('stroke-width', '2');
    svg.appendChild(inputTerminal);
    
    const inputLabel = createText(svgNS, 50, 170, 'Vin', '#ff0000', '16px');
    inputLabel.setAttribute('font-weight', 'bold');
    svg.appendChild(inputLabel);
    
    // Input line to junction
    const inputLine = createLine(svgNS, 86, 175, 180, 175, '#00ffff', 4);
    svg.appendChild(inputLine);
    
    // Junction point
    const junction = createCircle(svgNS, 180, 175, 4, '#00ffff');
    svg.appendChild(junction);
    
    // Resistor branch (upper path)
    const resistorBranch1 = createLine(svgNS, 180, 175, 180, 120, '#00ffff', 4);
    const resistorBranch2 = createLine(svgNS, 180, 120, 380, 120, '#00ffff', 4);
    svg.appendChild(resistorBranch1);
    svg.appendChild(resistorBranch2);
    
    // Resistor
    const resistorBody = createRectangle(svgNS, 250, 110, 100, 20, 'rgba(255,255,0,0.2)', '#ffff00', 3);
    resistorBody.setAttribute('rx', '5');
    svg.appendChild(resistorBody);
    
    const rText = createText(svgNS, 300, 100, 'R', '#ffff00', '16px');
    rText.setAttribute('text-anchor', 'middle');
    rText.setAttribute('font-weight', 'bold');
    svg.appendChild(rText);
    
    const rValue = createText(svgNS, 300, 85, resistance + 'Ω', '#ffff00', '14px');
    rValue.setAttribute('text-anchor', 'middle');
    rValue.setAttribute('font-weight', 'bold');
    svg.appendChild(rValue);
    
    // Capacitor branch (lower path)
    const capBranch1 = createLine(svgNS, 180, 175, 180, 230, '#00ffff', 4);
    const capBranch2 = createLine(svgNS, 180, 230, 380, 230, '#00ffff', 4);
    svg.appendChild(capBranch1);
    svg.appendChild(capBranch2);
    
    // Capacitor
    const cap1 = createLine(svgNS, 270, 210, 270, 250, '#ff00ff', 6);
    const cap2 = createLine(svgNS, 290, 210, 290, 250, '#ff00ff', 6);
    svg.appendChild(cap1);
    svg.appendChild(cap2);
    
    const capConn1 = createLine(svgNS, 260, 230, 270, 230, '#00ffff', 4);
    const capConn2 = createLine(svgNS, 290, 230, 300, 230, '#00ffff', 4);
    svg.appendChild(capConn1);
    svg.appendChild(capConn2);
    
    const cText = createText(svgNS, 280, 275, 'C', '#ff00ff', '16px');
    cText.setAttribute('text-anchor', 'middle');
    cText.setAttribute('font-weight', 'bold');
    svg.appendChild(cText);
    
    const cValue = createText(svgNS, 280, 290, capacitance + 'µF', '#ff00ff', '14px');
    cValue.setAttribute('text-anchor', 'middle');
    cValue.setAttribute('font-weight', 'bold');
    svg.appendChild(cValue);
    
    // Output junction and connection
    const outputJunction1 = createCircle(svgNS, 380, 120, 4, '#00ff00');
    const outputJunction2 = createCircle(svgNS, 380, 230, 4, '#00ff00');
    svg.appendChild(outputJunction1);
    svg.appendChild(outputJunction2);
    
    const outputConn1 = createLine(svgNS, 380, 120, 380, 230, '#00ff00', 4);
    const outputConn2 = createLine(svgNS, 380, 175, 450, 175, '#00ff00', 4);
    svg.appendChild(outputConn1);
    svg.appendChild(outputConn2);
    
    // Output terminal
    const outputTerminal = createCircle(svgNS, 450, 175, 6, '#00ff00');
    outputTerminal.setAttribute('stroke', '#ffffff');
    outputTerminal.setAttribute('stroke-width', '2');
    svg.appendChild(outputTerminal);
    
    const outputLabel = createText(svgNS, 470, 170, 'Vo', '#00ff00', '16px');
    outputLabel.setAttribute('font-weight', 'bold');
    svg.appendChild(outputLabel);
    
    // Ground connections
    const gnd1 = createLine(svgNS, 80, 175, 80, 280, '#00ffff', 4);
    const gnd2 = createLine(svgNS, 450, 175, 450, 280, '#00ffff', 4);
    svg.appendChild(gnd1);
    svg.appendChild(gnd2);
    
    // Ground symbols
    drawGroundSymbol(svg, svgNS, 80, 280);
    drawGroundSymbol(svg, svgNS, 450, 280);
}

// Helper functions for SVG elements
function createLine(svgNS, x1, y1, x2, y2, color, width) {
    const line = document.createElementNS(svgNS, 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', color);
    line.setAttribute('stroke-width', width);
    return line;
}

function createCircle(svgNS, cx, cy, r, color) {
    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', r);
    circle.setAttribute('fill', color);
    return circle;
}

function createRectangle(svgNS, x, y, width, height, fill, stroke, strokeWidth) {
    const rect = document.createElementNS(svgNS, 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', width);
    rect.setAttribute('height', height);
    rect.setAttribute('fill', fill);
    rect.setAttribute('stroke', stroke);
    rect.setAttribute('stroke-width', strokeWidth);
    return rect;
}

function createText(svgNS, x, y, text, color, fontSize) {
    const textElement = document.createElementNS(svgNS, 'text');
    textElement.setAttribute('x', x);
    textElement.setAttribute('y', y);
    textElement.setAttribute('fill', color);
    textElement.setAttribute('font-size', fontSize);
    textElement.setAttribute('font-family', 'Arial, sans-serif');
    textElement.textContent = text;
    return textElement;
}

function drawGroundSymbol(svg, svgNS, x, y) {
    const gnd1 = createLine(svgNS, x - 15, y, x + 15, y, '#00ffff', 4);
    const gnd2 = createLine(svgNS, x - 10, y + 8, x + 10, y + 8, '#00ffff', 3);
    const gnd3 = createLine(svgNS, x - 5, y + 16, x + 5, y + 16, '#00ffff', 2);
    svg.appendChild(gnd1);
    svg.appendChild(gnd2);
    svg.appendChild(gnd3);
    
    const gndText = createText(svgNS, x, y + 35, 'GND', '#00ffff', '12px');
    gndText.setAttribute('text-anchor', 'middle');
    gndText.setAttribute('font-weight', 'bold');
    svg.appendChild(gndText);
}

// Graph functions
function hideAllGraphs() {
    document.getElementById('waveformContainer').style.display = 'none';
    document.getElementById('bodeContainer').style.display = 'none';
    document.getElementById('comparisonContainer').style.display = 'none';
    
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
}

function showWaveform() {
    if (!isSimulationRunning) {
        alert('Please start the simulation first!');
        return;
    }
    
    hideAllGraphs();
    document.getElementById('waveformContainer').style.display = 'block';
    document.getElementById('waveformContainer').classList.add('fade-in');
    startWaveformAnimation();
}

function showBode() {
    if (!isSimulationRunning) {
        alert('Please start the simulation first!');
        return;
    }
    
    hideAllGraphs();
    document.getElementById('bodeContainer').style.display = 'block';
    document.getElementById('bodeContainer').classList.add('fade-in');
    drawBodePlot();
}

function showComparison() {
    if (!isSimulationRunning) {
        alert('Please start the simulation first!');
        return;
    }
    
    hideAllGraphs();
    document.getElementById('comparisonContainer').style.display = 'block';
    document.getElementById('comparisonContainer').classList.add('fade-in');
    startComparisonAnimation();
}

// Animation functions
function startWaveformAnimation() {
    const canvas = document.getElementById('waveformCanvas');
    if (!canvas) return;
    
    function animate() {
        if (!isSimulationRunning || document.getElementById('waveformContainer').style.display === 'none') {
            return;
        }
        
        drawWaveform();
        time += 0.1;
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
}

function startComparisonAnimation() {
    const canvas = document.getElementById('comparisonCanvas');
    if (!canvas) return;
    
    function animate() {
        if (!isSimulationRunning || document.getElementById('comparisonContainer').style.display === 'none') {
            return;
        }
        
        drawComparison();
        time += 0.1;
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
}

function drawWaveform() {
    const canvas = document.getElementById('waveformCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
    gradient.addColorStop(1, 'rgba(0, 50, 50, 0.9)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    const centerY = height / 2;
    const baseAmplitude = 80;
    const scaledAmplitude = baseAmplitude * amplitude;
    const timeConstant = resistance * capacitance / 1000000;
    
    // Calculate transfer function
    const omega = 2 * Math.PI * frequency;
    let gainMagnitude, phaseShift;
    
    if (circuitType === 'preemphasis') {
        const realPart = 1;
        const imagPart = omega * timeConstant;
        gainMagnitude = Math.sqrt(realPart * realPart + imagPart * imagPart);
        phaseShift = Math.atan2(imagPart, realPart);
    } else {
        const realPart = 1;
        const imagPart = omega * timeConstant;
        const denomMagnitude = Math.sqrt(realPart * realPart + imagPart * imagPart);
        gainMagnitude = 1 / denomMagnitude;
        phaseShift = -Math.atan2(imagPart, realPart);
    }
    
    // Draw grid
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
    }
    for (let i = 0; i < height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
    }
    
    // Center line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    
    // Draw input waveform
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = 0; x < width; x++) {
        const t = (x / width) * 8 * Math.PI + time;
        const y = centerY - scaledAmplitude * Math.sin(t);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Draw output waveform
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = 0; x < width; x++) {
        const t = (x / width) * 8 * Math.PI + time;
        const y = centerY - scaledAmplitude * gainMagnitude * Math.sin(t + phaseShift);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Info panel
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(15, 15, 400, 120);
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(15, 15, 400, 120);
    
    // Labels
    ctx.fillStyle = '#00ffff';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Input Signal (Vin)', 25, 40);
    
    ctx.fillStyle = '#00ff00';
    ctx.fillText('Output Signal (Vout)', 25, 65);
    
    ctx.fillStyle = '#ffff00';
    ctx.fillText(`Gain: ${(20 * Math.log10(gainMagnitude)).toFixed(1)} dB`, 25, 90);
    
    ctx.fillStyle = '#ff00ff';
    ctx.fillText(`Phase: ${(phaseShift * 180 / Math.PI).toFixed(1)}°`, 25, 115);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';
    ctx.fillText(`f = ${frequency}Hz, A = ${amplitude}V`, 220, 40);
    ctx.fillText(`R = ${resistance}Ω, C = ${capacitance}µF`, 220, 65);
    ctx.fillText(`τ = ${(timeConstant * 1000000).toFixed(1)}µs`, 220, 90);
    ctx.fillText(`fc = ${Math.round(1/(2*Math.PI*timeConstant))}Hz`, 220, 115);
}

function drawComparison() {
    const canvas = document.getElementById('comparisonCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
    gradient.addColorStop(1, 'rgba(50, 0, 50, 0.9)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    const centerY = height / 2;
    const baseAmplitude = 70;
    const scaledAmplitude = baseAmplitude * amplitude;
    const timeConstant = resistance * capacitance / 1000000;
    
    // Calculate transfer function
    const omega = 2 * Math.PI * frequency;
    let gainMagnitude, phaseShift;
    
    if (circuitType === 'preemphasis') {
        const realPart = 1;
        const imagPart = omega * timeConstant;
        gainMagnitude = Math.sqrt(realPart * realPart + imagPart * imagPart);
        phaseShift = Math.atan2(imagPart, realPart);
    } else {
        const realPart = 1;
        const imagPart = omega * timeConstant;
        const denomMagnitude = Math.sqrt(realPart * realPart + imagPart * imagPart);
        gainMagnitude = 1 / denomMagnitude;
        phaseShift = -Math.atan2(imagPart, realPart);
    }
    
    // Draw grid
    ctx.strokeStyle = 'rgba(255, 0, 255, 0.15)';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 60) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
    }
    for (let i = 0; i < height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
    }
    
    // Center line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    
    // Draw input signal
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    for (let x = 0; x < width; x++) {
        const t = (x / width) * 6 * Math.PI + time;
        const y = centerY - scaledAmplitude * Math.sin(t);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Draw output signal
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 4;
    ctx.beginPath();
    for (let x = 0; x < width; x++) {
        const t = (x / width) * 6 * Math.PI + time;
        const y = centerY - scaledAmplitude * gainMagnitude * Math.sin(t + phaseShift);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Comparison info panel
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(15, 15, 500, 140);
    ctx.strokeStyle = 'rgba(255, 0, 255, 0.6)';
    ctx.lineWidth = 2;
    ctx.strokeRect(15, 15, 500, 140);
    
    // Title
    ctx.fillStyle = '#ff00ff';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('Waveform Comparison Analysis', 25, 40);
    
    // Comparison data
    ctx.fillStyle = '#00ffff';
    ctx.font = '14px Arial';
    ctx.fillText('📊 Input Signal:', 25, 65);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Amplitude: ${amplitude}V, Frequency: ${frequency}Hz`, 140, 65);
    
    ctx.fillStyle = '#00ff00';
    ctx.font = '14px Arial';
    ctx.fillText('📈 Output Signal:', 25, 85);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Amplitude: ${(amplitude * gainMagnitude).toFixed(2)}V, Phase Shift: ${(phaseShift * 180 / Math.PI).toFixed(1)}°`, 140, 85);
    
    ctx.fillStyle = '#ffff00';
    ctx.font = '14px Arial';
    ctx.fillText('⚙️ Circuit Parameters:', 25, 105);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`τ = ${(timeConstant * 1000000).toFixed(1)}µs, fc = ${Math.round(1/(2*Math.PI*timeConstant))}Hz`, 170, 105);
    
    ctx.fillStyle = '#ff8800';
    ctx.font = '14px Arial';
    ctx.fillText('📈 Transfer Function:', 25, 125);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`|H(jω)| = ${gainMagnitude.toFixed(3)}, ∠H(jω) = ${(phaseShift * 180 / Math.PI).toFixed(1)}°`, 170, 125);
}

function drawBodePlot() {
    const canvas = document.getElementById('bodeCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
    gradient.addColorStop(1, 'rgba(0, 30, 60, 0.9)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    const timeConstant = resistance * capacitance / 1000000;
    const cornerFreq = 1 / (2 * Math.PI * timeConstant);
    const margin = 80;
    const plotWidth = width - 2 * margin;
    const plotHeight = height - 2 * margin;
    
    // Draw grid
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
        const x = margin + (i / 10) * plotWidth;
        ctx.beginPath();
        ctx.moveTo(x, margin);
        ctx.lineTo(x, margin + plotHeight);
        ctx.stroke();
        
        const y = margin + (i / 10) * plotHeight;
        ctx.beginPath();
        ctx.moveTo(margin, y);
        ctx.lineTo(margin + plotWidth, y);
        ctx.stroke();
    }
    
    // Draw axes
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(margin, margin + plotHeight);
    ctx.lineTo(margin + plotWidth, margin + plotHeight);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, margin + plotHeight);
    ctx.stroke();
    
    // Draw frequency response curve
    ctx.strokeStyle = circuitType === 'preemphasis' ? '#00ff00' : '#ff00ff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    
    const minFreq = 1;
    const maxFreq = 100000;
    
    for (let i = 0; i <= plotWidth; i++) {
        const freqRatio = i / plotWidth;
        const freq = minFreq * Math.pow(maxFreq / minFreq, freqRatio);
        const normalizedFreq = freq / cornerFreq;
        
        let magnitude;
        if (circuitType === 'preemphasis') {
            magnitude = Math.sqrt(1 + (normalizedFreq * normalizedFreq));
        } else {
            magnitude = 1 / Math.sqrt(1 + (normalizedFreq * normalizedFreq));
        }
        
        const magnitudeDb = 20 * Math.log10(magnitude);
        const normalizedMagnitude = Math.max(0, Math.min(1, (magnitudeDb + 30) / 60));
        
        const x = margin + i;
        const y = margin + plotHeight - normalizedMagnitude * plotHeight;
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Corner frequency marker
    const cornerX = margin + (Math.log10(cornerFreq / minFreq) / Math.log10(maxFreq / minFreq)) * plotWidth;
    if (cornerX >= margin && cornerX <= margin + plotWidth) {
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        ctx.moveTo(cornerX, margin);
        ctx.lineTo(cornerX, margin + plotHeight);
        ctx.stroke();
        ctx.setLineDash([]);
        
        ctx.fillStyle = '#ff0000';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`fc = ${Math.round(cornerFreq)}Hz`, cornerX, margin - 10);
    }
    
    // Labels and title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${circuitType === 'preemphasis' ? 'Pre-emphasis' : 'De-emphasis'} Frequency Response`, width / 2, 30);
    
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Frequency (Hz)', width / 2, height - 15);
    
    ctx.save();
    ctx.translate(25, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Magnitude (dB)', 0, 0);
    ctx.restore();
    
    // Frequency scale labels
    ctx.font = '12px Arial';
    ctx.fillStyle = '#00ffff';
    const freqLabels = [1, 10, 100, 1000, 10000, 100000];
    freqLabels.forEach(freq => {
        const x = margin + (Math.log10(freq / minFreq) / Math.log10(maxFreq / minFreq)) * plotWidth;
        if (x >= margin && x <= margin + plotWidth) {
            ctx.textAlign = 'center';
            ctx.fillText(freq >= 1000 ? `${freq/1000}k` : freq.toString(), x, margin + plotHeight + 20);
        }
    });
    
    // Magnitude scale labels
    for (let i = -20; i <= 20; i += 10) {
        const normalizedMag = (i + 30) / 60;
        const y = margin + plotHeight - normalizedMag * plotHeight;
        if (y >= margin && y <= margin + plotHeight) {
            ctx.textAlign = 'right';
            ctx.fillText(`${i}dB`, margin - 10, y + 5);
        }
    }
}

// Voice guide
function updateVoiceGuide() {
    const voiceText = voiceTexts[language][circuitType][currentStep];
    document.getElementById('voiceText').textContent = voiceText;
}

function playVoiceGuide() {
    const text = document.getElementById('voiceText').textContent;
    
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language === 'hindi' ? 'hi-IN' : 'en-US';
        utterance.rate = 0.8;
        utterance.pitch = 1;
        
        speechSynthesis.speak(utterance);
        
        const btn = document.getElementById('playVoice');
        btn.textContent = '🔊 Playing...';
        btn.disabled = true;
        
        utterance.onend = () => {
            btn.textContent = '🔊 Play Voice Guide';
            btn.disabled = false;
        };
    } else {
        alert('Speech synthesis not supported in this browser.');
    }
}
