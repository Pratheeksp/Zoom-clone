const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myVideo = document.createElement('video')
myVideo.muted = true

// var peer = new Peer(undefined,{
//     path:'/peerjs',
//     host: '/',
//     port: '3030'
// });

var peer = new Peer();

let myVideoStream

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream)

    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', (userId) => {
        connecToNewUser(userId, stream)
    })

    const text = document.querySelector('input');
    const htmlElement = document.querySelector('html');

    htmlElement.addEventListener('keydown', (e) => {
        if (e.which === 13 && text.value.length !== 0) {
            // console.log(text.value);
            socket.emit('message', text.value);
            text.value = '';
        }
    });

    socket.on('createMessage', message => {
        console.log(message)
        const ul = document.querySelector('ul')
        // ul.append(`<li class='message'><b>user</b><br/>${message}</li>`)
        const newLi = `<li class='message'><b>user</b><br/>${message}</li>`

        ul.innerHTML += newLi;

        scrollToBottom()
    })
})

peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
})

const connecToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
}

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.onloadedmetadata = (e) => {
        video.play();
    }
    videoGrid.append(video)
}

// let text = $('input')

// $('html').keydown((e)=>{
//     if(e.which == 13 && text.val().lenght !== 0){
//         console.log(text.val())
//         socket.emit('message',text.val());
//         text.val('')
//     }
// })

const scrollToBottom =  () =>{
    let d = document.querySelector('.main_chat_window');
    d.scrollTop = d.scrollHeight;
}

const muteUnmute = ()=>{
    const enabled = myVideoStream.getAudioTracks()[0].enabled

    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    }else{
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const setMuteButton = () =>{
    const html = `
        <i class = "fa-solid fa-microphone"></i>
        <span>Mute</span>
    `
    document.querySelector('.main__mute__button').innerHTML = html;
}

const setUnmuteButton = () =>{
    const html = `
        <i class = "unmute fa-solid fa-microphone-slash"></i>
        <span>Unmute</span>
    `
    document.querySelector('.main__mute__button').innerHTML = html;
}

const playStop = () =>{
    // console.log('object')
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo()
    }else{
        setStopVideo()
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

const setStopVideo = () =>{
    const html = `
        <i class = "fa-solid fa-video"></i>
        <span>Stop Video</span>
    `
    document.querySelector('.main__video__button').innerHTML = html;
}

const setPlayVideo = () =>{
    const html = `
        <i class = "stop fa-solid fa-video-slash"></i>
        <span>Play Video</span>
    `
    document.querySelector('.main__video__button').innerHTML = html;
}