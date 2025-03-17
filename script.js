// ------------------------------ burger menu ----------------------------------

let headerNavUl = document.getElementById('header-nav-ul');
let burgerButton = document.getElementById('burger-button');
let closeBurger = document.getElementById('close-burger');

burgerButton.addEventListener('click', () => {
    headerNavUl.classList.add('active');
});

closeBurger.addEventListener('click', () => {
    headerNavUl.classList.remove('active');
})

// ------------------------------ burger menu end ----------------------------------



// ----------------------------- fetch and confirmation ------------------------------------


async function fetchData() {
    try {
        [hotelData, roomData, roomTypes, cityNames, bookedRoomsdata] = await Promise.all([
            fetch('https://hotelbooking.stepprojects.ge/api/Hotels/GetAll'),
            fetch('https://hotelbooking.stepprojects.ge/api/Rooms/GetAll'),
            fetch('https://hotelbooking.stepprojects.ge/api/Rooms/GetRoomTypes'),
            fetch('https://hotelbooking.stepprojects.ge/api/Hotels/GetCities'),
            fetch('https://hotelbooking.stepprojects.ge/api/Booking'),
        ]);

        hotelData = await checkResponse(hotelData);
        roomData = await checkResponse(roomData);
        roomTypes = await checkResponse(roomTypes);
        cityNames = await checkResponse(cityNames);
        bookedRoomsdata = await checkResponse(bookedRoomsdata);

        return {hotelData, roomData, roomTypes, cityNames, bookedRoomsdata};

    } catch (error) {
        console.error('error', error);
        return {hotelData: [], roomData: [], roomTypes: [], cityNames: [], bookedRoomsdata: []};
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
        const guestFavoriteRooms = document.getElementById('guest-favorite-rooms-container');
        const roomFilter = document.getElementById('room-filter');
        const bookedRoomsContainer = document.getElementById('booked-rooms-container');


        const {hotelData, roomData, roomTypes, cityNames, bookedRoomsdata} = await fetchData();

        if(hotelContainer){
            hotelsForDisplay(hotelData);
        }

        if(roomContainer){
            roomsForDisplay(roomData);
        }

        if(roomTypesContainer){
            roomSortByType(roomTypes);
        }

        if(roomFilter){
            roomFilterForm(roomData);
        }

        if(searchBarContainer){
            searchBar(roomData);
        }

        if(cityNamesContainer){
            hotelSortBycity(cityNames);
        }

        if(guestFavoriteRooms){
            favoriteRooms(roomData);
        }

        if(bookedRoomsContainer){
            getbookedRooms(hotelData, bookedRoomsdata);
        }

    } catch(error){
        console.error("Error in DOMContentLoaded:", error);
    }
});


// ----------------------------- fetch and confirmation end ------------------------------------



// ----------------------------- containters ---------------------------------------


// ------------------------------ home page html ------------------------------------


async function favoriteRooms(rooms) {
    try {
        let allRoomsContainer = rooms;
        let homeFavorites = [];
        let lengthPlaceHolder;
        let favoriteRoomsContainer = document.getElementById('guest-favorite-rooms-container');


        for(let i = 0; i < allRoomsContainer.length - 1; i++){
            for(let j = 0; j < allRoomsContainer.length - 1 - i; j++){
                if(allRoomsContainer[j].bookedDates.length < allRoomsContainer[j+1].bookedDates.length){
                    lengthPlaceHolder = allRoomsContainer[j];
                    allRoomsContainer[j] = allRoomsContainer[j+1];
                    allRoomsContainer[j+1] = lengthPlaceHolder;
                }
            }
        }

        homeFavorites = allRoomsContainer.slice(0, 6);

        homeFavorites.forEach(room => {
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

            favoriteRoomsContainer.appendChild(roomCard);
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
        console.error('favorite rooms error:', error);
    }
}


// ------------------------------ home html end --------------------------------------


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


async function roomFilterForm(roomData) {
    try {

        let roomsToFilter = roomData;
        let roomType;
        let minPrice;
        let maxPrice;

        let decreaseButton = document.getElementById('decrease-button');
        let GuestNumberCount = document.getElementById('guest-number');
        let increaseButton = document.getElementById('increase-button');
        let quantity = 1;

        decreaseButton.addEventListener('click', () => {
            if(quantity > 1){
                quantity--;
                GuestNumberCount.value = quantity;
            }
        });

        increaseButton.addEventListener('click', () => {
            quantity++;
            GuestNumberCount.value = quantity;
        });


        document.getElementById('room-type-select').addEventListener('input', function(){
            roomType = document.getElementById('room-type-select').value;
            console.log(roomType);
        });


        document.getElementById('min-range').addEventListener('input', function(){
            minPrice = document.getElementById('min-range').value;
            document.getElementById('min-number-input').value = minPrice;
        });

        document.getElementById('min-number-input').addEventListener('input', function(){
            minPrice = document.getElementById('min-number-input').value;
            document.getElementById('min-range').value = minPrice;
        });

        document.getElementById('max-range').addEventListener('input', function(){
            maxPrice = document.getElementById('max-range').value;
            document.getElementById('max-number-input').value = maxPrice;
        });

        document.getElementById('max-number-input').addEventListener('input', function(){
            maxPrice = document.getElementById('max-number-input').value;
            document.getElementById('max-range').value = maxPrice;
        });

        document.getElementById('guest-number').addEventListener('input', function(){
            let guests = document.getElementById('guest-number').value;
            if(guests < 1){
                document.getElementById('guest-number').value = 1;
                guests = 1;
            }
            console.log(guests)
        })

        document.getElementById('check-in').addEventListener('input', function(){
            let checkIn = document.getElementById('check-in').value;
            console.log(checkIn)
        })

        document.getElementById('check-out').addEventListener('input', function(){
            let checkIn = document.getElementById('check-out').value;
            console.log(checkIn)
        })


                
        document.getElementById('room-filter').addEventListener('submit', (event) => {
            event.preventDefault();

            let filterRequest = {
                roomTypeId: document.getElementById('room-type-select').value || null,
                priceFrom: parseInt(document.getElementById('min-number-input').value) || 0,
                priceTo: parseInt(document.getElementById('max-number-input').value) || 0,
                maximumGuests: parseInt(document.getElementById('guest-number').value) || 0,
                checkIn: document.getElementById('check-in').value || null,
                checkOut: document.getElementById('check-out').value || null
            }

            document.querySelectorAll('.room-card').forEach(card => {
                // Assume each card has data attributes that match the filter criteria
                const roomPrice = parseInt(card.pricePerNight);
                const roomGuest = parseInt(card.maximumGuests);
                // Add your filtering logic here based on filterRequest properties
                if (roomPrice >= filterRequest.priceFrom && roomPrice <= filterRequest.priceTo &&
                    roomGuest >= filterRequest.maximumGuests) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });

            // fetch('https://hotelbooking.stepprojects.ge/api/Rooms/GetFiltered', {
            //     method: 'POST',
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(filterRequest)
            // })

            // .then(response => response.json())
            // .then(data => console.log('api response:', data))
            // .catch(error => console.error('Error:', error))
        })

        
        
    } catch (error) {
        console.error('filter form:', error);
    }
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

// --------------------------------- rooms html end -------------------------------------




if(document.getElementById('room-details')){
    let photoGallery = [];
    let updatedIndex = 0;

    document.addEventListener('DOMContentLoaded', () => {
        let roomInfo = JSON.parse(localStorage.getItem('selectedRoom'));
        console.log(roomInfo)

        document.getElementById('how-many-persons').innerHTML = `${roomInfo.maximumGuests} Persons`
        let oneNightPrice = roomInfo.pricePerNight;

        // ------------------ carousel start----------------------
        
        let roomImgCarousel = document.getElementById('room-img-carousel');
        let roomBullets = document.getElementById('room-img-bullets');

        if (!roomInfo) {
            document.getElementById('room-name-price').innerHTML = `<p>No room details available.</p>`;
            return;
        }

        document.getElementById('carousel-left').addEventListener('click', () => slider(-1));
        document.getElementById('carousel-right').addEventListener('click', () => slider(1));

        window.slider = function (index){
            updatedIndex += index;

            if(updatedIndex < 0){
                updatedIndex = photoGallery.length - 1;
            }else if(updatedIndex >= photoGallery.length){
                updatedIndex = 0;
            }
            if(photoGallery.length > 0 && roomImgCarousel){
                roomImgCarousel.style.backgroundImage = `url(${photoGallery[updatedIndex]})`;
            }
            updateBullets();
        }

        if (roomInfo.images?.length) {
            photoGallery = roomInfo.images.map(img => img.source);

            for(let i=0; i<photoGallery.length; i++){
                if(!photoGallery[i] || photoGallery[i] === '' || photoGallery[i] === 0 || photoGallery[i] === null || photoGallery[i] === undefined){
                    photoGallery.splice(i, 1);
                    i--;
                }
            }
            slider(0);
        }
        
        if(!photoGallery || photoGallery.length === 0){
            roomImgCarousel.innerHTML = `<p class="if-no-img"><span>No Imgs</span></p>`
            document.getElementById('if-no-img').style.display = 'flex';
            return
        } 

        roomBullets.innerHTML = photoGallery.map(() => `<span class="bullet"></span>`).join('');

        function updateBullets() {
            document.querySelectorAll('.bullet').forEach((bullet, index) => {
                bullet.classList.toggle('active', index === updatedIndex);
            });
        }

        document.querySelectorAll('.bullet').forEach((bullet, index) => {
            bullet.addEventListener('click', () => slider(index - updatedIndex));
            slider(0);
        });

        // ---------------- carousel end ------------------

        document.getElementById('room-name-price').innerHTML = `
            <h2>${roomInfo.name}: </h2>
            <p><span>${roomInfo.pricePerNight}$</span> per night.</p>
        `;

        document.getElementById('check-in-reservation').addEventListener('input', function(){
            validateCheckIn();
            calculateTotalPrice();
        });

        document.getElementById('check-out-reservation').addEventListener('input', function(){
            validateCheckOut();
            calculateTotalPrice();
        });

        document.getElementById('customer-name').addEventListener('input', function(){
            validateName();
        });

        document.getElementById('customer-phone').addEventListener('input', function(){
            validatePhone();
        });


        function validateCheckIn(){
            let checkIn = new Date(document.getElementById('check-in-reservation').value);
            let today = new Date();
            today.setHours(0, 0, 0, 0);
            let errorMessage = document.getElementById('check-in-error');

            if (!checkIn.getTime()) {
                errorMessage.textContent = "Please select a check-in date.";
            } else if (checkIn < today) {
                errorMessage.textContent = "Check-in date cannot be in the past.";
            } else {
                errorMessage.textContent = "";
                return checkIn;
            }
        }

        function takeCheckInTime(){
            let checkInExtraction = validateCheckIn();

            if(checkInExtraction){
                let newDate = new Date(checkInExtraction);
                let formattedDate = newDate.toISOString().split('.')[0];
                return formattedDate;
            } else {
                return null
            }
        }

        function validateCheckOut() {
            let checkIn = new Date(document.getElementById("check-in-reservation").value);
            let checkOut = new Date(document.getElementById("check-out-reservation").value);
            let errorMessage = document.getElementById("check-out-error");
        
            if (!checkOut.getTime()) {
                errorMessage.textContent = "Please select a check-out date.";
            } else if (checkOut <= checkIn) {
                errorMessage.textContent = "Check-out must be after check-in.";
            } else {
                errorMessage.textContent = "";
                return checkOut;
            }
        }

        function takeCheckOutTime(){
            let checkOutExtraction = validateCheckOut();

            if(checkOutExtraction){
                let newDate = new Date(checkOutExtraction);
                let formattedDate = newDate.toISOString().split('.')[0];
                return formattedDate;
            } else {
                return null
            }
        }

        function validateName() {
            let name = document.getElementById("customer-name").value.trim();
            let errorMessage = document.getElementById("name-error");
        
            if (name.length < 3) {
                errorMessage.textContent = "Name must be at least 3 characters long.";
            } else {
                errorMessage.textContent = "";
                return name;
            }
        }

        function validatePhone() {
            let phone = document.getElementById("customer-phone").value.trim();
            let phonePattern = /^[0-9]{10}$/;
            let errorMessage = document.getElementById("number-error");
        
            if (!phonePattern.test(phone)) {
                errorMessage.textContent = "Enter a valid 10-digit phone number.";
            } else {
                errorMessage.textContent = "";
                return phone;
            }
        }

        function calculateTotalPrice() {
            let checkIn = new Date(document.getElementById("check-in-reservation").value);
            let checkOut = new Date(document.getElementById("check-out-reservation").value);
            let totalPriceElement = document.getElementById("total-price");
            let totalBookinPrice;
            if (checkIn.getTime() && checkOut.getTime() && checkOut > checkIn) {
                let nights = (checkOut - checkIn) / (1000 * 60 * 60 * 24);
                totalBookinPrice = nights * oneNightPrice;
                totalPriceElement.innerHTML = `Total Price: <span>${totalBookinPrice}$</span>.`;
                return totalBookinPrice;
            } else {
                totalPriceElement.innerHTML = `Total Price: <span>${0}$</span>.`;
            }
        }

        console.log(roomInfo.id)

        document.getElementById('room-form').addEventListener('submit', function(event){
            event.preventDefault();

            // console.log(validateCheckIn())
            // console.log(validateCheckOut())
            // console.log(validateName())
            // console.log(validatePhone())
            // console.log(calculateTotalPrice())
            // console.log(takeCheckInTime())

            let roomPoster = {
                roomID: roomInfo.id || 0,
                checkInDate: `${takeCheckInTime()}` || null,
                checkOutDate: `${takeCheckOutTime()}` || null,
                totalPrice: calculateTotalPrice() || 0,
                isConfirmed: roomInfo.available || null,
                customerName: `${validateName()}` || null,
                customerId: `` || null,
                customerPhone: validatePhone() || 0
            }

            // console.log(roomPoster)

            // fetch('https://hotelbooking.stepprojects.ge/api/Booking', {         <---------------------- booking POST
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify(roomPoster)
            // })

            // .then(response => response.json())
            // .then(data => console.log('API response', data))
            // .catch(error => console.log('API error', error))
        })

    });
}


async function getbookedRooms(hotelData, bookedRoomsdata) {
    try {
        let bookingHotels = hotelData;
        let bookingRooms = bookedRoomsdata;

        bookingHotels.forEach(hotel => {
            console.log(hotel)
        })
        
        
    } catch (error) {
        console.error('room booking:', error);
    }
}

// console.log(document.getElementById('total-price').textContent)


// function totalPriceCalculator(price){
//     let checkInDate = document.getElementById('check-in-reservation').value;
//     console.log(checkInDate)
//     let checkOutDate = document.getElementById('check-out-reservation').value;
//     console.log(checkOutDate)
//     let pricePerNight = price;
//     let fullPrice = 0;

//     // if(!checkInDate || !checkOutDate || !pricePerNight){
//     //     return `$0`;
//     // }

//     let checkIn = new Date(checkInDate);
//     let checkOut = new Date(checkOutDate);

//     // if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
//     //     document.getElementById('total-price').innerText = "Invalid date selection!";
//     //     return;
//     // }

//     if(checkIn > checkOut){
//         checkIn = checkOut;
//     }
//     if(checkOut < checkIn){
//         checkOut = checkIn;
//     }

//     if(document.getElementById('check-in') && document.getElementById('check-out')){
//         checkIn.setAttribute('max', checkOut);
//         checkOut.setAttribute('min', checkIn);
//     }

//     let numberOfNights = (checkOut - checkIn) / (1000 * 60 * 60 * 24);

//     if(checkIn - checkOut === 0){
//         numberOfNights = 1;
//     }

//     if (numberOfNights <= 0) {
//         document.getElementById('total-price').innerText = "Invalid dates! Check-out must be after check-in.";
//         return;
//     }

//     if(numberOfNights && pricePerNight){
//         fullPrice = numberOfNights * pricePerNight;
//     }
    
//     document.getElementById('total-price').innerHTML = `Total price:<span> $${fullPrice}</span>.`

//     return numberOfNights * pricePerNight;
// }

// function checkBookedRooms(bookedRooms, Id){
//     let allRoomBooking = bookedRooms;
//     let roomId = Id
// }

// document.getElementById('room-filter').addEventListener('submit', (event) => {
//     event.preventDefault();

    
// })





// document.getElementById('filter-submit-button').addEventListener('click',() => {
//     let postFilter = {
//         roomTypeId: document.getElementById('room-type-select').
//     }
// })



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
        let checkInInput = document.getElementById('check-in');
        let checkOutInput = document.getElementById('check-out');

        checkInInput.setAttribute('min', today);
        checkOutInput.setAttribute('min', today);

        checkInInput.addEventListener('change', () => {
            let checkInDate = new Date(checkInInput.value);
            let checkOutDate = new Date(checkOutInput.value);
    
            if (checkOutDate <= checkInDate) {
                checkOutInput.value = "";
                checkOutInput.setAttribute("min", checkInInput.value);
            }
        });
    
        checkOutInput.addEventListener('change', () => {
            let checkInDate = new Date(checkInInput.value);
            let checkOutDate = new Date(checkOutInput.value);
    
            if (checkInDate >= checkOutDate) {
                alert("Check-out date must be after check-in date.");
                checkOutInput.value = "";
            }
        });
    }
    if(document.getElementById('check-in-reservation') && document.getElementById('check-out-reservation')){

        let checkInInput = document.getElementById('check-in-reservation');
        let checkOutInput = document.getElementById('check-out-reservation');

        checkInInput.setAttribute('min', today);
        checkOutInput.setAttribute('min', today);

        checkInInput.addEventListener('change', () => {
            let checkInDate = new Date(checkInInput.value);
            let checkOutDate = new Date(checkOutInput.value);
    
            if (checkOutDate < checkInDate) {
                checkOutInput.value = "";
                checkOutInput.setAttribute("min", checkInInput.value);
            }
        });
    
        checkOutInput.addEventListener('change', () => {
            let checkInDate = new Date(checkInInput.value);
            let checkOutDate = new Date(checkOutInput.value);
    
            if (checkInDate > checkOutDate) {
                alert("Check-out date must be after check-in date.");
                checkOutInput.value = "";
            }
        });
    }
    
})