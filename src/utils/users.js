const users = []

// addUser
const addUser = ({id, username, room })=>{
    //Validata Data
    if(!username || !room){
        return {
            error : 'Username and room are required!'
        }
    }
    //Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //check for existing user
    const existingUser = users.find((user) =>{
        return user.room === room && user.username === username
    })

    //Validate username
    if(existingUser){
        return {
            error : 'Username is in use!'
        }
    }
    //Store user    
    const user = {id,username,room}    
    users.push(user)   
    return {user}
}
//remove User
const removeUser =(id) =>{
    const index =users.findIndex((user)=>{
        return user.id === id
    })

    if(index !==1){
        return users.splice(index,1)[0]
    }
}
//getUsers
const getUser = (id) =>{
    return users.find((user) =>user.id === id)
    
}
//get all user of specific room
const getUsersInRoom = (room) =>{
    room =room.trim().toLowerCase()     
  return users.filter((user) => user.room === room)
}
const getAlluser =() => users

module.exports ={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    getAlluser    
}