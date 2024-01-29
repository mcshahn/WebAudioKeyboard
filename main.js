// var audioCtx;
// const playButton = document.querySelector('button');
// playButton.addEventListener('click', function(){
//     if (!audioCtx){
//         audioCtx = new (window.AudioContext||window.webkitAudioContext);
//         let osc = audioCtx.createOscillator();
//         osc.connect(audioCtx.destination);
//         osc.start();
//     }
// })


document.addEventListener("DOMContentLoaded", function(event) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var songName = "";

    // var waveform = "sine";
    const globalGain = audioCtx.createGain(); //this will control the volume of all notes
    // globalGain.gain.setValueAtTime(0.8, audioCtx.currentTime)
    globalGain.connect(audioCtx.destination);


    const keyboardFrequencyMap = {
        '90': 261.625565300598634,  //Z - C
        '83': 277.182630976872096, //S - C#
        '88': 293.664767917407560,  //X - D
        '68': 311.126983722080910, //D - D#
        '67': 329.627556912869929,  //C - E
        '86': 349.228231433003884,  //V - F
        '71': 369.994422711634398, //G - F#
        '66': 391.995435981749294,  //B - G
        '72': 415.304697579945138, //H - G#
        '78': 440.000000000000000,  //N - A
        '74': 466.163761518089916, //J - A#
        '77': 493.883301256124111,  //M - B
        '81': 523.251130601197269,  //Q - C
        '50': 554.365261953744192, //2 - C#
        '87': 587.329535834815120,  //W - D
        '51': 622.253967444161821, //3 - D#
        '69': 659.255113825739859,  //E - E
        '82': 698.456462866007768,  //R - F
        '53': 739.988845423268797, //5 - F#
        '84': 783.990871963498588,  //T - G
        '54': 830.609395159890277, //6 - G#
        '89': 880.000000000000000,  //Y - A
        '55': 932.327523036179832, //7 - A#
        '85': 987.766602512248223,  //U - B
    }

    window.addEventListener('keydown', keyDown, false);
    window.addEventListener('keyup', keyUp, false);

    activeOscillators = {}
    gainNodes = {}
    var numNotes = 0;
    var learningMode = false;
    var numNotesPlayed = 0
    function keyDown(event) {
        const key = (event.detail || event.which).toString();
        if (keyboardFrequencyMap[key] && !activeOscillators[key]) {
            numNotes ++;
            globalGain.gain.setTargetAtTime(0.4/numNotes, audioCtx.currentTime, .1);
            playNote(key);
        }


        //if the key pressed is a shift, we go into learning mode
        if (key == '16'){
            learningMode = !learningMode;
        }
        if (!learningMode){
            document.body.style.background = 'white';
        }else{
            document.body.style.background = 'yellow';
        }
        if (learningMode && key != '16'){

            var prevSongName = songName;
            songName = document.querySelector('input[name="songs"]:checked').value;
            if (prevSongName != songName){
                numNotesPlayed = 0;
            }
            const songsMap = {
                'twinkleStar': 'zzbbnnbvvccxxzbbvvccxbbvvccxzzbbnnbvvccxxz',
                "happyBirthday": 'zzxzvczzxzbvzzqnvcxjjnvbv'
            }
            function learnSongs(idx){
                return songsMap[songName].charAt(idx);
            }
            
            const correctChar = learnSongs(numNotesPlayed).toLowerCase();
            const playedChar = String.fromCharCode(key).toLowerCase();
            if (correctChar != playedChar){
                numNotesPlayed = 0;
                document.body.style.background = 'red';
            }else{
                document.body.style.background = 'yellow';
                numNotesPlayed ++;

                if (numNotesPlayed == songsMap[songName].length){
                    document.body.style.background = 'hsl(120, 60%, 70%)';
                }
        
            }
        }
    }

    function keyUp(event) {
        const key = (event.detail || event.which).toString();
        if (keyboardFrequencyMap[key] && activeOscillators[key]) {
 
            var releaseTime = audioCtx.currentTime + 0.3;
            gainNodes[key].gain.setTargetAtTime(0, releaseTime - 0.25, .1);
            // gainNodes[key].gain.setValueAtTime(gainNodes[key].gain.value, audioCtx.currentTime); 
            // gainNodes[key].gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.05);
            delete activeOscillators[key];
            delete gainNodes[key];
            numNotes --;
        }
    }
    
    function playNote(key) {
        const osc = audioCtx.createOscillator();
        osc.frequency.setValueAtTime(keyboardFrequencyMap[key], audioCtx.currentTime)
        osc.type = document.querySelector('input[name="waveform"]:checked').value;
       

        activeOscillators[key] = osc
        const gainNode = audioCtx.createGain();

        osc.connect(gainNode).connect(globalGain)

        gainNodes[key] = gainNode
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.9, audioCtx.currentTime + 0.001);

        osc.start();
       
    }
    
}
)




