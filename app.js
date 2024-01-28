let accessToken = null;

async function getAccessToken(apiKey, apiSecret) {
    try {
        const tokenUrl = 'https://api.petfinder.com/v2/oauth2/token';
        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `grant_type=client_credentials&client_id=${apiKey}&client_secret=${apiSecret}`,
        });

        const tokenData = await response.json();

        if (response.ok) {
            accessToken = tokenData.access_token;
        } else {
            console.error('Access token request failed:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error getting access token:', error);
    }
}


async function searchCats() {
    const location = encodeURIComponent(document.getElementById('location').value);
    const apiKey = '5piiqD6iAp4kiJU3poLD5EqJ1LrZzD3mKw1AyFq6';
    const apiSecret = 'V7B0Ayv0D0da6XoqqvwafQLA3kN9aBX9TWF1exN9LiP5MTQmZo';
    document.getElementById('searchForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const location = document.getElementById('location').value;
        searchCats(location);
    });

    async function searchCats(location) {
        try {
            const response = await fetch(`/search?location=${location}`);
            const data = await response.json();
            displayResults(data.animals);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    if (!accessToken) {
        await getAccessToken(apiKey, apiSecret);
    }

    try {
        const apiUrl = `https://api.petfinder.com/v2/animals?type=cat&location=${location}`;
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            updateResults(data.animals);
        } else {
            console.error('Request failed:', response.status, response.statusText);

            if (response.status === 401) {
                console.log('Attempting to refresh the access token...');
                accessToken = null;
                await getAccessToken(apiKey, apiSecret);
                await searchCats();
            }
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


function updateResults(animals) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    animals.forEach(cat => {
        const catCard = document.createElement('div');
        catCard.className = 'cat-card';
        catCard.innerHTML = `
            <h3>${cat.name}</h3>
            <p>Breed: ${cat.breeds.primary}</p>
            <p>Age: ${cat.age}</p>
            <img src="${cat.photos.length > 0 ? cat.photos[0].small : 'placeholder.jpg'}" alt="${cat.name}">
        `;

        resultsContainer.appendChild(catCard);
    });
}
