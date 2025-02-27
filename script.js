const request = fetch('https://hotelbooking.stepprojects.ge/api/Hotels/GetAll')

.then(response => {
    if(!response.ok){
        throw new Error ('response is not ok')
    }
    return response.json()
})

// ----------------\/\/\/\/\/ this is for test \/\/\/\/\/----------------
request.then(data => {
    const guestFavoriteRooms = document.getElementById('guest-favorite-rooms');

    data.forEach(hotels => {
        let hotelCard = document.createElement('div');
        hotelCard.classList.add('hotel-card');

        let hotelCardImg = document.createElement('div');
        hotelCardImg.classList.add('hotel-card-img');
        hotelCardImg.innerHTML = `
        <img src="${hotels.featuredImage}" alt="${hotels.name}">`
        


        let bookButtonSlide = document.createElement('div');
        bookButtonSlide.classList.add('book-button-slide');

        bookButtonSlide.innerHTML = `
        <h2><span>${hotels.name} </span></h2>
        <a class="view-rooms-link" href="">${"View Rooms"}</a>
        `


        guestFavoriteRooms.appendChild(hotelCard);
        hotelCard.appendChild(hotelCardImg);
        hotelCard.appendChild(bookButtonSlide);
        return data;
    });
})
// ----------------/\/\/\/\/\ this is for test /\/\/\/\/\---------------



request.then(data => {
    const hotelContainer = document.getElementById('hotel-container');

    data.forEach(hotels => {
        let hotelCard = document.createElement('div');
        hotelCard.classList.add('hotel-card');

        let hotelCardImg = document.createElement('div');
        hotelCardImg.classList.add('hotel-card-img');
        hotelCardImg.innerHTML = `
        <img src="${hotels.featuredImage}" alt="${hotels.name}">`
        
        let bookButtonSlide = document.createElement('div');
        bookButtonSlide.classList.add('book-button-slide');

        bookButtonSlide.innerHTML = `
        <h2><span>${hotels.name} </span></h2>
        <a class="view-rooms-link" href="">${"View Rooms"}</a>
        `


        hotelContainer.appendChild(hotelCard);
        hotelCard.appendChild(hotelCardImg);
        hotelCard.appendChild(bookButtonSlide);
        
    });
})

.catch(error =>{
    console.error("შეცდომა", error)
})