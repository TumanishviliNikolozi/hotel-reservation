document.addEventListener('DOMContentLoaded', () => {
    fetchData().then(({hotelData, roomData}) => {
        hotelsForDisplay(hotelData);
        roomsForDisplay(roomData);
    })
})



async function checkResponse(response) {
    if (!response.ok) {
        throw new Error('Response is not ok');
    }
    return response.json();
}

async function fetchData() {
    try {
        let [hotelData, roomData] = await Promise.all([
            fetch('https://hotelbooking.stepprojects.ge/api/Hotels/GetAll'),
            fetch('https://hotelbooking.stepprojects.ge/api/Rooms/GetAll')
        ]);

        hotelData = await checkResponse(hotelData);
        roomData = await checkResponse(roomData);

        return {hotelData, roomData};

    } catch (error) {
        console.error('error', error);
    }
}

async function hotelsForDisplay(hotels) {
    try {

        let hotelContainer = document.getElementById('hotel-container');

        hotels.forEach(hotel => {
            let hotelCard = document.createElement('div');
            hotelCard.classList.add('hotel-card');

            let hotelCardImg = document.createElement('div');
            hotelCardImg.classList.add('hotel-card-img');
            hotelCardImg.innerHTML = `<img src="${hotel.featuredImage}" alt="${hotel.name}">`;

            let viewRoomsButtonSlide = document.createElement('div');
            viewRoomsButtonSlide.classList.add('view-rooms-button-slide');
            viewRoomsButtonSlide.innerHTML = `
                <h2><span>${hotel.name}</span></h2>
                <a class="view-rooms-link" href="/hotel/${hotel.id}">View Rooms</a>
            `

            hotelContainer.appendChild(hotelCard);
            hotelCard.appendChild(hotelCardImg);
            hotelCard.appendChild(viewRoomsButtonSlide);
        });

    } catch (error) {
        console.error('In hotelsForDisplay function:', error);
    }
}

async function roomsForDisplay(rooms) {
    try {

        let roomContainer = document.getElementById('room-container');

        rooms.forEach(room => {
            let roomCard = document.createElement('div');
            roomCard.classList.add('room-card');

            let roomCardImg = document.createElement('div');
            roomCardImg.classList.add('room-card-img');
            roomCardImg.innerHTML = `<img src="${room.images[0]?.source}" alt="${room.name}">`;

            let bookButtonSlide = document.createElement('div');
            bookButtonSlide.classList.add('book-button-slide');
            bookButtonSlide.innerHTML = `
                <div class="title-price-container">
                    <h2><span>${room.name}</span></h2>
                    <p>
                        <span class="price-holder">${room.pricePerNight} $</span>
                        <span class="text-holder">a night</span>
                    </p>
                </div>
                <a class="book-now-link" href="/book/${room.id}">Book Now</a>
            `

            roomContainer.appendChild(roomCard);
            roomCard.appendChild(roomCardImg);
            roomCard.appendChild(bookButtonSlide);
        });

    } catch (error) {
        console.error('In roomsForDisplay function', error);
    }
}


document.getElementById('button-for-all-rooms').addEventListener('click', () => {
    fetchData().then(({roomData}) => {
        roomsForDisplay(roomData);
    })
})

document.getElementById('button-for-single-rooms').addEventListener('click', () => {
    fetchData().then(({hotelData}) => {
        hotelsForDisplay(hotelData);
    })
})

