//All the MAC stuff
const ROLE_ADMIN = 'ADMIN'//Priority 2
const ROLE_USER = 'USER'//Priority 1

//Function to get the priority level of a ROLE
const getPriority = function(role){
    switch(role){
        case ROLE_ADMIN:
            return 2;
        case ROLE_USER:
            return 1;
        default:
            return 1;
    }
}

module.exports = {
    ROLE_ADMIN : ROLE_ADMIN,
    ROLE_USER : ROLE_USER,
    getPriority : getPriority
}