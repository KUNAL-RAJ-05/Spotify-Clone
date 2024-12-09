// console.log('Lets write js ');
let cuurentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder){
     currFolder = folder
    let a = await fetch(`/${folder}/`);
    let response =await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])
        }
        
    }
    
    
    let songul=document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML =""
    for (const song of songs) {
        songul.innerHTML=songul.innerHTML + `<li>
                            <img class="invert" src="music.svg" alt="music">
                            <div class="info">
                                <div>${song.replaceAll("%20"," ")}</div>
                                <div>Kunal</div>
                            </div>
                            <div class="playnow">

                                <span>Play Now</span>
    
                                <img class="invert" src="play.svg" alt="play">
                            </div></li>`
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
        //  console.log(e.querySelector(".info").firstElementChild.innerHTML);
           playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim()) 
        })
        
    })

    return songs
    
}
const playMusic =(track , pause = false)=>{
    // let audio = new Audio("/songs/"+track)
    cuurentSong.src = `/${currFolder}/`+ track
    if(!pause){
        cuurentSong.play()
        play.src = "pause.svg"
    }
    cuurentSong.play()
    
    document.querySelector(".songinfo").innerHTML= decodeURI(track)
    document.querySelector(".songtime").innerHTML="00:00 / 00:00";

  
}
async function displayAlbums() {
    let a = await fetch(`/songs/`);
    let response =await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors=div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer")
    let array =Array.from(anchors);
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
        
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
          let folder=e.href.split("/").slice(-2)[0];
            //get the meta data of the folder
            let a = await fetch(`/songs/${folder}/info.json`);
            let response =await a.json();
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card ">
                        <div  class="play">

                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="15" height="15"
                                color="#000000" fill="#000">
                                <path
                                    d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                                    stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                            </svg>


                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="play">
                        <h1>${response.title}</h1>
                        <p>${response.description}</p>
                    </div>`
        }
    }
     //load the playlist whenever card is clicked

   Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click",async item=>{
        songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
        playMusic(songs[0])
        
    })
   })
}

async function mani(){
    
    await getSongs("songs/ncs");
    playMusic(songs[0],true)
    
    
    //display all the albums on the page
    await displayAlbums();

   
   play.addEventListener("click",()=>{
    if(cuurentSong.paused){
        cuurentSong.play()
        play.src = "pause.svg"
    }
    else{
        cuurentSong.pause()
        play.src = "play.svg"
    }
   })

   //listen for time update
   cuurentSong.addEventListener("timeupdate",()=>
{
    // console.log(cuurentSong.currentTime,cuurentSong.duration);
    document.querySelector(".songtime").innerHTML = `${
        secondsToMinutesSeconds(cuurentSong.currentTime)}/ ${secondsToMinutesSeconds(cuurentSong.duration)}`
        document.querySelector(".circle").style.left = (cuurentSong.currentTime/cuurentSong.duration)*100 + "%";
})
 //add an event listerner to seekbar
 document.querySelector(".seekbar").addEventListener("click",e=>{
    let percent =(e.offsetX/e.target.getBoundingClientRect().width)*100 ;
    document.querySelector(".circle").style.left= percent + "%";
    cuurentSong.currentTime = ((cuurentSong.duration)*percent)/100;
    
 })
 document.querySelector(".hamburger").addEventListener("click",()=>{
          document.querySelector(".left").style.left = "0" })

 document.querySelector(".close").addEventListener("click",()=>{
          document.querySelector(".left").style.left = "-120%"
   })
    
   previous.addEventListener("click",()=>{
    
    let index =songs.indexOf(cuurentSong.src.split("/").slice(-1)[0])
    
    if((index+1)>=0){

        playMusic(songs[index-1])
    }
    
   })

   next.addEventListener("click",()=>{
    // console.log("Next clciked");
    let index =songs.indexOf(cuurentSong.src.split("/").slice(-1)[0])
    
    if((index+1) < songs.length - 1){

        playMusic(songs[index+1])
    }

    
   })

  
}
mani();
   





