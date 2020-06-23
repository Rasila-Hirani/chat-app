const rooms =[]

const addRoom =(newRoom)=>{   

    //Clean data
    newRoom = newRoom.trim().toLowerCase()

    //check if room existing
    const isRoomExist = rooms.find(room => room === newRoom)

    if(isRoomExist){
        return newRoom
    }

    //store Room
    rooms.push(newRoom)
    return newRoom

}
const getAllRoom = () =>{
    return rooms
}
module.exports ={
    addRoom,
    getAllRoom
}