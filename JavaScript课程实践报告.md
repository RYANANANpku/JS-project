# JavaScript课程实践报告

侯欣昀 敬鼎豪

## 一、项目描述

本次项目，我们二人以小组为单位做了一个JS软件项目。我们参考qq音乐的界面，开发了一个音乐网站。我们使用JS实现了网站主界面和播放界面的切换功能，并且实现了用户上传音乐文件并播放的功能。

## 二、项目展示









### 播放队列

用户可以通过点击播放队列来手动切换想听的歌曲。

<img src="report/music list.png" alt="image-20240628204344708" style="zoom:50%;" />

点击右下角按钮可以切换、关闭播放队列。

点击空白处也可以关闭播放队列。



### 上传歌曲

初始播放队列为空，用户需要手动上传歌曲。

用户点击右下角按钮进行上传：
<img src="report/how to upload.png" alt="image-20240628201327279" style="zoom:50%;" />

弹出信息窗口，两个file input元素各自限定了选择的文件格式必须为为音频和图片。

<img src="report/form.png" alt="image-20240628202510855" style="zoom:50%;" />

用户点击上传以后，程序会判断文件与封面是否已上传，否则拒绝提交。

上传成功后会自动播放新的歌曲，歌曲也会出现在播放队列里

<img src="report/new music.png" alt="image-20240628203632598" style="zoom:50%;" />

> 示例音乐文件被存放在`/music`，示例专辑封面被存放在`/images`



## 三、实现过程





### 播放队列

播放列表的开关

```javascript
// 点击列表展开音乐列表
function openListBoard(event) {
    musicList.classList.remove("list-card-hide");
    musicList.classList.add("list-card-show");
    musicList.style.display = "flex";
    closeList.style.display = "flex";
    closeList.addEventListener('click', closeListBoard)
    list.removeEventListener('click', openListBoard)
    list.addEventListener('click', closeListBoard);
}

list.addEventListener('click', openListBoard);

// 点击关闭面板关闭音乐列表
function closeListBoard() {
    list.removeEventListener('click', closeListBoard);
    list.addEventListener('click', openListBoard);
    musicList.classList.remove("list-card-show");
    musicList.classList.add("list-card-hide");
    closeList.style.display = "none";
}
```

向文件上传功能提供的接口

```javascript
// 1. 填入播放列表，即添加div子元素
// 2. 完成事件绑定
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

    addToPlaylist(musicData.length - 1, songName, artistName);

    return musicData.length -1;
}
```

### 上传文件

文件信息全部存储在data这一array中

```javascript
let musicData = []; // {songFile, songName, artistName, backgroundImage}

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
```

在`initMusic`中使用`FileReader`对File对象进行读取，需要回传`audio.oncanplay`来保证音乐加载完毕，防止promise报错

```javascript

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
```



## 四、总结



## 五、附录

