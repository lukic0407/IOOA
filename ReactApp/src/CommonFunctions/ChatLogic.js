export const getSender = (loggedInUser, users) =>{
    return users[0]._id === loggedInUser ? `${users[1].name} ${users[1].surname}` : `${users[0].name} ${users[0].surname}`;
}
