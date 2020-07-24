const users = []; // Start with empty array of users

// Join user to chat
function userJoin(id, username, room) {
    const user = { id, username, room };

    // Add user's information to users array
    users.push(user);
    return user;
}

// Get current user by id
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0]; // return user [0] in users array
    }
}

// Get room users
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
  }


module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
  };