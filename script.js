const loginPage = document.getElementById('loginPage');
const homePage = document.getElementById('homePage');

const searchPage = document.getElementById('searchPage');
const playerPage = document.getElementById('playerPage');


const helpModal = document.getElementById('helpModal');
const confirmationModal = document.getElementById('confirmationModal');
const confirmRemoveBtn = document.getElementById('confirmRemove');
const cancelRemoveBtn = document.getElementById('cancelRemove');

let playerData = null;

let savedPlayers = [];
let pageHistory = [];
let playerToRemove = null;

document.addEventListener('DOMContentLoaded', () => {
   
   
    loadPlayerData();
    const saved = localStorage.getItem('savedPlayers');
    if (saved) savedPlayers = JSON.parse(saved);

    document.querySelector('.close-btn').addEventListener('click', () => {
        document.getElementById('helpModal').classList.remove('show');
    });

    window.addEventListener('click', (event) => {
       
       
        if (event.target === document.getElementById('helpModal')) {
            document.getElementById('helpModal').classList.remove('show');
        }
        if (event.target === confirmationModal) {
            hideConfirmationModal();
        }
    });

    ['searchBar', 'teamFilter', 'positionFilter', 'ageFilter', 'experienceFilter'].forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) input.addEventListener('input', searchPlayers);
    });

    confirmRemoveBtn.addEventListener('click', () => {
      
      
        if (playerToRemove !== null) {
            confirmRemovePlayer();
        }
    });

    cancelRemoveBtn.addEventListener('click', () => {
        hideConfirmationModal();
    });
});

async function loadPlayerData() {
    
    
    try {
     
        const response = await fetch('player-data.json');
        playerData = await response.json();
        displayResults(playerData.players);
    } catch (error) {
        console.error('Error loading player data:', error);
        document.getElementById('searchResults').innerHTML = '<p class="error">Error loading player data</p>';
    }
}

function addToPageHistory(page) {
    if (page !== 'loginPage') {
        pageHistory.push(page);
    }
}

function goBack() {
    if (pageHistory.length > 1) {
        pageHistory.pop();
        const previousPage = pageHistory[pageHistory.length - 1];
        switch (previousPage) {
            case 'searchPage':
                showSearchPage(false);
                break;
            case 'playerPage':
                const lastPlayerId = localStorage.getItem('lastViewedPlayer');
                if (lastPlayerId) {
                    showPlayerDetails(parseInt(lastPlayerId), false);
                }
                break;
        }
    } else {
        showHomePage();
    }
}

function showHelp() {
    helpModal.classList.add('show');
}

function showConfirmationModal() {
   
   
    confirmationModal.classList.remove('hidden');
  
  
    confirmationModal.classList.add('show');
}

function hideConfirmationModal() {
    confirmationModal.classList.remove('show');
    confirmationModal.classList.add('hidden');
    playerToRemove = null;
}

function login() {
   
   
   
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginError = document.getElementById('loginError');

    if (username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password) {
       
        loginPage.classList.add('hidden');
        homePage.classList.remove('hidden');
    
        loginError.textContent = '';
        pageHistory = ['homePage'];
    } else {
        loginError.textContent = 'Invalid credentials';
    }
}

function logout() {
   
    loginPage.classList.remove('hidden');
    homePage.classList.add('hidden');
    searchPage.classList.add('hidden');
   
   
    playerPage.classList.add('hidden');
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('loginError').textContent = '';
    pageHistory = [];
}

function showSearchPage(addToHistory = true) {
   
   
    homePage.classList.add('hidden');
   
    playerPage.classList.add('hidden');
    searchPage.classList.remove('hidden');
    if (addToHistory) addToPageHistory('searchPage');
    if (playerData) displayResults(playerData.players);
}

function showHomePage() {
    searchPage.classList.add('hidden');
    playerPage.classList.add('hidden');
    homePage.classList.remove('hidden');
    pageHistory = ['homePage'];
}

function searchPlayers() {
    if (!playerData) return;
    
    const searchTerm = document.getElementById('searchBar').value.toLowerCase();
    const teamFilter = document.getElementById('teamFilter').value.toLowerCase();
    const positionFilter = document.getElementById('positionFilter').value.toLowerCase();
    const ageFilter = document.getElementById('ageFilter').value;
    const experienceFilter = document.getElementById('experienceFilter').value.toLowerCase();

    const filteredPlayers = playerData.players.filter(player => {
        return player.name.toLowerCase().includes(searchTerm) &&
               (!teamFilter || player.team.toLowerCase().includes(teamFilter)) &&
               (!positionFilter || player.position.toLowerCase() === positionFilter) &&
               (!ageFilter || player.age === parseInt(ageFilter)) &&
               (!experienceFilter || player.experience.toLowerCase().includes(experienceFilter));
    });

    displayResults(filteredPlayers);
}

function displayResults(players, isSavedList = false) {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '';

    players.forEach(player => {
        const playerCard = document.createElement('div');
        playerCard.className = 'player-card';

        const isChecked = savedPlayers.some(saved => saved.id === player.id);

        playerCard.innerHTML = `
            <div class="checkbox-container">
                <input type="checkbox" class="save-checkbox" 
                    ${isChecked ? 'checked' : ''} 
                    onclick="toggleSavePlayer(${player.id}, this)">
            </div>
            <div class="player-info">
                <div class="player-card-header">
                    <div>
                        <h3 onclick="showPlayerDetails(${player.id})" class="player-name">${player.name}</h3>
                        <p>${player.position} ${player.number} - ${player.team}</p>
                    </div>
                    <div>
                        <p>Age: ${player.age}</p>
                        <p>Experience: ${player.experience}</p>
                    </div>
                </div>
            </div>
        `;
        resultsContainer.appendChild(playerCard);
    });
}

function showPlayerDetails(playerId, addToHistory = true) {
    const player = playerData.players.find(p => p.id === playerId);
    if (!player) return;

    
    
    document.getElementById('playerName').textContent = player.name;
    
    
    
    document.getElementById('playerImage').src = player.imageUrl || '/placeholder.jpg';
    document.getElementById('playerNumber').textContent = player.number;
    document.getElementById('playerPosition').textContent = player.position;
    document.getElementById('playerAge').textContent = player.age;
    document.getElementById('playerHeight').textContent = player.height;
    
    document.getElementById('playerExperience').textContent = player.experience;
    document.getElementById('playerTeam').textContent = player.team;
    document.getElementById('playerPassingYards').textContent = player.stats?.passingYards || 'N/A';
    document.getElementById('playerRushingYards').textContent = player.stats?.rushingYards || 'N/A';
    document.getElementById('playerTackles').textContent = player.stats?.tackles || 'N/A';
    document.getElementById('playerAllPurposeYards').textContent = player.stats?.allPurposeYards || 'N/A';

    const historyList = document.getElementById('playerHistory');
    historyList.innerHTML = '';
    if (player.history) {
        player.history.forEach(entry => {
            const li = document.createElement('li');
            li.textContent = entry;
            historyList.appendChild(li);
        });
    }

    const removeBtn = document.getElementById('removePlayerBtn');
    const isSaved = savedPlayers.some(p => p.id === player.id);
    
    
    removeBtn.classList.toggle('hidden', !isSaved);
    removeBtn.onclick = () => removePlayer(player.id);

    searchPage.classList.add('hidden');
    homePage.classList.add('hidden');
   
    playerPage.classList.remove('hidden');

    localStorage.setItem('lastViewedPlayer', playerId);
    if (addToHistory) addToPageHistory('playerPage');
}

function viewSavedPlayers() {
    displayResults(savedPlayers);
}

function toggleSavePlayer(playerId, checkbox) {
    const playerIndex = savedPlayers.findIndex(player => player.id === playerId);
  
  
    const player = playerData.players.find(p => p.id === playerId);

    if (playerIndex === -1 && player) {
        savedPlayers.push(player);
    } else {
        savedPlayers.splice(playerIndex, 1);
    }

    localStorage.setItem('savedPlayers', JSON.stringify(savedPlayers));




    if (!playerPage.classList.contains('hidden')) {
        const removeBtn = document.getElementById('removePlayerBtn');
        removeBtn.classList.toggle('hidden', playerIndex === -1);
    }
}

function removePlayer(playerId) {


    playerToRemove = playerId;
    showConfirmationModal();
}

function confirmRemovePlayer() {
   
    savedPlayers = savedPlayers.filter(player => player.id !== playerToRemove);
    localStorage.setItem('savedPlayers', JSON.stringify(savedPlayers));
    hideConfirmationModal();
    goBack();
}