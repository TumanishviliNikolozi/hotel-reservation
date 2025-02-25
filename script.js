fetch('https://hotelbooking.stepprojects.ge/api/Hotels/GetAll')

.then(response => {
    if(!response.ok){
        throw new Error ('response is not ok')
    }
    return response.json()
})

let button = document.getElementById('test-button');
button.addEventListener('click', () => {
    
})
.then(data => {
    const guestroomsBrowse = document.getElementById('guestrooms-browse');

    data.forEach(hotels => {
        let hotelCard = document.createElement('div');
        hotelCard.classList.add('hotel-card');
        let cardBg = hotels.featuredImage;
        hotelCard.style.backgroundImage = cardBg;

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

        
        guestroomsBrowse.appendChild(hotelCard);
        hotelCard.appendChild(hotelCardImg);
        hotelCard.appendChild(bookButtonSlide);
        
    });
})

.catch(error =>{
    console.error("შეცდომა", error)
})