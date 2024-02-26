import { drivers } from "./drivers.js"

let username = ""
let selectedDriver = null

$( ()=> {
$('.user-add-form').on('submit', createNewUser)
displayDrivers()
displayUsers()
disableChosenDrivers()

$('#user-name-input').on('change', function() {
    username = $(this).val().trim().toLowerCase();
});

$(document).on('click', '.driver-img', function(e) {
    const driverId = $(this).data('driver-id');
    selectedDriver = drivers.find(driver => driver.id === driverId.toString());
    $('.driver-img').removeClass('driver-selected');
    $(this).addClass('driver-selected');
});

})

const disableChosenDrivers = () => {
    const users = getUsers();

    $('.driver-img').each(function() {
        const driverId = $(this).data('driver-id').toString();
        const isChosen = users.some(user => user.driver && user.driver.id === driverId);

        if (isChosen) {
            $(this).addClass('driver-taken');
        }
    });
};


const createNewUser = (e) => {
        e.preventDefault()
       if(username === '') {
        $('#username-message').text('Please choose a username')
        setTimeout(() => {
            $('#username-message').text('');
        }, 5000);
       } else if (selectedDriver === null) {
        $('#driver-message').text('Please select a driver')
        setTimeout(() => {
            $('#driver-message').text('');
        }, 5000);
       } else  {
        checkUsernameAndDriver(username, selectedDriver)
       }
       username = ""
       selectedDriver = null
       $('#user-name-input').val('')
}

const checkUsernameAndDriver = (username, selectedDriver) => {
    console.log(username, selectedDriver);
    const users = getUsers()
    const user = users.find((user) => user.name === username)
    const driver = users.find(user => user.driver.id === selectedDriver.id)
    $('#error-message').text('')
    if(user) {
        $('#username-message').text(`Username "${username}" already exists`)
        setTimeout(() => {
            $('#username-message').text('');
        }, 5000);
    } else if(driver) {
        $('#driver-message').text(`Driver "${driver.driver.name}" already chosen`)
        setTimeout(() => {
            $('#driver-message').text('');
        }, 5000);
    } else {
        createUserObject(username)
    }
}

const createUserObject = (username) => {
    const user = {
        id: Date.now(),
        name: username,
        time: "",
        driver: { 
            id: selectedDriver.id,
            name: selectedDriver.name,
            team: selectedDriver.team,
            img: selectedDriver.img
        }
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
    disableChosenDrivers()
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
                <img class="driver-img" src="${driver.img}" data-driver-id="${driver.id}" alt="Image on ${driver.name}">
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
            <img class="user-img" src="${user.driver.img}" alt="Image on ${user.driver.name}">
                <p class="user-name">${username}</p>
                <i class="fa-solid fa-delete-left delete-user-btn" id="${user.id}"></i>
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