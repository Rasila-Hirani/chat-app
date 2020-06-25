const socket = io()

//Elements
const $roomSelect = document.querySelector('#rooms')

//Template
const roomTemplate = document.querySelector('#room-template').innerHTML

socket.emit('roomListQuery')

socket.on('roomList',(rooms)=>{ 
   
    const html = Mustache.render(roomTemplate,{rooms})   
    $roomSelect.insertAdjacentHTML('beforeend',html)
})



   