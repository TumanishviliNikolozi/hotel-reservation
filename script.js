const allHotelsRequest = fetch('https://hotelbooking.stepprojects.ge/api/Hotels/GetAll')

.then(response => {
    if(!response.ok){
        throw new Error ('response is not ok')
    }
    return response.json()
})


const allRoomsRequest = fetch('https://hotelbooking.stepprojects.ge/api/Rooms/GetAll')

.then(response => {
    if(!response.ok){
        throw new Error ('response is not ok')
    }
    return response.json()
})

allHotelsRequest.then(hotelData => {
    const hotelContainer = document.getElementById('hotel-container');

    hotelData.forEach(hotels => {
        let hotelCard = document.createElement('div');
        hotelCard.classList.add('hotel-card');

        let hotelCardImg = document.createElement('div');
        hotelCardImg.classList.add('hotel-card-img');
        hotelCardImg.innerHTML = `
        <img src="${hotels.featuredImage}" alt="${hotels.name}">`
        
        let viewRoomsButtonSlide = document.createElement('div');
        viewRoomsButtonSlide.classList.add('view-rooms-button-slide');

        viewRoomsButtonSlide.innerHTML = `
        <h2><span>${hotels.name} </span></h2>
        <a class="view-rooms-link" href="">${"View Rooms"}</a>
        `


        hotelContainer.appendChild(hotelCard);
        hotelCard.appendChild(hotelCardImg);
        hotelCard.appendChild(viewRoomsButtonSlide);
        
    })
})

allRoomsRequest.then(roomData => {
    const roomContainer = document.getElementById('room-container');

    roomData.forEach(rooms => {
        let roomCard = document.createElement('div');
        roomCard.classList.add('room-card');

        let roomCardImg = document.createElement('div');
        roomCardImg.classList.add('room-card-img');
        roomCardImg.innerHTML = `
        <img src="${rooms.images[0].source}" alt="${rooms.name}">`
        
        let bookButtonSlide = document.createElement('div');
        bookButtonSlide.classList.add('book-button-slide');

        bookButtonSlide.innerHTML = `
        <h2><span>${rooms.name} </span></h2>
        <p><span>${rooms.pricePerNight}$ a night </span></p>
        <a class="view-rooms-link" href="">${"Book Now"}</a>
        `

        roomContainer.appendChild(roomCard);
        roomCard.appendChild(roomCardImg);
        roomCard.appendChild(bookButtonSlide);
    })
})

.catch(error =>{
    console.error("შეცდომა", error)
})