// ======================================
// ARSH MUSIC PLAYER v2.0
// Part 1 - Variables + Functions
// ======================================

// ===== Elements =====

const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const cover = document.querySelector(".cover");

const songName = document.getElementById("songName");
const artistName = document.getElementById("artistName");

const progress = document.getElementById("progress");
const volume = document.getElementById("volume");

const favorite = document.getElementById("favorite");
const repeat = document.getElementById("repeat");
const shuffle = document.getElementById("shuffle");
const darkMode = document.getElementById("darkMode");

const playlist = document.getElementById("playlist");
const search = document.getElementById("search");

const time = document.getElementById("time");

const player = document.querySelector(".player");

const bars = document.querySelectorAll(".visualizer span");




// ================= Songs =================

const songs = [

{
name:"Song 1",
artist:"Artist 1",
file:"songs/song1.mp3",
cover:"images/cover1.jpg"
},

{
name:"Song 2",
artist:"Artist 2",
file:"songs/song2.mp3",
cover:"images/cover2.jpg"
},

{
name:"Song 3",
artist:"Artist 3",
file:"songs/song3.mp3",
cover:"images/cover3.jpg"
},

{
name:"Song 4",
artist:"Artist 4",
file:"songs/song4.mp3",
cover:"images/cover4.jpg"
},

{
name:"Song 5",
artist:"Artist 5",
file:"songs/song5.mp3",
cover:"images/cover5.jpg"
},

{
name:"Song 6",
artist:"Artist 6",
file:"songs/song6.mp3",
cover:"images/cover6.jpg"
},

{
name:"Song 7",
artist:"Artist 7",
file:"songs/song7.mp3",
cover:"images/cover7.jpg"
},

{
name:"Song 8",
artist:"Artist 8",
file:"songs/song8.mp3",
cover:"images/cover8.jpg"
},

{
name:"Song 9",
artist:"Artist 9",
file:"songs/song9.mp3",
cover:"images/cover9.jpg"
},

{
name:"Song 10",
artist:"Artist 10",
file:"songs/song10.mp3",
cover:"images/cover10.jpg"
}

];


// ================= Variables =================

let audioContext;

let analyser;

let source;

let dataArray;

let currentSong = 0;

let playlistItems = [];

let shuffleMode = false;

let repeatMode = false;

let dark = false;

let themeIndex = 0;

let favorites =
JSON.parse(localStorage.getItem("favorites")) || [];

const themes = [
"blue",
"purple",
"green",
"red"
];


// ================= Load Song =================

function loadSong(index){

audio.src = songs[index].file;

cover.src = songs[index].cover;

songName.textContent = songs[index].name;

artistName.textContent = songs[index].artist;

progress.value = 0;

audio.load();

updateFavorite();

updatePlaylist();

}


// ================= Play =================

function pauseSong(){

audio.pause();

playBtn.innerHTML = "▶️";

cover.classList.remove("rotate");

bars.forEach(bar=>{

bar.style.animationPlayState="paused";

});

}


// ================= Favorite UI =================

function playSong(){

    audio.play();

    playBtn.innerHTML = "⏸️";

    cover.classList.add("rotate");

    bars.forEach(bar=>{
        bar.style.animationPlayState = "running";
    });

}
function updateFavorite(){

if(favorites.includes(currentSong)){

favorite.innerHTML="❤️";

favorite.classList.add("liked");

}else{

favorite.innerHTML="🤍";

favorite.classList.remove("liked");

}

}


// ================= Playlist UI =================

function updatePlaylist(){

playlistItems.forEach((item,index)=>{

item.classList.toggle("active",index===currentSong);

});

}


// First Song

loadSong(currentSong);

// ======================================
// Part 2 - Playlist + Controls
// ======================================


// ===== Playlist =====

songs.forEach((song,index)=>{

    const li = document.createElement("li");

    li.innerHTML = "▶️ " + song.name;

    li.dataset.name = song.name.toLowerCase();

    playlist.appendChild(li);

    playlistItems.push(li);

    li.addEventListener("click",()=>{

        currentSong = index;

        loadSong(currentSong);

        playSong();

    });

});

updatePlaylist();


// ===== Play / Pause =====

playBtn.addEventListener("click",()=>{

    if(audio.paused){

        playSong();

    }else{

        pauseSong();

    }

});


// ===== Next =====

nextBtn.addEventListener("click",()=>{

    if(shuffleMode){

        currentSong =
        Math.floor(Math.random()*songs.length);

    }else{

        currentSong++;

        if(currentSong>=songs.length){

            currentSong=0;

        }

    }

    loadSong(currentSong);

    playSong();

});


// ===== Previous =====

prevBtn.addEventListener("click",()=>{

    if(shuffleMode){

        currentSong =
        Math.floor(Math.random()*songs.length);

    }else{

        currentSong--;

        if(currentSong<0){

            currentSong=songs.length-1;

        }

    }

    loadSong(currentSong);

    playSong();

});


// ===== Progress =====

audio.addEventListener("timeupdate",()=>{

    if(audio.duration){

        progress.value =
        (audio.currentTime/audio.duration)*100;

        let cm =
        Math.floor(audio.currentTime/60);

        let cs =
        Math.floor(audio.currentTime%60);

        let tm =
        Math.floor(audio.duration/60);

        let ts =
        Math.floor(audio.duration%60);

        if(cs<10) cs="0"+cs;

        if(ts<10) ts="0"+ts;

        time.innerHTML =
        `${cm}:${cs} / ${tm}:${ts}`;

    }

});


// ===== Seek =====

progress.addEventListener("input",()=>{

    audio.currentTime =
    (progress.value/100)*audio.duration;

});


// ===== Volume =====

volume.addEventListener("input",()=>{

    audio.volume = volume.value;

});

// ======================================
// Part 3 - Advanced Features
// ======================================


// ===== Favorite =====

favorite.addEventListener("click",()=>{

    if(favorites.includes(currentSong)){

        favorites = favorites.filter(song=>song!==currentSong);

    }else{

        favorites.push(currentSong);

    }

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

    updateFavorite();

});


// ===== Repeat =====

repeat.addEventListener("click",()=>{

    repeatMode = !repeatMode;

    audio.loop = repeatMode;

    repeat.style.opacity = repeatMode ? "1" : "0.6";

});


// ===== Shuffle =====

shuffle.addEventListener("click",()=>{

    shuffleMode = !shuffleMode;

    shuffle.style.opacity = shuffleMode ? "1" : "0.6";

});


// ===== Auto Next =====

audio.addEventListener("ended",()=>{

    if(repeatMode){

        playSong();

        return;

    }

    if(shuffleMode){

        currentSong =
        Math.floor(Math.random()*songs.length);

    }else{

        currentSong++;

        if(currentSong>=songs.length){

            currentSong=0;

        }

    }

    loadSong(currentSong);

    playSong();

});


// ===== Search =====

search.addEventListener("input",()=>{

    const value = search.value.toLowerCase();

    playlistItems.forEach(item=>{

        if(item.dataset.name.includes(value)){

            item.style.display="block";

        }else{

            item.style.display="none";

        }

    });

});


// ===== Dark Mode =====

darkMode.addEventListener("click",()=>{

    dark = !dark;

    player.classList.toggle("dark");

    darkMode.innerHTML = dark ? "☀️" : "🌙";

});


// ===== Keyboard =====

document.addEventListener("keydown",(event)=>{

    if(event.target.tagName==="INPUT") return;

    if(event.code==="Space"){

        event.preventDefault();

        if(audio.paused){

            playSong();

        }else{

            pauseSong();

        }

    }

    if(event.code==="ArrowRight"){

        nextBtn.click();

    }

    if(event.code==="ArrowLeft"){

        prevBtn.click();

    }

});


// ===== Theme Changer =====
// (Ye tabhi chalega jab HTML me
// id="theme" button hoga)

const themeBtn = document.getElementById("theme");

if(themeBtn){

    themeBtn.addEventListener("click",()=>{

        document.body.classList.remove(...themes);

        themeIndex++;

        if(themeIndex>=themes.length){

            themeIndex=0;

        }

        document.body.classList.add(themes[themeIndex]);

    });

}


// ===== Initial UI =====

updateFavorite();

updatePlaylist();

audio.volume = volume.value;

function setupVisualizer(){

    if(audioContext) return;

    audioContext = new AudioContext();

    analyser = audioContext.createAnalyser();

    source = audioContext.createMediaElementSource(audio);

    source.connect(analyser);

    analyser.connect(audioContext.destination);

    analyser.fftSize = 64;

    dataArray = new Uint8Array(analyser.frequencyBinCount);

    animateVisualizer();

}

function animateVisualizer(){

    requestAnimationFrame(animateVisualizer);

    analyser.getByteFrequencyData(dataArray);

    bars.forEach((bar,index)=>{

        let value = dataArray[index] || 10;

        bar.style.height = (value / 2) + "px";

    });

}
