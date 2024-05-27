let allGiftIdeas = [];
let currentGiftIndex = 0;
window.onload = function() {
    allGiftIdeas = [];
    
    // Get the generate button element
    const generateButton = document.getElementById('generateButton');

    // Attach an event listener to the generate button
    generateButton.addEventListener('click', function() {
        // Call generateGiftIdea() when the button is clicked
        generateGiftIdea();
    });
};


function generateGiftIdea() {
    const form = document.getElementById('giftForm');
    const formData = new FormData(form);

    const data = {
        age: formData.get('age'),
        gender: formData.get('gender'),
        occasion: formData.get('occasion'),
        recipient_type: formData.get('recipient_type'),
        price_range: formData.get('price_range'),
        categories: []
    };

    // Get all selected categories
    form.querySelectorAll('input[name="categories"]:checked').forEach(checkbox => {
        data.categories.push(checkbox.value);
    });

    fetch('/generate_gift_idea', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('Error generating gift ideas:', data.error);
        } else {
            allGiftIdeas = data.gift_ideas;
            currentGiftIndex = 0;
            displayGifts(currentGiftIndex);
            showGenerateButton();
        }
    })
    .catch(error => console.error('Error:', error));
}

function searchGiftIdea() {
    const searchInput = document.getElementById('searchInput').value;

    fetch('/search_gift_idea', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: searchInput })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('Error searching gift ideas:', data.error);
        } else {
            allGiftIdeas = data.gift_ideas;
            currentGiftIndex = 0;
            displayGifts(currentGiftIndex);
            showGenerateButton();
        }
    })
    .catch(error => console.error('Error:', error));
}

function generateMoreGiftIdeas() {
    const searchInput = document.getElementById('searchInput').value.trim();
    const formData = new FormData(document.getElementById('giftForm'));
    const data = {
        age: formData.get('age'),
        gender: formData.get('gender'),
        occasion: formData.get('occasion'),
        recipient_type: formData.get('recipient_type'),
        price_range: formData.get('price_range'),
        categories: []
    };

    // Get all selected categories
    document.querySelectorAll('input[name="categories"]:checked').forEach(checkbox => {
        data.categories.push(checkbox.value);
    });

    let url = '/generate_gift_idea';
    if (searchInput) {
        data.prompt = searchInput;
        url = '/search_gift_idea';
    }

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('Error generating more gift ideas:', data.error);
        } else {
            if (allGiftIdeas.length === 0) {
                allGiftIdeas = data.gift_ideas;
            } else {
                allGiftIdeas = allGiftIdeas.concat(data.gift_ideas);
            }
            displayGifts(currentGiftIndex);
        }
    })
    .catch(error => console.error('Error generating more gift ideas:', error));
}

function displayGifts(startIndex) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    const giftIdeas = allGiftIdeas.slice(startIndex, startIndex + 3);
    giftIdeas.forEach(idea => {
        const productDiv = document.createElement('div');
        productDiv.innerHTML = `<p><strong>Product:</strong> ${idea.Product_name}</p>
                                <p><strong>Reason:</strong> ${idea.Reason}</p>`;
        resultsDiv.appendChild(productDiv);
    });

    if (allGiftIdeas.length > startIndex + 3) {
        showNextButton();
    } else {
        hideNextButton();
    }

    if (startIndex > 0) {
        showPrevButton();
    } else {
        hidePrevButton();
    }

    if (allGiftIdeas.length === currentGiftIndex + 6) {
        hideGenerateButton();
    } else {
        showGenerateButton();
    }
}

function prevGiftIdeas() {
    if (currentGiftIndex >= 3) {
        currentGiftIndex -= 3;
        displayGifts(currentGiftIndex);
    }
}

function nextGiftIdeas() {
    if (currentGiftIndex + 3 < allGiftIdeas.length) {
        currentGiftIndex += 3;
        displayGifts(currentGiftIndex);
    }
}

function showGenerateButton() {
    document.getElementById('generateMoreButton').style.display = 'block';
}

function hideGenerateButton() {
    document.getElementById('generateMoreButton').style.display = 'none';
}

function showNextButton() {
    document.getElementById('nextButton').style.display = 'block';
}

function hideNextButton() {
    document.getElementById('nextButton').style.display = 'none';
}

function showPrevButton() {
    document.getElementById('prevButton').style.display = 'block';
}

function hidePrevButton() {
    document.getElementById('prevButton').style.display = 'none';
}