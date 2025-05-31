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
    
    // Update UI
    document.getElementById('startSimulation').disabled = true;
    document.getElementById('stopSimulation').disabled = false;
    document.getElementById('statusText').textContent = 'Simulation Running';
    document.getElementById('statusIndicator').classList.add('running');
    
    // Update circuits and graphs if visible
    drawCircuit();
    if (document.getElementById('waveformContainer').style.display !== 'none') {
        drawWaveform();
    }
    if (document.getElementById('bodeContainer').style.display !== 'none') {
        drawBodePlot();
    }
    if (document.getElementById('comparisonContainer').style.display !== 'none') {
        drawComparison();
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
    
    if (circuitType === 'preemphasis') {
        toggleBtn.textContent = '🔄 Switch to De-emphasis';
        circuitTitle.textContent = 'Pre-emphasis Circuit';
        circuitTypeTitle.textContent = 'Pre-emphasis Circuit';
        outputSignalLabel.textContent = 'Pre-emphasized Output';
        
        document.getElementById('circuitDescription').textContent = 
            'Pre-emphasis boosts high frequencies to improve signal-to-noise ratio in transmission systems.';
        document.getElementById('filterType').textContent = 'High-Pass';
        document.getElementById('application').textContent = 'FM radio transmitters, audio recording systems';
    } else {
        toggleBtn.textContent = '🔄 Switch to Pre-emphasis';
        circuitTitle.textContent = 'De-emphasis Circuit';
        circuitTypeTitle.textContent = 'De-emphasis Circuit';
        outputSignalLabel.textContent = 'De-emphasized Output';
        
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
    if (isSimulationRunning && document.getElementById('waveformContainer').style.display !== 'none') {
        drawWaveform();
    }
}

function updateAmplitude(e) {
    amplitude = parseFloat(e.target.value);
    updateAmplitudeDisplay();
}

function updateAmplitudeDisplay() {
    document.getElementById('amplitudeValue').textContent = amplitude;
    if (isSimulationRunning && document.getElementById('waveformContainer').style.display !== 'none') {
        drawWaveform();
    }
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

// Circuit drawing
function drawCircuit() {
    console.log('Drawing circuit...');
    const svg = document.getElementById('circuitSvg');
    if (!svg) {
        console.error('Circuit SVG element not found');
        return;
    }
    
    svg.innerHTML = ''; // Clear existing content
    
    // Create SVG elements
    const svgNS = "http://www.w3.org/2000/svg";
    
    // Add background
    const bgRect = document.createElementNS(svgNS, 'rect');
    bgRect.setAttribute('width', '500');
    bgRect.setAttribute('height', '300');
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
    // Input terminals
    const inputPosTerminal = createCircle(svgNS, 50, 120, 4, '#ff0000');
    const inputNegTerminal = createCircle(svgNS, 50, 180, 4, '#000000');
    svg.appendChild(inputPosTerminal);
    svg.appendChild(inputNegTerminal);
    
    // Input labels
    const vinPosText = createText(svgNS, 20, 115, 'Vin+', '#ff0000', '12px');
    const vinNegText = createText(svgNS, 20, 185, 'Vin-', '#000000', '12px');
    svg.appendChild(vinPosText);
    svg.appendChild(vinNegText);
    
    // Main connection line from positive input
    const inputLine = createLine(svgNS, 54, 120, 120, 120, '#00ffff', 3);
    svg.appendChild(inputLine);
    
    // Resistor
    const resistorBody = createRectangle(svgNS, 120, 110, 80, 20, 'none', '#ffff00', 3);
    svg.appendChild(resistorBody);
    
    // Resistor zigzag pattern
    const resistorPath = document.createElementNS(svgNS, 'path');
    resistorPath.setAttribute('d', 'M120 120 L130 110 L140 130 L150 110 L160 130 L170 110 L180 120 L190 130 L200 120');
    resistorPath.setAttribute('stroke', '#ffff00');
    resistorPath.setAttribute('stroke-width', '3');
    resistorPath.setAttribute('fill', 'none');
    svg.appendChild(resistorPath);
    
    // Resistor labels
    const rText = createText(svgNS, 155, 100, 'R', '#ffff00', '14px');
    const rValue = createText(svgNS, 155, 155, resistance + 'Ω', '#ffff00', '12px');
    svg.appendChild(rText);
    svg.appendChild(rValue);
    
    // Connection from resistor to capacitor
    const conn1 = createLine(svgNS, 200, 120, 250, 120, '#00ffff', 3);
    svg.appendChild(conn1);
    
    // Capacitor
    const cap1 = createLine(svgNS, 250, 100, 250, 140, '#ff00ff', 5);
    const cap2 = createLine(svgNS, 270, 100, 270, 140, '#ff00ff', 5);
    svg.appendChild(cap1);
    svg.appendChild(cap2);
    
    // Capacitor connection lines
    const capConn1 = createLine(svgNS, 240, 120, 250, 120, '#00ffff', 3);
    const capConn2 = createLine(svgNS, 270, 120, 280, 120, '#00ffff', 3);
    svg.appendChild(capConn1);
    svg.appendChild(capConn2);
    
    // Capacitor labels
    const cText = createText(svgNS, 260, 85, 'C', '#ff00ff', '14px');
    const cValue = createText(svgNS, 260, 175, capacitance + 'µF', '#ff00ff', '12px');
    svg.appendChild(cText);
    svg.appendChild(cValue);
    
    // Output connection (across resistor)
    const outputJunction = createCircle(svgNS, 120, 120, 3, '#00ff00');
    svg.appendChild(outputJunction);
    
    const outputConn1 = createLine(svgNS, 120, 120, 120, 80, '#00ff00', 3);
    const outputConn2 = createLine(svgNS, 120, 80, 380, 80, '#00ff00', 3);
    const outputConn3 = createLine(svgNS, 380, 80, 380, 120, '#00ff00', 3);
    svg.appendChild(outputConn1);
    svg.appendChild(outputConn2);
    svg.appendChild(outputConn3);
    
    // Output terminals
    const outputPosTerminal = createCircle(svgNS, 380, 120, 4, '#ff0000');
    const outputNegTerminal = createCircle(svgNS, 380, 180, 4, '#000000');
    svg.appendChild(outputPosTerminal);
    svg.appendChild(outputNegTerminal);
    
    // Output labels
    const voutPosText = createText(svgNS, 390, 115, 'Vo+', '#ff0000', '12px');
    const voutNegText = createText(svgNS, 390, 185, 'Vo-', '#000000', '12px');
    svg.appendChild(voutPosText);
    svg.appendChild(voutNegText);
    
    // Ground connections
    const gnd1 = createLine(svgNS, 280, 120, 320, 120, '#00ffff', 3);
    const gnd2 = createLine(svgNS, 320, 120, 320, 200, '#00ffff', 3);
    const gnd3 = createLine(svgNS, 50, 180, 50, 200, '#00ffff', 3);
    const gnd4 = createLine(svgNS, 380, 180, 380, 200, '#00ffff', 3);
    svg.appendChild(gnd1);
    svg.appendChild(gnd2);
    svg.appendChild(gnd3);
    svg.appendChild(gnd4);
    
    // Ground symbols
    drawGroundSymbol(svg, svgNS, 50, 200);
    drawGroundSymbol(svg, svgNS, 320, 200);
    drawGroundSymbol(svg, svgNS, 380, 200);
    
    // Circuit title
    const title = createText(svgNS, 250, 30, 'Pre-emphasis Filter (High-Pass)', '#00ffff', '16px');
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-weight', 'bold');
    svg.appendChild(title);
}

function drawDeemphasisCircuit(svg, svgNS) {
    // Input terminals
    const inputPosTerminal = createCircle(svgNS, 50, 120, 4, '#ff0000');
    const inputNegTerminal = createCircle(svgNS, 50, 180, 4, '#000000');
    svg.appendChild(inputPosTerminal);
    svg.appendChild(inputNegTerminal);
    
    // Input labels
    const vinPosText = createText(svgNS, 20, 115, 'Vin+', '#ff0000', '12px');
    const vinNegText = createText(svgNS, 20, 185, 'Vin-', '#000000', '12px');
    svg.appendChild(vinPosText);
    svg.appendChild(vinNegText);
    
    // Main input line to junction
    const inputLine = createLine(svgNS, 54, 120, 150, 120, '#00ffff', 3);
    svg.appendChild(inputLine);
    
    // Junction point
    const junction = createCircle(svgNS, 150, 120, 3, '#00ffff');
    svg.appendChild(junction);
    
    // Resistor branch (upper path)
    const resistorBranch1 = createLine(svgNS, 150, 120, 150, 80, '#00ffff', 3);
    const resistorBranch2 = createLine(svgNS, 150, 80, 300, 80, '#00ffff', 3);
    svg.appendChild(resistorBranch1);
    svg.appendChild(resistorBranch2);
    
    // Resistor
    const resistorBody = createRectangle(svgNS, 200, 70, 80, 20, 'none', '#ffff00', 3);
    svg.appendChild(resistorBody);
    
    // Resistor zigzag
    const resistorPath = document.createElementNS(svgNS, 'path');
    resistorPath.setAttribute('d', 'M200 80 L210 70 L220 90 L230 70 L240 90 L250 70 L260 80 L270 90 L280 80');
    resistorPath.setAttribute('stroke', '#ffff00');
    resistorPath.setAttribute('stroke-width', '3');
    resistorPath.setAttribute('fill', 'none');
    svg.appendChild(resistorPath);
    
    // Resistor labels
    const rText = createText(svgNS, 240, 60, 'R', '#ffff00', '14px');
    const rValue = createText(svgNS, 240, 50, resistance + 'Ω', '#ffff00', '12px');
    svg.appendChild(rText);
    svg.appendChild(rValue);
    
    // Capacitor branch (lower path)
    const capBranch1 = createLine(svgNS, 150, 120, 150, 160, '#00ffff', 3);
    const capBranch2 = createLine(svgNS, 150, 160, 300, 160, '#00ffff', 3);
    svg.appendChild(capBranch1);
    svg.appendChild(capBranch2);
    
    // Capacitor
    const cap1 = createLine(svgNS, 210, 140, 210, 180, '#ff00ff', 5);
    const cap2 = createLine(svgNS, 230, 140, 230, 180, '#ff00ff', 5);
    svg.appendChild(cap1);
    svg.appendChild(cap2);
    
    // Capacitor connection lines
    const capConn1 = createLine(svgNS, 200, 160, 210, 160, '#00ffff', 3);
    const capConn2 = createLine(svgNS, 230, 160, 240, 160, '#00ffff', 3);
    svg.appendChild(capConn1);
    svg.appendChild(capConn2);
    
    // Capacitor labels
    const cText = createText(svgNS, 220, 205, 'C', '#ff00ff', '14px');
    const cValue = createText(svgNS, 220, 220, capacitance + 'µF', '#ff00ff', '12px');
    svg.appendChild(cText);
    svg.appendChild(cValue);
    
    // Output junction and connection
    const outputJunction1 = createCircle(svgNS, 300, 80, 3, '#00ff00');
    const outputJunction2 = createCircle(svgNS, 300, 160, 3, '#00ff00');
    svg.appendChild(outputJunction1);
    svg.appendChild(outputJunction2);
    
    const outputConn1 = createLine(svgNS, 300, 80, 300, 160, '#00ff00', 3);
    const outputConn2 = createLine(svgNS, 300, 120, 380, 120, '#00ff00', 3);
    svg.appendChild(outputConn1);
    svg.appendChild(outputConn2);
    
    // Output terminals
    const outputPosTerminal = createCircle(svgNS, 380, 120, 4, '#ff0000');
    const outputNegTerminal = createCircle(svgNS, 380, 180, 4, '#000000');
    svg.appendChild(outputPosTerminal);
    svg.appendChild(outputNegTerminal);
    
    // Output labels
    const voutPosText = createText(svgNS, 390, 115, 'Vo+', '#ff0000', '12px');
    const voutNegText = createText(svgNS, 390, 185, 'Vo-', '#000000', '12px');
    svg.appendChild(voutPosText);
    svg.appendChild(voutNegText);
    
    // Ground connections
    const gnd1 = createLine(svgNS, 50, 180, 50, 220, '#00ffff', 3);
    const gnd2 = createLine(svgNS, 380, 180, 380, 220, '#00ffff', 3);
    svg.appendChild(gnd1);
    svg.appendChild(gnd2);
    
    // Ground symbols
    drawGroundSymbol(svg, svgNS, 50, 220);
    drawGroundSymbol(svg, svgNS, 380, 220);
    
    // Circuit title
    const title = createText(svgNS, 250, 30, 'De-emphasis Filter (Low-Pass)', '#00ffff', '16px');
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-weight', 'bold');
    svg.appendChild(title);
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
    textElement.setAttribute('font-weight', 'bold');
    textElement.textContent = text;
    return textElement;
}

function drawGroundSymbol(svg, svgNS, x, y) {
    const gnd1 = createLine(svgNS, x - 10, y, x + 10, y, '#00ffff', 4);
    const gnd2 = createLine(svgNS, x - 6, y + 6, x + 6, y + 6, '#00ffff', 3);
    const gnd3 = createLine(svgNS, x - 3, y + 12, x + 3, y + 12, '#00ffff', 2);
    svg.appendChild(gnd1);
    svg.appendChild(gnd2);
    svg.appendChild(gnd3);
    
    const gndText = createText(svgNS, x, y + 25, 'GND', '#00ffff', '10px');
    gndText.setAttribute('text-anchor', 'middle');
    svg.appendChild(gndText);
}

// Graph functions
function hideAllGraphs() {
    document.getElementById('waveformContainer').style.display = 'none';
    document.getElementById('bodeContainer').style.display = 'none';
    document.getElementById('comparisonContainer').style.display = 'none';
}

function showWaveform() {
    if (!isSimulationRunning) {
        alert('Please start the simulation first!');
        return;
    }
    
    hideAllGraphs();
    document.getElementById('waveformContainer').style.display = 'block';
    document.getElementById('waveformContainer').classList.add('fade-in');
    drawWaveform();
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
    drawComparison();
}

function drawWaveform() {
    console.log('Drawing waveform...');
    const canvas = document.getElementById('waveformCanvas');
    if (!canvas) {
        console.error('Waveform canvas not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const centerY = canvas.height / 2;
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
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
    
    // Center line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();
    
    // Draw input waveform
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x++) {
        const t = (x / canvas.width) * 6 * Math.PI;
        const y = centerY - scaledAmplitude * Math.sin(t);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Draw output waveform
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 4;
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x++) {
        const t = (x / canvas.width) * 6 * Math.PI;
        const y = centerY - scaledAmplitude * gainMagnitude * Math.sin(t + phaseShift);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Labels with background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(10, 10, 300, 120);
    
    ctx.fillStyle = '#00ffff';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Input Signal', 20, 35);
    
    ctx.fillStyle = '#00ff00';
    ctx.fillText('Output Signal', 20, 60);
    
    ctx.fillStyle = '#ffff00';
    ctx.fillText(`Gain: ${(20 * Math.log10(gainMagnitude)).toFixed(1)} dB`, 20, 85);
    
    ctx.fillStyle = '#ff00ff';
    ctx.fillText(`Phase: ${(phaseShift * 180 / Math.PI).toFixed(1)}°`, 20, 110);
    
    console.log('Waveform drawn successfully');
}

function drawBodePlot() {
    console.log('Drawing Bode plot...');
    const canvas = document.getElementById('bodeCanvas');
    if (!canvas) {
        console.error('Bode canvas not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const timeConstant = resistance * capacitance / 1000000;
    const cornerFreq = 1 / (2 * Math.PI * timeConstant);
    const margin = 80;
    const plotWidth = canvas.width - 2 * margin;
    const plotHeight = canvas.height - 2 * margin;
    
    // Draw grid
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
        const x = margin + (i / 10) * plotWidth;
        ctx.beginPath();
        ctx.moveTo(x, margin);
        ctx.lineTo(x, margin + plotHeight);
        ctx.stroke();
    }
    for (let i = 0; i <= 10; i++) {
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
    
    // Draw frequency response
    ctx.strokeStyle = '#00ff00';
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
        const normalizedMagnitude = Math.max(0, Math.min(1, (magnitudeDb + 20) / 40));
        
        const x = margin + i;
        const y = margin + plotHeight - normalizedMagnitude * plotHeight;
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Corner frequency line
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
    }
    
    // Labels
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Frequency (Hz)', canvas.width / 2, canvas.height - 20);
    
    ctx.save();
    ctx.translate(30, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Magnitude (dB)', 0, 0);
    ctx.restore();
    
    console.log('Bode plot drawn successfully');
}

function drawComparison() {
    drawWaveform(); // Reuse the waveform drawing function
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
        
        // Visual feedback
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
