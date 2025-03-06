document.addEventListener('DOMContentLoaded', async() => {
    try {
        const hotelContainer = document.getElementById('hotel-container');
        const roomContainer = document.getElementById('room-container');
        const roomTypesContainer = document.getElementById('buttons-for-room-sorting');
        const cityNamesContainer = document.getElementById('button-for-hotel-sorting')

        const { hotelData, roomData, roomTypes, cityNames} = await fetchData();

        if (hotelContainer) {
            hotelsForDisplay(hotelData);
        }

        if (roomContainer) {
            roomsForDisplay(roomData);
        }

        if (roomTypesContainer) {
            roomSortByType(roomTypes);
        }

        if (cityNamesContainer) {
            hotelSortBycity(cityNames);
        }

    } catch (error) {
        console.error("Error in DOMContentLoaded:", error);
    }
});

async function checkResponse(response) {
    if (!response.ok) {
        throw new Error('Response is not ok');
    }
    return response.json();
}

async function fetchData() {
    try {
        let [hotelData, roomData, roomTypes, cityNames] = await Promise.all([
            fetch('https://hotelbooking.stepprojects.ge/api/Hotels/GetAll'),
            fetch('https://hotelbooking.stepprojects.ge/api/Rooms/GetAll'),
            fetch('https://hotelbooking.stepprojects.ge/api/Rooms/GetRoomTypes'),
            fetch('https://hotelbooking.stepprojects.ge/api/Hotels/GetCities')
        ]);

        hotelData = await checkResponse(hotelData);
        roomData = await checkResponse(roomData);
        roomTypes = await checkResponse(roomTypes);
        cityNames = await checkResponse(cityNames);

        return {hotelData, roomData, roomTypes, cityNames};

    } catch (error) {
        console.error('error', error);
        return {hotelData: [], roomData: [], roomTypes: [], cityNames: []};
    }
}

async function hotelSortBycity(citiesSort) {
    try {
        let cityNamesContainer = document.getElementById('button-for-hotel-sorting');
        if(!cityNamesContainer) return;

        citiesSort.forEach(citySort => {
            let cityNameButton = document.createElement('button');
            cityNameButton.classList.add('city-name-button');
            cityNameButton.setAttribute('id', `${citiesSort.indexOf(citySort)+1}`)
            cityNameButton.textContent = citySort;
            console.log(cityNameButton.id)

            cityNamesContainer.appendChild(cityNameButton);
        });
    } catch (error) {
        console.error('In rooms types sorting:', error);
    }
    
}


async function roomSortByType(roomsSort) {
    try {
        let roomTypesContainer = document.getElementById('buttons-for-room-sorting'); 
        if(!roomTypesContainer) return;

        roomsSort.forEach(roomSort => {
            let roomTypeButton = document.createElement('button');
            roomTypeButton.classList.add('room-type-button');
            roomTypeButton.textContent = roomSort.name;

            roomTypesContainer.appendChild(roomTypeButton);
        });
    } catch (error) {
        console.error('In rooms types sorting:', error);
    }
    
}

async function hotelsForDisplay(hotels) {
    try {

        let hotelContainer = document.getElementById('hotel-container');
        if (!hotelContainer) return;

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
        if (!roomContainer) return;

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



