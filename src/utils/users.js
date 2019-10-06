const users = [];

const addUser = ({id, username, room}) =>{
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();
    
    if(!username || !room){
        return { error: 'Username and room are required.'};
    }

    //Check for existing user
    const existingUser = users.find(user => (user.room === room && user.username === username));
    if(existingUser){
        return {error: 'Username is in use!'}
    }

    const user = {id,username,room};
    users.push(user);
    return {user};
}

const removeUser = (id) => {
    const userIndex = users.findIndex(user=> user.id === id);
    if(userIndex === -1){
        return {error: "User does not exist"};
    }
    const deletedUser = users[userIndex];
    users.splice(userIndex,1);
    return {user: deletedUser};
}

const getUser = (id) => {
    return users.find(user=> user.id === id);
}

const getUsersInRoom = (room) => {
    return users.filter(user=> user.room === room);
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
};