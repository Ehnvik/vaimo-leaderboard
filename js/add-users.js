$( ()=> {
$('.user-add-form').on('submit', addNewUser)
displayUsers()
})

const addNewUser = (e) => {
        e.preventDefault()
       const username = $('#user-name-input').val().trim().toLowerCase()
       $('#user-name-input').val('')
       checkUsername(username)
}

const checkUsername = (username) => {
    const users = getUsers()
    const user = users.find((user) => user.name === username)
    $('#error-message').text('')
    if(user) {
        $('#error-message').text(`Username "${username}" already exists`)

    } else if(username === '') {
        $('#error-message').text('Please choose a username')
    } else {
        createUserObject(username)
    }
    
  
    
}

const createUserObject = (username) => {
    const user = {
        id: Date.now(),
        name: username,
        time: ""
   }
   saveUser(user)
}

const getUsers = () => {
    return JSON.parse(localStorage.getItem('users')) || []
}

const sendUsers = (users) => {
    return localStorage.setItem('users', JSON.stringify(users))
}

const saveUser = (user) => {
    const users = getUsers()
    users.push(user)
    sendUsers(users)
    displayUsers()
}

const deleteUser = () => {
    let users = getUsers()
    $('.delete-user-btn').on('click', (e) => {
        const userId = e.currentTarget.getAttribute('id')
        users = users.filter(user => user.id.toString() !== userId)
        sendUsers(users)
        displayUsers()
    })
}

const displayUsers = () => {
    const users = getUsers()
    let html = '<div class="users-list">'
    users.forEach(user => {

        const username = user.name[0].toUpperCase() + user.name.slice(1)

        html += `
            <div class="user-container">
                <p class="user-name">${username}</p>
                <button class="delete-user-btn" id="${user.id}">Delete</button>
            </div>
        `
    })

    html += '</div>'
    $('#user-list-wrapper').html(html) 
    deleteUser()
}