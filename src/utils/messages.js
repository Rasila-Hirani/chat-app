const generateMessage = (username,text,id) => {
    return{
        username,
        text,
        id,
        createdAt : new Date().getTime()
    }
}

const generateLocationMessage =(username,link,id) =>{
   return{
       username,
       link,
       id,
       createdAt : new Date().getTime()
   } 
}

module.exports ={
    generateMessage,
    generateLocationMessage
}