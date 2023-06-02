function flipCard(card) {
    card.classList.toggle('card-flipped');
}
document.getElementById("cursor").classList.add("hidden")
document.getElementById("favourite").classList.add("hidden")
document.getElementById("favouriteSection").classList.add("hidden")
const favouriteCard = document.getElementById("favoriteCards")
const elementsToToggle = document.querySelectorAll(
    '#wordSection, #cardSection, #jokeSection, #cursor '
);



const favoriteCardContent = localStorage.getItem("favoriteCard");
if (favoriteCardContent) {
    // Create a new card element
    const favoriteCard = document.createElement("div");
    favoriteCard.classList.add("card");
    favoriteCard.innerHTML = favoriteCardContent;

    // Add the favorite card to the favoriteCards container
    const favoriteCardsSection = document.getElementById("favoriteCards");
    favoriteCardsSection.appendChild(favoriteCard);
}

function addToFavorites(event) {
    const clickedButton = event.target;
    const clickedCard = clickedButton.closest(".card");
    const favoriteCardsSection = document.getElementById("favoriteCards");

    if (clickedCard) {
        // Create a new card element
        const favoriteCard = document.createElement("div");
        favoriteCard.classList.add("card");
        favoriteCard.innerHTML = clickedCard.innerHTML;

        // Remove any existing favorite card from the favoriteCards container
        favoriteCardsSection.innerHTML = "";

        // Append the new card to the favoriteCards container
        favoriteCardsSection.appendChild(favoriteCard);

        // Store the favorite card HTML content in local storage
        localStorage.setItem("favoriteCard", clickedCard.innerHTML);
    }
}



// Function to toggle the visibility of elements
function toggleElements() {
    elementsToToggle.forEach((element) => {
        element.classList.add('hidden');
    });

    document.getElementById("favouriteSection").classList.remove("hidden");
    document.getElementById("favourite").classList.remove("hidden");

    document.getElementById("favourite").classList.remove("hidden");
    document.getElementById("favoriteCards").classList.remove("hidden");
}


document.getElementById("favoriteCards").classList.add("hidden");

function revertElements() {
    elementsToToggle.forEach((element) => {
        element.classList.remove("hidden");
    });
    document.getElementById("favourite").classList.add("hidden");
    document.getElementById("favoriteCards").classList.add("hidden");

}



let sentence = "";
const sentenceElement = document.getElementById("sentence");
const cursorElement = document.getElementById("cursor");
let currentIndex = 0;
let fetchingJoke = false;
let deletingSentence = false;

function fetchJoke() {
    if (fetchingJoke) return;
    fetchingJoke = true;

    sentence = "";
    document.getElementById("cursor").classList.remove("hidden")

    fetch("https://v2.jokeapi.dev/joke/Miscellaneous,Pun?blacklistFlags=nsfw,religious,racist,sexist,explicit&format=txt&type=single")
        .then(response => response.text())
        .then(joke => {
            sentence = joke;
            if (!deletingSentence && currentIndex === 0) {
                deletingSentence = true;
                deleteSentence();
            }
        })
        .catch(error => {
            console.error("Error fetching joke:", error);
        })
        .finally(() => {
            fetchingJoke = false;
        });
}

function typeSentence() {
    if (sentence) {
        sentenceElement.textContent += sentence[currentIndex];
        currentIndex++;
        if (currentIndex < sentence.length) {
            setTimeout(typeSentence, 50); // Adjust the typing speed (delay) 
        } else {
            setTimeout(deleteSentence, 3000); // Adjust the delay before deleting 
        }
    }
}

function deleteSentence() {
    if (currentIndex > 0) {
        sentenceElement.textContent = sentenceElement.textContent.slice(0, -1);
        currentIndex--;
        setTimeout(deleteSentence, 50); // Adjust the deletion speed (delay) 
    } else {
        if (fetchingJoke) {
            // If a new joke is being fetched, wait for it to complete before restarting the animation
            setTimeout(deleteSentence, 1000);
            return;
        }

        deletingSentence = false; // Reset the flag after deletion is complete
        currentIndex = 0; // Reset currentIndex to repeat the same joke
        setTimeout(() => {
            if (!fetchingJoke) {
                // Start typing the same joke again only if no new joke is being fetched
                typeSentence();
            }
        }, 1000); // Start typing after a delay of 1 second
    }
}