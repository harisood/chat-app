const {rooms} = require('./rooms');
const users = [];

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, creator, room }) => {
    //Clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    // Check for existing user and room
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username;
    });

    
    const existingRoom = rooms.find((liveRoom) => {
        return liveRoom.name === room && creator === 'true'
        });
 
    // Validate username
    if (existingRoom) {
        return {
            error: 'That room already exists!'
        };
    };
    
    if (existingUser) {
        return {
            error: 'Username already taken!'
        };
    };

    

    // Store user
    const user = { id, username, room }
    users.push(user);
    return { user }
};

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0]
    };
};

const getUser = (id) => {
    return users.find((user) => user.id === id);
};

const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room);
};

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    users
};

/* TESTING FUNCTIONS */
// addUser({
//     id: 22,
//     username: 'Hari    ',
//     room: 'london    '
// });

// addUser({
//     id: 33,
//     username: 'Mike',
//     room: 'london'
// });

// addUser({
//     id: 44,
//     username: 'Hari',
//     room: 'birmingham'
// });


// specificRoom = getUsersInRoom('birmingm');

// console.log(specificRoom);


// console.log(users);

// const removedUser = removeUser(22);

// console.log(removedUser);
// console.log(users);

// const res = addUser({
//     id: 33,
//     username: 'Hari',
//     room: 'london'
// })

// console.log(res);