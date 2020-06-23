const socket = io();

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = document.querySelector('#input-text')
const $sendMsgButton =  document.querySelector('#btn-send')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
const $msgDIV = document.querySelector('#message-div')
const $outgoingMessage = document.querySelector('#outgoing_msg')
const $userList = document.querySelector('#chat-list-div')
const $user_Name = document.querySelector('#username_head')

const $messageBox = document.querySelector('#message-box')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const OutgoingMessageTemplate = document.querySelector('#outgoing-message-template').innerHTML
const locationTemplate = document.querySelector('#location-template-incoming').innerHTML
const locationTemplateOutgoing = document.querySelector('#location-template-outgoing').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Options
const {username, createRoom, joinRoom } = Qs.parse(location.search,{ignoreQueryPrefix:true})
$user_Name.innerHTML =username

//check joining choice
const roomCheck =() =>{
    if(createRoom ==="" && joinRoom ===""){
        alert('Create a room OR Select an existing one')
        location.href ='/'
        return
    }
    const roomname = createRoom !=="" ?createRoom :joinRoom 
    return roomname
}
const room =roomCheck()
socket.emit('join',{username,room},(error)=>{
    if(error){       
        alert(error)   
        location.href ='/'    
    }
   
}) 
const autoScroll =() =>{
    //New message element
    const $newMessage = $msgDIV.lastElementChild

    //Height of new message
    const newMsgStyle = getComputedStyle($newMessage)
    const newMsgMargin = parseInt(newMsgStyle.marginBottom)

    const newMsgHeight = $newMessage.offsetHeight + newMsgMargin

    //Visible height
    const visibleHeight = $msgDIV.offsetHeight

    //Hight of message container
    const containerHeight =$msgDIV.scrollHeight

    //How far I scrolled
    const scrolloffset =$msgDIV.scrollTop + visibleHeight

    if(containerHeight - newMsgHeight <=scrolloffset){
        $msgDIV.scrollTop = $msgDIV.scrollHeight
    }
}

socket.on('message',(msg)=>{    
    
    if(socket.id === msg.id){
        const html = Mustache.render(OutgoingMessageTemplate,{           
            username:msg.username,
            message:msg.text,
            createdAt:moment(msg.createdAt).format('h:mm A')
        })
        $messageBox.insertAdjacentHTML('beforeend',html)                
    }
    else{
        const html = Mustache.render(messageTemplate,{ 
            name_letter:msg.username.charAt(0).toUpperCase(),
            username:msg.username,
            message:msg.text,
            createdAt:moment(msg.createdAt).format('h:mm A')
        })
        $messageBox.insertAdjacentHTML('beforeend',html)  
           
    }    
    autoScroll()  
})

socket.on('locationMessage',(url)=>{   
    
        if(socket.id === url.id){ 
            const html = Mustache.render(locationTemplateOutgoing,{
                username:url.username,
                url:url.link,
                createdAt:moment(url.createdAt).format('h:mm A')
            })          
            $messageBox.insertAdjacentHTML('beforeend',html)           
        }
        else{
            const html = Mustache.render(locationTemplate,{
                name_letter:url.username.charAt(0).toUpperCase(),
                username:url.username,
                url:url.link,
                createdAt:moment(url.createdAt).format('h:mm A')
            })     
            $messageBox.insertAdjacentHTML('beforeend',html)              
        }
        autoScroll()     
   
})

socket.on('roomData',({room,users})=>{   
   const html = Mustache.render(sidebarTemplate,{
       room,
       users
   }) 
  $userList.innerHTML=""
  $userList.insertAdjacentHTML("beforeend",html)
})


$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault(); 
  
    //disable send Button
    $sendMsgButton.setAttribute('disabled','disabled')
        
    const msg = $messageFormInput.value;      
    socket.emit('SendMessage',msg,(message)=>{
        //enable send Button   

        $sendMsgButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()
        console.log('Message is delivered!',message)
    }) 
   
})
$sendLocationButton.addEventListener('click',() =>{
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser.')
    }
    $sendLocationButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{     
        socket.emit('SendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },()=>{
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared!')
        })
    })
})




