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


// ------------------------------ flatpickr calendar ---------------------------------


if(document.getElementById('room-filter')){
    let filterCheckIn = flatpickr('#check-in', {
        minDate: 'today',
        onChange: function(selectedDates) {
            let minCheckoutDate = selectedDates[0] ? selectedDates[0].fp_incr(1) : null;
            filterCheckOut.set('minDate', minCheckoutDate);
        }
    })
    
    let filterCheckOut = flatpickr('#check-out', {
        minDate: new Date()
    })
}

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
        const reservedRoomsContainer = document.getElementById('booked-rooms-container');
        const roomReservationForm = document.getElementById('room-form');
        const otherRooms = document.getElementById('other-room-container');


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

        if(searchBarContainer){
            searchBar(roomData);
        }

        if(cityNamesContainer){
            hotelSortBycity(cityNames);
        }

        if(guestFavoriteRooms){
            favoriteRooms(roomData);
        }

        if(otherRooms){
            otherRoomsForRoomDetails(roomData)
        }

        if(reservedRoomsContainer){
            getbookedRooms(hotelData, bookedRoomsdata, roomData);
        }

        // if(roomReservationForm){
        //     checkReservedDays(bookedRoomsdata);
        // }

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

                document.querySelectorAll('.room-type-button').forEach(button => {
                    button.classList.remove('active-room-type-button');
                });
                
                event.target.classList.add('active-room-type-button');
            })


        });

    } catch (error) {
        console.error('In rooms types sorting:', error);
    }
    
}


if(document.getElementById('button-for-all-rooms')){
    document.getElementById('button-for-all-rooms').addEventListener('click', () => {
        roomsForDisplay(roomData);

        document.querySelectorAll('.room-type-button').forEach(button => {
            button.classList.remove('active-room-type-button');
        });
    });
}

if(document.getElementById('room-filter')){

    document.getElementById('room-filter').addEventListener('submit', (event) => {
        event.preventDefault();

        let flatCheckin = document.getElementById('check-in').value;
        let flatCheckout = document.getElementById('check-out').value;

        if(!flatCheckin || !flatCheckout){
            alert("Please select both check-in and check-out dates.");
            // event.preventDefault();
            return;
        }
    
        let formData = new FormData(event.target);
        let filterInfo = Object.fromEntries(formData);
    
        fetch('https://hotelbooking.stepprojects.ge/api/Rooms/GetFiltered', {
            method: 'POST',
            headers: {
                accept: 'text/plain',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(filterInfo)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            roomsForDisplay(data);
        })
    })


    document.addEventListener('DOMContentLoaded', function(){
        let dropdown = document.getElementById('room-type-select-replacement');
        let toggle = dropdown.querySelector('.room-type-select-replacement-toggle');
        let menu = dropdown.querySelector('.select-dropdown');
        let options = menu.querySelectorAll('.option');

        toggle.addEventListener('click', () => {
            dropdown.classList.toggle('active');
        })

        document.getElementById('select-dropdown-arrow').addEventListener('click', () => {
            dropdown.classList.toggle('active');
        })

        options.forEach(option => {
            option.addEventListener('click', () => {
                toggle.textContent = option.textContent;
                document.getElementById('room-type-select-replacement-input').value = option.dataset.value;
                dropdown.classList.remove('active');
            })
        })

        document.addEventListener('click', (event) => {
            if(!dropdown.contains(event.target)){
                dropdown.classList.remove('active');
            }
        })
    })

    document.addEventListener('DOMContentLoaded', function(){
        let guestDropdown = document.getElementById('guest-number-replacement');
        let guestToggle = guestDropdown.querySelector('.guest-number-replacement-toggle');
        let guestMenu = guestDropdown.querySelector('.guest-number-dropdown');
        let guestOptions = guestMenu.querySelectorAll('.option');

        guestToggle.addEventListener('click', () => {
            guestDropdown.classList.toggle('active');
        })

        document.getElementById('guest-number-dropdown-arrow').addEventListener('click', () => {
            guestDropdown.classList.toggle('active');
        })

        guestOptions.forEach(option => {
            option.addEventListener('click', () => {
                guestToggle.textContent = option.textContent;
                console.log(document.getElementById('guest-number-replacement-input').value)
                document.getElementById('guest-number-replacement-input').value = option.dataset.value;
                console.log(document.getElementById('guest-number-replacement-input').value)
                guestDropdown.classList.remove('active');
            })
        })

        document.addEventListener('click', (event) => {
            if(!guestDropdown.contains(event.target)){
                guestDropdown.classList.remove('active');
            }
        })
    })
}

function filterReset(){
    roomsForDisplay(roomData);
    document.getElementById('slider-progress').style.right = '0%';
    document.getElementById('slider-progress').style.left = '0%';
    // -----------------
    document.getElementById('room-type-select-replacement-toggle').textContent = 'Select';
    document.getElementById('room-type-select-replacement-input').value = '';
    // -----------------
    document.getElementById('guest-number-replacement-toggle').textContent = 'Available';
    document.getElementById('guest-number-replacement-input').value = '';
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
        // if (!roomContainer) return;

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


async function otherRoomsForRoomDetails(rooms) {
    try {
        let otherRooms = rooms;
        let threeOthers = [];
        threeOthers = otherRooms.splice(Math.floor(Math.random()*(otherRooms.length - 3)), 3);

        let otherRoomContainer = document.getElementById('other-room-container');

        threeOthers.forEach(room => {
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

            otherRoomContainer.appendChild(roomCard);
            roomCard.appendChild(roomCardImg);
            roomCard.appendChild(bookButtonSlide);


            let bookButton = bookButtonSlide.querySelector('.book-now-link');
            bookButton.addEventListener('click', (event) => {
                event.preventDefault(); 

                localStorage.setItem('selectedRoom', JSON.stringify(room));

                window.location.href = './room-details.html';
            });
        })
    } catch (error) {
        console.error('Other rooms:', error)
    }
}


if(document.getElementById('room-overview-holder')){
    let clickOverview = document.getElementById('overview');
    let clickFacilities = document.getElementById('facilities');
    let clickExtra = document.getElementById('extra');

    let spanForOverview = document.getElementById('span-for-overview');
    let spanForFacilities = document.getElementById('span-for-facilities');
    let spanForExtra = document.getElementById('span-for-extra');

    clickOverview.addEventListener('click', () => {
        clickOverview.classList.add('active');
        clickFacilities.classList.remove('active');
        clickExtra.classList.remove('active');

        spanForOverviewclassList.add('active-Lorem');
        spanForFacilities.classList.remove('active-Lorem');
        spanForExtra.classList.remove('active-Lorem');
    });

    clickFacilities.addEventListener('click', () => {
        clickOverview.classList.remove('active');
        clickFacilities.classList.add('active');
        clickExtra.classList.remove('active');

        spanForOverview.classList.remove('active-Lorem');
        spanForFacilities.classList.add('active-Lorem');
        spanForExtra.classList.remove('active-Lorem');
    });

    clickExtra.addEventListener('click', () => {
        clickOverview.classList.remove('active');
        clickFacilities.classList.remove('active');
        clickExtra.classList.add('active');

        spanForOverview.classList.remove('active-Lorem');
        spanForFacilities.classList.remove('active-Lorem');
        spanForExtra.classList.add('active-Lorem');
    });
}


if(document.getElementById('room-details')){
    let photoGallery = [];
    let updatedIndex = 0;

    document.addEventListener('DOMContentLoaded', () => {
        let roomInfo = JSON.parse(localStorage.getItem('selectedRoom'));
        console.log(roomInfo)

        function sendRoomTypeId(){
            let roomTypeIdForOthers = roomInfo.roomTypeId;
            return roomTypeIdForOthers;
        }

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

        async function checkReservedDays(bookedRoomsdata) {
            try {
                let bookedRoomsDates = bookedRoomsdata;
                
            } catch (error) {
                console.error('Check Reserved Days:', error)
            }
        }

        // --------------------------- calendar days -------------------

        if(document.getElementById('room-form')){
            let reserveCheckIn = flatpickr('#check-in-reservation', {
                minDate: 'today',
                onChange: function(selectedDates){
                    let minReserveCheckoutDate = selectedDates[0] ? selectedDates[0].fp_incr(1) : null;
                    reserveCheckOut.set('minDate', minReserveCheckoutDate)
                }
            })
        
            let reserveCheckOut = flatpickr('#check-out-reservation', {
                minDate: new Date()
            })
        }


        // --------------------------- calendar days end -------------------


        document.getElementById('room-name-price').innerHTML = `
            <h2>${roomInfo.name}: </h2>
            <p><span>${roomInfo.pricePerNight}$</span> per night.</p>
        `;

        document.getElementById('check-in-reservation').addEventListener('input', function(){
            calculateTotalPrice();
        });

        document.getElementById('check-out-reservation').addEventListener('input', function(){
            calculateTotalPrice();
        });

        document.getElementById('customer-name').addEventListener('input', function(){
            validateName();
        });

        document.getElementById('customer-phone').addEventListener('input', function(){
            validatePhone();
        });


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

            let resCheckIn = document.getElementById('check-in-reservation').value;
            let resCheckOut = document.getElementById('check-out-reservation').value;

            if(!resCheckIn || !resCheckOut){
                alert("Please select both check-in and check-out dates.");
                return;
            }

            // console.log(validateCheckIn())
            // console.log(validateCheckOut())
            console.log(validateName())
            console.log(validatePhone())
            console.log(calculateTotalPrice())
            // console.log(takeCheckInTime())
            // console.log(takeCheckOutTime())


            let roomPoster = {
                roomID: roomInfo.id || 0,
                checkInDate: `${resCheckIn}` || null,
                checkOutDate: `${resCheckOut}` || null,
                totalPrice: calculateTotalPrice() || 0,
                isConfirmed: roomInfo.available || null,
                customerName: `${validateName()}` || null,
                customerId: `100` || null,
                customerPhone: validatePhone() || 0
            }

            console.log(roomPoster)

            fetch('https://hotelbooking.stepprojects.ge/api/Booking', {        // <---------------------- booking POST
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(roomPoster)
            })

            .then(response => {
                if(!response.ok){
                    alert("nooooooooooooooo")
                    return
                }
                if (response.ok && response.headers.get('Content-Type').includes('application/json')) {
                    return response.json();  // Parse as JSON
                } else {
                    return response.text();  // If not JSON, return text to inspect the response
                }
            })
            .then(data => {
                if(data){
                    alert('aaaaaaaaaaa')
                }
            })
            .catch(error => console.log('API error', error))
        })

        

    });
}




async function checkOtherRooms(roomData){
    let pickOtherRooms = roomData;
    let getRoomTypeId = sendRoomTypeId();
    let otherRooms;

    pickOtherRooms.forEach(room => {
        // if()
    })
}


// ---------------------------------------------


async function getbookedRooms(hotelData, bookedRoomsdata, roomdata) {
    try {
        let checkRoomData = roomdata;
        let bookingHotels = hotelData;
        let bookingRooms = bookedRoomsdata;

        // console.log(bookingHotels)
        // console.log(bookingRooms)
        // console.log(checkRoomData)

        let reversedBookingRooms = [...bookedRoomsdata].reverse();

        let bookedRoomsContainer = document.getElementById('booked-rooms-container');
        bookedRoomsContainer.innerHTML = '';

        reversedBookingRooms.forEach(roomReserve => {
            let hotelImg;
            let hotelName;
            let hotelTown;
            let roomImg;
            let roomName;
            let roomPricePerNight;

            // console.log(roomReserve)

            if(roomReserve.isConfirmed === true){

                checkRoomData.forEach(getId => {
                    if(roomReserve.roomID === getId.id){
                        bookingHotels.forEach(getHotelId => {
                            if(getId.hotelId === getHotelId.id){
                                hotelImg = getHotelId.featuredImage;
                                hotelName = getHotelId.name;
                                hotelTown = getHotelId.city;
                            }
                        })
    
                        roomImg = getId.images[0].source;
                        roomName = getId.name;
                        roomPricePerNight = getId.pricePerNight;
                    }
                })
                
                // console.log(hotelImg)
                // console.log(hotelName)
                // console.log(hotelTown)
                // console.log(roomImg)
                // console.log(roomName)
                // console.log(roomPricePerNight)

                let fullCheckinTime = new Date(roomReserve.checkInDate);
                let onlyCheckInDate = fullCheckinTime.toISOString().split('T')[0];

                let fullCheckoutTime = new Date(roomReserve.checkOutDate);
                let onlyCheckOutDate = fullCheckoutTime.toISOString().split('T')[0];
    
                let eachBookedRoom = document.createElement('div');
                eachBookedRoom.classList.add('each-booked-room');
                eachBookedRoom.dataset.customerId = `${roomReserve.customerId}`
    
                eachBookedRoom.innerHTML = `
                    <div class="booked-hotel-img">
                        <img src="${hotelImg}" alt="${hotelName}">
                    </div>
                    <div class="booked-hotel-name-and-city">
                        <h2><span>${hotelName}</span></h2>
                        <p><span>${hotelTown}</span></p>
                    </div>
                    <div class="booked-room-img">
                        <img src="${roomImg}" alt="${roomName}">
                    </div>
                    <div class="booked-room-name-and-price">
                        <h2><span>${roomName}</span></h2>
                        <p><span>${roomPricePerNight}$</span></p>
                    </div>
                    <div class="customer-name-and-phone">
                        <h2><span>${roomReserve.customerName}</span></h2>
                        <p><span>${roomReserve.customerPhone}</span></p>
                    </div>
                    <div class="booking-status">
                        <p><span>Booked</span></p>
                    </div>
                    <div class="check-in-date">
                        <p><span>${onlyCheckInDate}</span></p>
                    </div>
                    <div class="check-out-date">
                        <p><span>${onlyCheckOutDate}</span></p>
                    </div>
                    <div class="rooms-total-price">
                        <p><span>${roomReserve.totalPrice}$</span></p>
                    </div>
                    <div class="cencel-button-ontainer">
                        <button class="cencel-booking" data-id="${roomReserve.id}">Cencel</button>
                    </div>
                `

                bookedRoomsContainer.appendChild(eachBookedRoom);
                // console.log(roomReserve.id)
                // console.log(eachBookedRoom)
            }

            // console.log(bookedRoomsContainer)
        });

        document.querySelectorAll('.cencel-booking').forEach(button => {
            button.addEventListener('click', (event) => {
                let tellMe = confirm('Do you really want cencel reservation?')

                if(tellMe){
                    let boolingId = event.target.getAttribute('data-id');
                    deleteReservation(boolingId);
                } else {
                    return
                }
            })
        })

        document.getElementById('check-my-cards-checkbox').addEventListener('toggle', () => {
            document.getElementById('checkbox-heart').style.display = 'block';
            let allreserve = document.querySelectorAll('.each-booked-room');

            allreserve.forEach(booking => {
                let customerId = parseInt(booking.dataset.customerId, 10); 
                booking.style.display = (customerId === 100) ? 'grid' : 'none';
            });
        })
        
        
    } catch (error) {
        console.error('room booking:', error);
    }
}

async function deleteReservation(deleteId) {
    try {
        const response = await fetch(`https://hotelbooking.stepprojects.ge/api/Booking/${deleteId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to delete booking with ID: ${deleteId}`);
        }

        console.log(`Booking with ID ${deleteId} deleted successfully.`);
        document.querySelector(`button[data-id="${deleteId}"]`).closest('.each-booked-room').remove();

    } catch (error) {
        console.error('Delete error:', error);
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





// document.addEventListener('DOMContentLoaded', () => {

//     let today = new Date().toISOString().split('T')[0];

    // if(document.getElementById('check-in') && document.getElementById('check-out')){
    //     let checkInInput = document.getElementById('check-in');
    //     let checkOutInput = document.getElementById('check-out');

    //     checkInInput.setAttribute('min', today);
    //     checkOutInput.setAttribute('min', today);

    //     checkInInput.addEventListener('change', () => {
    //         let checkInDate = new Date(checkInInput.value);
    //         let checkOutDate = new Date(checkOutInput.value);
    
    //         if (checkOutDate <= checkInDate) {
    //             checkOutInput.value = "";
    //             checkOutInput.setAttribute("min", checkInInput.value);
    //         }
    //     });
    
    //     checkOutInput.addEventListener('change', () => {
    //         let checkInDate = new Date(checkInInput.value);
    //         let checkOutDate = new Date(checkOutInput.value);
    
    //         if (checkInDate >= checkOutDate) {
    //             alert("Check-out date must be after check-in date.");
    //             checkOutInput.value = "";
    //         }
    //     });
    // }

//     if(document.getElementById('check-in-reservation') && document.getElementById('check-out-reservation')){

//         let checkInInput = document.getElementById('check-in-reservation');
//         let checkOutInput = document.getElementById('check-out-reservation');

//         checkInInput.setAttribute('min', today);
//         checkOutInput.setAttribute('min', today);

//         checkInInput.addEventListener('change', () => {
//             let checkInDate = new Date(checkInInput.value);
//             let checkOutDate = new Date(checkOutInput.value);
    
//             if (checkOutDate < checkInDate) {
//                 checkOutInput.value = "";
//                 checkOutInput.setAttribute("min", checkInInput.value);
//             }
//         });
    
//         checkOutInput.addEventListener('change', () => {
//             let checkInDate = new Date(checkInInput.value);
//             let checkOutDate = new Date(checkOutInput.value);
    
//             if (checkInDate > checkOutDate) {
//                 alert("Check-out date must be after check-in date.");
//                 checkOutInput.value = "";
//             }
//         });
//     }
    
// })