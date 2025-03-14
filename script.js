
// ----------------------------- fetch and confirmation ------------------------------------


async function fetchData() {
    try {
        [hotelData, roomData, roomTypes, cityNames] = await Promise.all([
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


async function checkResponse(response) {
    if (!response.ok) {
        throw new Error('Response is not ok');
    }
    return response.json();
}


document.addEventListener('DOMContentLoaded', async() => {
    try {
        const hotelContainer = document.getElementById('hotel-container');
        const roomContainer = document.getElementById('room-container');
        const roomTypesContainer = document.getElementById('buttons-for-room-sorting');
        const searchBarContainer = document.getElementById('search-bar-container');
        const cityNamesContainer = document.getElementById('button-for-hotel-sorting');


        const {hotelData, roomData, roomTypes, cityNames} = await fetchData();

        if(hotelContainer){
            hotelsForDisplay(hotelData);
        }

        if(roomContainer){
            roomsForDisplay(roomData);
        }

        if(roomTypesContainer){
            roomSortByType(roomTypes);
        }

        if(searchBarContainer){
            searchBar(roomData);
        }

        if(cityNamesContainer){
            hotelSortBycity(cityNames);
        }

    } catch(error){
        console.error("Error in DOMContentLoaded:", error);
    }
});


// ----------------------------- fetch and confirmation end ------------------------------------



// ----------------------------- containters ---------------------------------------


// ----------------------------- hotels HTML ---------------------------------------

async function hotelSortBycity(citiesSort) {
    try {
        let cityNamesContainer = document.getElementById('button-for-hotel-sorting');
        if(!cityNamesContainer) return;

        citiesSort.forEach(citySort => {
            let cityNameButton = document.createElement('button');
            cityNameButton.classList.add('city-name-button');
            cityNameButton.setAttribute('data-city-Name-id', (citiesSort.indexOf(citySort)+1));

            cityNameButton.textContent = citySort;

            cityNamesContainer.appendChild(cityNameButton);

            cityNameButton.addEventListener('click', (event) => {
                let filterbyCityButton = event.target.dataset.cityNameid;
                // console.log(filterbyCityButton);
                sortElementsByCityName(filterbyCityButton);
            })
        });
    } catch (error) {
        console.error('In rooms types sorting:', error);
    }
    
}


if(document.getElementById('button-for-all-hotels')){
    document.getElementById('button-for-all-hotels').addEventListener('click', () => {
        hotelsForDisplay(hotelData);
    });
}


function sortElementsByCityName(filterButtonCityName){
    let elementForSortByCity = document.querySelectorAll('.hotel-card');

    elementForSortByCity.forEach(card => {
        const cityName = cityNames[card.dataset.cityNameid];
        if(filterButtonCityName === cityName){
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    })
}


async function hotelsForDisplay(hotels) {
    try {

        let hotelContainer = document.getElementById('hotel-container');
        if (!hotelContainer) return;

        hotelContainer.innerHTML = '';

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


// ----------------------------- hotels HTML end ---------------------------------------


// ----------------------------- rooms HTML ---------------------------------------


async function roomSortByType(roomsSort) {
    try {
        let roomTypesContainer = document.getElementById('buttons-for-room-sorting'); 
        if(!roomTypesContainer) return;

        roomsSort.forEach(roomSort => {
            let roomTypeButton = document.createElement('button');
            roomTypeButton.classList.add('room-type-button');
            roomTypeButton.setAttribute(`data-room-Type-id`, `${roomSort.id}`);

            roomTypeButton.textContent = roomSort.name;

            roomTypesContainer.appendChild(roomTypeButton);

            roomTypeButton.addEventListener('click', (event) => {
                let filterbyTypeButton = event.target.dataset.roomTypeId;
                // console.log(filterbyTypeButton);
                sortElementsByType(filterbyTypeButton);
            })
        });
    } catch (error) {
        console.error('In rooms types sorting:', error);
    }
    
}


if(document.getElementById('button-for-all-rooms')){
    document.getElementById('button-for-all-rooms').addEventListener('click', () => {
        roomsForDisplay(roomData);
    });
}


async function searchBar() {
    try {
        let searchBarInput = document.getElementById('search-bar-input').value.toLowerCase();
        let roomCards = document.querySelectorAll('.room-card');

        roomCards.forEach(card => {
            let cardName = card.dataset.cardName;

            if(cardName.includes(searchBarInput)){
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });

        document.getElementById('search-bar-clear').addEventListener('click', () => {
            document.getElementById('search-bar-input').value = '';
            searchBar();
        });
        
    } catch (error) {
        console.error('Problem with search bar:', error)
    }
}


function sortElementsByType(filterButtonRoomType){
    let elementForSortByType = document.querySelectorAll('.room-card');

    elementForSortByType.forEach(card => {
        const roomId = card.dataset.roomId;
        if(filterButtonRoomType === roomId){
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}


async function roomsForDisplay(rooms) {
    try {

        let roomContainer = document.getElementById('room-container');
        if (!roomContainer) return;

        roomContainer.innerHTML = '';

        rooms.forEach(room => {
            let roomCard = document.createElement('div');
            roomCard.classList.add('room-card');
            roomCard.setAttribute('data-room-id', `${room.roomTypeId}`)
            roomCard.dataset.cardName = room.name.toLowerCase();
            // console.log(room.id)

            let roomCardImg = document.createElement('div');
            roomCardImg.classList.add('room-card-img');
            roomCardImg.innerHTML = `<img src="${room.images[0]?.source}" alt="${room.name}">`;

            let bookButtonSlide = document.createElement('div');
            bookButtonSlide.classList.add('book-button-slide');
            bookButtonSlide.innerHTML = `
                <div class="title-price-container">
                    <h2><span class="card-name-holder">${room.name}</span></h2>
                    <p>
                        <span class="price-holder">${room.pricePerNight} $</span>
                        <span class="text-holder">a night</span>
                    </p>
                </div>
                <a class="book-now-link" href="./room-details.html">Book Now</a>
            `

            roomContainer.appendChild(roomCard);
            roomCard.appendChild(roomCardImg);
            roomCard.appendChild(bookButtonSlide);


            let bookButton = bookButtonSlide.querySelector('.book-now-link');
            bookButton.addEventListener('click', (event) => {
                event.preventDefault(); 

                localStorage.setItem('selectedRoom', JSON.stringify(room));

                window.location.href = './room-details.html';
            });

            
        });

    } catch (error) {
        console.error('In roomsForDisplay function', error);
    }
}

let photoGallery = [];
let updatedIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    
    let roomImgCarousel = document.getElementById('room-img-carousel');
    let roomBullets = document.getElementById('room-img-bullets');
    let roomInfo = JSON.parse(localStorage.getItem('selectedRoom'));
    

    if (!roomInfo) {
        document.getElementById('room-name-price').innerHTML = `<p>No room details available.</p>`;
        return;
    }

    if (roomInfo) {
        photoGallery = roomInfo.images.map(images => images.source);
        
        if(photoGallery.length>0){
            slider(0)
        }
    }


    roomBullets.innerHTML = photoGallery.map((_, index) => 
        `<span class="bullet" onclick="slider(${index - updatedIndex}, true)"></span>`).join('');

    function updateBullets() {
        document.querySelectorAll('.bullet').forEach((bullet, index) => {
            bullet.classList.toggle('active', index === updatedIndex);
        });
    }


    function slider(index){
        updatedIndex += index;

        if(updatedIndex < 0){
            updatedIndex = photoGallery.length - 1;
        }else if(updatedIndex >= photoGallery.length){
            updatedIndex = 0;
        }
        if(photoGallery.length > 0){
            roomImgCarousel.style.backgroundImage = `url(${photoGallery[updatedIndex]})`;
        }

        updateBullets();
    }

    slider(0);

    document.getElementById('carousel-left').addEventListener('click', () => slider(-1));
    document.getElementById('carousel-right').addEventListener('click', () => slider(1));



    document.getElementById('room-name-price').innerHTML = `
        <h2>${roomInfo.name}: </h2>
        <p><span>${roomInfo.pricePerNight}$</span> per night.</p>
    `;

});




// ----------------------------- rooms HTML end ---------------------------------------


// ----------------------------- containters end ---------------------------------------


// ----------------------------- 

const rangeInput = document.querySelectorAll(".range-field-input");
const priceInput = document.querySelectorAll(".number-field-input");
const range = document.getElementById('slider-progress');

let priceGap = 50;

priceInput.forEach((input) => {
    input.addEventListener("input", (event) => {
        let minPrice = parseInt(priceInput[0].value);
        let maxPrice = parseInt(priceInput[1].value);

        if (maxPrice - minPrice >= priceGap && maxPrice <= rangeInput[1].max) {
            if (event.target.classList.contains('min-number-input')) {
                rangeInput[0].value = minPrice;
                range.style.left = (minPrice / rangeInput[0].max) * 100 + "%";
            } else if(event.target.classList.contains('max-number-input')){
                rangeInput[1].value = maxPrice;
                range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + "%";
            }
        }
    });
});

rangeInput.forEach(input => {
    input.addEventListener("input", (event) => {
        let minVal = parseInt(rangeInput[0].value);
        let maxVal = parseInt(rangeInput[1].value);

        if (maxVal - minVal < priceGap) {
            if (event.target.classList.contains('min-range')) {
                minVal = maxVal - priceGap
                rangeInput[0].value = minVal
            } else if(event.target.classList.contains('max-range')){
                maxVal = minVal + priceGap;
                rangeInput[1].value = maxVal;
            }
        } 
        
        priceInput[0].value = minVal;
        priceInput[1].value = maxVal;
        range.style.left = (minVal / rangeInput[0].max) * 100 + "%";
        range.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
        
    });
});


// --------------------------------- filter -----------------------


document.addEventListener('DOMContentLoaded', () => {
    let today = new Date().toISOString().split('T')[0];

    if(document.getElementById('check-in') && document.getElementById('check-out')){
        document.getElementById('check-in').setAttribute('min', today);
        document.getElementById('check-out').setAttribute('min', today);
    }
    if(document.getElementById('check-in-reservation') && document.getElementById('check-out-reservation')){
        document.getElementById('check-in-reservation').setAttribute('min', today);
        document.getElementById('check-out-reservation').setAttribute('min', today);
    }
    
})


// let startDay = document.getElementById('check-in').value;
// let endDay = document.getElementById('check-out').value;

// console.log()