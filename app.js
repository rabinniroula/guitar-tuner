navigator.getUserMedia = navigator.getUserMedia
    || navigator.webkitGetUserMedia
    || navigator.mozGetUserMedia;
navigator.getUserMedia({ video: false, audio: true }, callback, console.log);

function callback(stream) {
    ctx = new AudioContext();
    console.log(ctx);
    mic = ctx.createMediaStreamSource(stream);
    spe = ctx.createAnalyser();
    spe.fftSize = 32768;
    bufferLength = spe.frequencyBinCount;
    dataArray = new Float32Array(bufferLength);
    mic.connect(spe);
    draw();
}

const canvas = document.getElementById('tuneMon');
const canvasCtx = canvas.getContext('2d');
canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

function draw() {
    //Schedule next redraw
    requestAnimationFrame(draw);

    //Get spectrum data
    spe.getFloatFrequencyData(dataArray);
    console.log(1.3458 * dataArray.indexOf(Math.max.apply(null, dataArray)));

    //Draw black background
    canvasCtx.fillStyle = 'rgb(0, 0, 0)';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    //Draw spectrum
    const barWidth = (canvas.width / bufferLength) * 2.5;
    let posX = 0;
    for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] + 140) * 2;
        canvasCtx.fillStyle = 'rgb(' + Math.floor(barHeight + 100) + ', 50, 50)';
        canvasCtx.fillRect(posX, canvas.height - barHeight / 2, barWidth, barHeight / 2);
        posX += barWidth + 1;
    }
};