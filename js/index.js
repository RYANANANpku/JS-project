var body = document.getElementById('body');
// 获取主题背景
var bg = document.getElementById('bg');
// 获取音频播放器
var audio = document.getElementById('audioTag');
// 歌曲名
var musicTitle = document.getElementById('music-title');
// 歌曲海报
var recordImg = document.getElementById('record-img');
// 歌曲作者
var author = document.getElementById('author-name');

var container = document.getElementById('container');

// 进度条
var progress = document.getElementById('progress');
// 总进度条
var progressTotal = document.getElementById('progress-total');

// 已进行时长
var playedTime = document.getElementById('playedTime');
// 总时长
var audioTime = document.getElementById('audioTime');

// 播放模式按钮
var mode = document.getElementById('playMode');
// 上一首
var skipForward = document.getElementById('skipForward');
// 暂停按钮
var pause = document.getElementById('playPause');
// 下一首
var skipBackward = document.getElementById('skipBackward');
// 音量调节
var volume = document.getElementById('volume');
// 音量调节滑块
var volumeTogger = document.getElementById('volumn-togger');

// 列表
var list = document.getElementById('list');
// 倍速
var speed = document.getElementById('speed');
// 切换
var change = document.getElementById('change');

// upload
var upload = document.getElementById('upload');

// 左侧关闭面板
var closeList = document.getElementById('close-list');
// 音乐列表面板
var musicList = document.getElementById('music-list');

// 上传歌曲表单
var form = document.getElementById('uploadForm');
var submit = document.getElementById('submit');
var reset = document.getElementById('resetBtn');
var hint = document.getElementById("hint");

// 暂停/播放功能实现
pause.onclick = function (e) {
    if (audio.paused) {
        audio.play();
        rotateRecord();
        pause.classList.remove('icon-play');
        pause.classList.add('icon-pause');
    } else {
        audio.pause();
        rotateRecordStop();
        pause.classList.remove('icon-pause');
        pause.classList.add('icon-play');
    }
}

// 更新进度条
audio.addEventListener('timeupdate', updateProgress); // 监听音频播放时间并更新进度条
function updateProgress() {
    var value = audio.currentTime / audio.duration;
    progress.style.width = value * 100 + '%';
    playedTime.innerText = transTime(audio.currentTime);
}

//音频播放时间换算
function transTime(value) {
    var time = "";
    var h = parseInt(value / 3600);
    value %= 3600;
    var m = parseInt(value / 60);
    var s = parseInt(value % 60);
    if (h > 0) {
        time = formatTime(h + ":" + m + ":" + s);
    } else {
        time = formatTime(m + ":" + s);
    }

    return time;
}

// 格式化时间显示，补零对齐
function formatTime(value) {
    var time = "";
    var s = value.split(':');
    var i = 0;
    for (; i < s.length - 1; i++) {
        time += s[i].length == 1 ? ("0" + s[i]) : s[i];
        time += ":";
    }
    time += s[i].length == 1 ? ("0" + s[i]) : s[i];

    return time;
}

// 点击进度条跳到指定点播放
progressTotal.addEventListener('mousedown', function (event) {
    // 只有音乐开始播放后才可以调节，已经播放过但暂停了的也可以
    if (!audio.paused || audio.currentTime != 0) {
        var pgsWidth = parseFloat(window.getComputedStyle(progressTotal, null).width.replace('px', ''));
        var rate = event.offsetX / pgsWidth;
        audio.currentTime = audio.duration * rate;
        updateProgress(audio);
    }
});


// 点击列表展开音乐列表
list.addEventListener('click', function (event) {
    musicList.classList.remove("list-card-hide");
    musicList.classList.add("list-card-show");
    musicList.style.display = "flex";
    closeList.style.display = "flex";
    closeList.addEventListener('click', closeListBoard);
});

// 点击关闭面板关闭音乐列表
function closeListBoard() {
    musicList.classList.remove("list-card-show");
    musicList.classList.add("list-card-hide");
    closeList.style.display = "none";
}

// 切换播放界面
var num = 0;

change.addEventListener('click', function (event) {
    if(num == 0)
    {
        container.style.display = "none";
        bg.classList.remove("recorder-hide");
        bg.classList.add("recorder-show");
        bg.style.display = "block";
        num = 1;
        document.body.style.overflow = "hidden";
        return;
    }
    else{
        bg.classList.remove("recorder-show");
        bg.classList.add("recorder-hide");
        setTimeout(function() {
            container.style.display = "block";
            bg.style.display = "none";
        }, 600);
        num = 0;
    }
});

// 存储当前播放的音乐序号// 后台音乐列表
// let musicData = [['洛春赋', '云汐'], ['Yesterday', 'Alok/Sofi Tukker'], ['江南烟雨色', '杨树人'], ['Vision pt.II', 'Vicetone']];
let musicData = []; // {songFile, songName, artistName, backgroundImage}





// // 暴力捆绑列表音乐
// document.getElementById("music0").addEventListener('click', function (event) {
//     musicId = 0;
//     initAndPlay();
// });
// document.getElementById("music1").addEventListener('click', function (event) {
//     musicId = 1;
//     initAndPlay();
// });
// document.getElementById("music2").addEventListener('click', function (event) {
//     musicId = 2;
//     initAndPlay();
// });
// document.getElementById("music3").addEventListener('click', function (event) {
//     musicId = 3;
//     initAndPlay();
// });


// TODO: 传入乐曲的名字和艺术家
// 1. 填入播放列表，即添加div子元素
// 2. 完成事件绑定
// to 敬鼎豪：为了方便理解我把addToPlaylist给包装成了一个addSongFile函数
// addSongFile主要是方便浏览器初始化，你不用在意
function addToPlaylist(songId, songName = "unknown", artistName = "unknown"){
    l = document.createElement('div')
    l.setAttribute('id', `music${songId}`)
    l.innerText = songName + ' - ' + artistName
    document.getElementById("all-list").appendChild(l)
    // throw Error;
    document.getElementById(`music${songId}`).addEventListener('click', function (event) {
        musicId = songId;
        initAndPlay();
    }); 
    musicId = songId;
    initAndPlay();
}


// 添加新的乐曲到播放列表
function addSongFile(songFile, songName, artistName, backgroundImage){
    musicData.push({songFile, songName, artistName, backgroundImage});

    // TODO
    addToPlaylist(musicData.length - 1, songName, artistName);

    return musicData.length -1;
}
// 初始化音乐
function initMusic() {
    // audio.src = "mp3/music" + musicId.toString() + ".mp3";
    var reader = new FileReader(); // 创建一个 FileReader 对象

    reader.onload = function(e) {
        try {
            audio.src = e.target.result;
            audio.oncanplay = function() {
                audio.play(); // 当音频文件加载完成后，开始播放
            };
        } catch (error) {
            console.log("try", e);
        }
    };
    reader.readAsDataURL(musicData[musicId]["songFile"]); // 以 DataURL 格式读取文件
    audio.load();
    recordImg.classList.remove('rotate-play');
    audio.ondurationchange = function () {
        musicTitle.innerText = musicData[musicId]["songName"];
        author.innerText = musicData[musicId]["artistName"];

        var reader1 = new FileReader();
        reader1.onload = function(e){
            try {
                recordImg.style.backgroundImage = 'url(' + e.target.result + ')';
                bg.style.backgroundImage = 'url(' + e.target.result + ')';
            } catch (error) {
                console.log("try", e);
            }
        }
        reader1.readAsDataURL(musicData[musicId]["backgroundImage"])

        audioTime.innerText = transTime(audio.duration);
        // 重置进度条
        audio.currentTime = 0;
        updateProgress();
        refreshRotate();
    }
}
// initMusic();

// 初始化并播放
function initAndPlay() {
    initMusic();
    pause.classList.remove('icon-play');
    pause.classList.add('icon-pause');
    try {
        // audio.play();
        rotateRecord();
    } catch (error) {
        console.log("try", e);
    }
}

// 播放模式设置
var modeId = 1;
mode.addEventListener('click', function (event) {
    modeId = modeId + 1;
    if (modeId > 3) {
        modeId = 1;
    }
    mode.style.backgroundImage = "url('img/mode" + modeId.toString() + ".png')";
});

audio.onended = function () {
    if (modeId == 2) {
        // 跳转至下一首歌
        musicId = (musicId + 1) % 4;
    }
    else if (modeId == 3) {
        // 随机生成下一首歌的序号
        var oldId = musicId;
        while (true) {
            musicId = Math.floor(Math.random() * 3) + 0;
            if (musicId != oldId) { break; }
        }
    }
    initAndPlay();
}


// upload功能
upload.addEventListener('click', function (event) {
    // 切换表单的显示状态
    if (form.style.display === 'none') {
        form.reset();
        hint.innerHTML = "";
        form.style.display = 'flex';
    } else {
        form.style.display = 'none';
    }
});


// 监听表单的submit事件
form.addEventListener('submit', function(event) {
    // 阻止表单的默认提交行为
    event.preventDefault();

    // 获取用户输入的数据
    var songFile = document.getElementById('songFile').files[0];
    var songName = document.getElementById('songName').value;
    var artistName = document.getElementById('artistName').value;
    var backgroundImage = document.getElementById('backgroundImage').files[0];

    if(songFile === undefined || backgroundImage === undefined){
        hint.innerHTML = "歌曲文件或专辑封面文件为空！";
        return;
    } 
    if(songName === ""){songName = songFile.name.substring(0, songFile.name.lastIndexOf("."));}
    if(artistName === ""){artistName = "未知"}

    // 存储并将歌曲加入播放列表
    addSongFile(songFile, songName, artistName, backgroundImage);

    form.style.display = 'none';
});



// 上一首
skipForward.addEventListener('click', function (event) {
    musicId = musicId - 1;
    if (musicId < 0) {
        musicId = 3;
    }
    initAndPlay();
});

// 下一首
skipBackward.addEventListener('click', function (event) {
    musicId = musicId + 1;
    if (musicId > 3) {
        musicId = 0;
    }
    initAndPlay();
});

// 倍速功能（这里直接暴力解决了）
speed.addEventListener('click', function (event) {
    var speedText = speed.innerText;
    if (speedText == "1.0X") {
        speed.innerText = "1.5X";
        audio.playbackRate = 1.5;
    }
    else if (speedText == "1.5X") {
        speed.innerText = "2.0X";
        audio.playbackRate = 2.0;
    }
    else if (speedText == "2.0X") {
        speed.innerText = "0.5X";
        audio.playbackRate = 0.5;
    }
    else if (speedText == "0.5X") {
        speed.innerText = "1.0X";
        audio.playbackRate = 1.0;
    }
});


// 刷新唱片旋转角度
function refreshRotate() {
    recordImg.classList.add('rotate-play');
}

// 使唱片旋转
function rotateRecord() {
    recordImg.style.animationPlayState = "running"
}

// 停止唱片旋转
function rotateRecordStop() {
    recordImg.style.animationPlayState = "paused"
}

// 存储上一次的音量
var lastVolumn = 70

// 滑块调节音量
audio.addEventListener('timeupdate', updateVolumn);
function updateVolumn() {
    audio.volume = volumeTogger.value / 70;
}

// 点击音量调节设置静音
volume.addEventListener('click', setNoVolumn);
function setNoVolumn() {
    if (volumeTogger.value == 0) {
        if (lastVolumn == 0) {
            lastVolumn = 70;
        }
        volumeTogger.value = lastVolumn;
        volume.style.backgroundImage = "url('img/音量.png')";
    }
    else {
        lastVolumn = volumeTogger.value;
        volumeTogger.value = 0;
        volume.style.backgroundImage = "url('img/静音.png')";
    }
}