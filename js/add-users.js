import { drivers } from "./drivers.js"

$( ()=> {
$('.user-add-form').on('submit', addNewUser)
displayDrivers()
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

export const getUsers = () => {
    return JSON.parse(localStorage.getItem('users')) || []
}

export const sendUsers = (users) => {
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

const displayDrivers = () => {
    let html = ''; 

    drivers.forEach(driver => {
        html += `
            <div class="driver-container">
                <img class="driver-img" src="${driver.img}" alt="Image on ${driver.name}">
                <h3 class="driver-name">${driver.name}</h3>
                <p class="driver-team">${driver.team}</p>
            </div>
        `;
    });

    $('.drivers-slider').html(html); 
    initializeSlider(); 
};

const displayUsers = () => {
    const users = getUsers()
    let html = '<div class="users-list">'
    users.forEach(user => {
     const username = user.name[0].toUpperCase() + user.name.slice(1)
        html += `
            <div class="user-container">
                <p class="user-name">${username}</p>
                <i class="fa-solid fa-delete-left" id="${user.id}"></i>
            </div>
        `
    })

    html += '</div>'
    $('#user-list-wrapper').html(html) 
    deleteUser()
}

const initializeSlider = () => {
    $('.drivers-slider').slick({
        dots: true,
        arrows: true,
        infinite: true,
        speed: 300,
        slidesToShow: 5,
        slidesToScroll: 5,
        cssEase: 'linear',
        autoplay: true,
        autoplaySpeed: 5000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    })
}