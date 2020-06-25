const socket = io()

//Elements
const $roomSelect = document.querySelector('#rooms')
const $joinForm = document.querySelector('#joinForm')

//Template
const roomTemplate = document.querySelector('#room-template').innerHTML

socket.emit('roomListQuery')

socket.on('roomList',(rooms)=>{ 
    
    console.log('login page socket :-',socket.id)
    const html = Mustache.render(roomTemplate,{rooms})   
    $roomSelect.insertAdjacentHTML('beforeend',html)
})



   