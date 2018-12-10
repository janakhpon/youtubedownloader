// Imports/Requirements and Variable Assignments
const remote = require('electron').remote;
const { app } = require('electron').remote;


const ById = function (id) {
    return document.getElementById(id);
};
const path = require('path');

let back = ById('back'),
    pause = ById('pause'),
    play = ById('play'),
    forward = ById('forward'),
    video = ById('video'),
    audio = ById('audio'),
    subtitle = ById('subtitle'),
    help = ById('help'),
    refresh = ById('reload'),
    clear = ById('clear'),
    exit = ById('exit'),
    view = ById('view'),
    progress1 = ById('progress1'),
    progress2 = ById('progress2'),
    progress3 = ById('progress3'),
    progress4 = ById('progress4'),
    status = ById('statuschange');

var
    fs = require('fs'),
    ytdl = require('ytdl-core'),
    ffmpeg = require('fluent-ffmpeg');

var
    msgstart = "started",
    msgfinished = "downloaded",
    msgnormal = "normal";





status.value = msgnormal;




function downAudio() {

    const url = view.getURL();

    const id = '';

    var video_id = url.split('v=')[1];
    var ampersandPosition = video_id.indexOf('&');
    if (ampersandPosition != -1) {
        video_id = video_id.substring(0, ampersandPosition);
    }


    let name = view.getTitle();



    let stream = ytdl(video_id, {
        quality: 'highestaudio',
        //filter: 'audioonly',
    });

    let start = Date.now();
    ffmpeg(stream)
        .audioBitrate(128)
        .save(`${app.getPath('home')}/Downloads/${name}.mp3`)
        .on('progress', (p) => {
            status.value = msgstart;
            progress1.value = p.targetSize + 'kb downloaded';

        })
        .on('end', () => {
            status.value = msgfinished;
            progress4.value = 'Success' + (Date.now() - start) / 1000 + 's';
            

        });


}



function downSubtitle() {


}



function downVideo() {
    let name = view.getTitle();
    const url = view.getURL();


    const output = path.resolve(`${app.getPath('home')}/Downloads/`, `${name}`+'.mp4');
    const video = ytdl(url);
    let starttime;
    video.pipe(fs.createWriteStream(output));
    video.once('response', () => {
        starttime = Date.now();
    });



    video.on('progress', (chunkLength, downloaded, total) => {

        status.value = msgstart;
        const floatDownloaded = downloaded / total;
        const downloadedMinutes = (Date.now() - starttime) / 1000 / 60;

        var progress1v = "Progress : " + (floatDownloaded * 100).toFixed(2) + '%';
        progress1.value = progress1v;

        var progress2v = "Downloaded : " + (downloaded / 1024 / 1024).toFixed(2) + 'MB of ' + (total / 1024 / 1024).toFixed(2) + 'MB';
        progress2.value = progress2v;

        var progress3v = 'Running for : ' + downloadedMinutes.toFixed(2) + 'minutes';
        progress3.value = progress3v;

        var progress4v = 'Estimated time left : ' + (downloadedMinutes / floatDownloaded - downloadedMinutes).toFixed(2) + 'minutes';
        progress4.value = progress4v;
    });
    video.on('end', () => {
        status.value = msgfinished;
    });

}





function clearCache() {

    status.value = msgnormal;
    progress1.value = " ";
    progress2.value = " ";
    progress3.value = " ";
    progress4.value = " ";
    view.clearHistory();

}


function goBackward() {

    view.goBack();

}



function goNext() {

    view.goForward();
}


function goPlay() {


}


function goPausse() {

    view.stop();

}


function goRefresh() {

    view.reload();

}


function goHelp() {


}



video.addEventListener('click', downVideo);
audio.addEventListener('click', downAudio);
clear.addEventListener('click', clearCache);
exit.addEventListener('click', () => {
    const window = remote.getCurrentWindow();
    window.close();
});