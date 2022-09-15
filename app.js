navigator.getUserMedia = navigator.getUserMedia
    || navigator.webkitGetUserMedia
    || navigator.mozGetUserMedia;
navigator.getUserMedia({ video: false, audio: true }, callback, console.log);

const mon = document.getElementById('tuneMon');
const note = document.getElementById('note');

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

function draw() {
    //Schedule next redraw
    requestAnimationFrame(draw);

    //Get spectrum data
    spe.getFloatFrequencyData(dataArray);
    freq = (1.3458 * dataArray.indexOf(Math.max.apply(null, dataArray))).toFixed(2);
    mon.textContent = freq;
    diff = [];
    for (let i = 0; i < Object.values(notes).length; i++){
        diff[i] = Math.abs(Object.values(notes)[i] - freq);
    }
    n = Object.keys(notes)[diff.indexOf(Math.min(...diff))];
    note.textContent = n;

}