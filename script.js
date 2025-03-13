const API_URL = 'https://script.google.com/macros/s/AKfycbysBJjOXPKskREfzIJThE6yZKgSSx57YEM9w0Om5vlFPLxkUio_QTs0yn5M11vTrxTXew/exec';
let seatingData = null;
let currentClass = 'Class A';

// Fetch data from API
async function fetchSeatingData() {
    try {
        const response = await fetch(API_URL);
        seatingData = await response.json();
        renderClassroom(currentClass);
    } catch (error) {
        console.error('Error fetching data:', error);
        document.querySelector('.classroom').innerHTML = 'Error loading seating arrangement. Please try again later.';
    }
}

// Render classroom layout
function renderClassroom(className) {
    const classroom = document.querySelector('.classroom');
    classroom.innerHTML = '';

    if(seatingData && !seatingData.classrooms[className]){
        classroom.innerHTML = "<h3>No seating avaliable in this classroom.</h3>"
    }

    if (!seatingData?.classrooms?.[className]) return;

    const columns = seatingData.classrooms[className];
    Object.entries(columns).forEach(([columnName, columnData]) => {
        const columnDiv = document.createElement('div');
        columnDiv.className = 'column';
        columnDiv.innerHTML = `<h3>${columnName}</h3>`;

        const [seatsPerRow, seatings] = columnData;
        seatings.forEach((rowData, rowIndex) => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'seat-row';

            // Add row number
            const rowNumber = document.createElement('div');
            rowNumber.className = 'row-number';
            rowNumber.textContent = (rowIndex + 1).toString();
            rowDiv.appendChild(rowNumber);

            // Create container for seats
            const seatsContainer = document.createElement('div');
            seatsContainer.className = 'seats-container';
            seatsContainer.style.gridTemplateColumns = `repeat(${seatsPerRow}, 1fr)`;

            // Process each seat in the row
            rowData.forEach(seat => {
                const seatDiv = document.createElement('div');
                seatDiv.className = 'seat';
                if (seat === 'N/A') {
                    seatDiv.textContent = '';
                } else if (seat) {
                    seatDiv.textContent = seat.split('@')[0];
                } else {
                    seatDiv.textContent = '';
                }
                seatsContainer.appendChild(seatDiv);
            });

            rowDiv.appendChild(seatsContainer);
            columnDiv.appendChild(rowDiv);
        });

        classroom.appendChild(columnDiv);
    });
}

// Enhanced search functionality with smooth scroll
function searchSeats(searchTerm) {
    const seats = document.querySelectorAll('.seat');
    let firstMatch = null;
    
    seats.forEach(seat => {
        seat.classList.remove('highlight');
        if (searchTerm && seat.textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
            seat.classList.add('highlight');
            if (!firstMatch) {
                firstMatch = seat;
            }
        }
    });

    // If a match is found, scroll to it
    if (firstMatch) {
        // First scroll the column into view
        const columnDiv = firstMatch.closest('.column');
        const classroom = document.querySelector('.classroom');
        
        const scrollOptions = {
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
        };

        // Add a brief delay to make the highlight more noticeable
        setTimeout(() => {
            firstMatch.scrollIntoView(scrollOptions);
            
            // Add a pulse animation to make it more noticeable
            firstMatch.style.animation = 'none';
            firstMatch.offsetHeight; // Trigger reflow
            firstMatch.style.animation = 'pulse 1s';
        }, 100);
    }
}

function initializeTheme() {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (systemPrefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}
document.querySelector('.theme-toggle').addEventListener('click', toggleTheme);
initializeTheme();


// Add pulse animation to stylesheet
const style = document.createElement('style');
style.textContent = `
@keyframes pulse {
    0% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4);
    }
    50% {
        transform: scale(1.05);
        box-shadow: 0 0 0 10px rgba(37, 99, 235, 0);
    }
    100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(37, 99, 235, 0);
    }
}
`;
document.head.appendChild(style);

// Debounce function to improve search performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Event Listeners
document.querySelector('.class-selector').addEventListener('click', (e) => {
    if (e.target.classList.contains('class-btn')) {
        document.querySelectorAll('.class-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        currentClass = e.target.dataset.class;
        renderClassroom(currentClass);
    }
});

// Add debounced search
const debouncedSearch = debounce((e) => {
    searchSeats(e.target.value);
}, 300);

document.querySelector('.search-box').addEventListener('input', debouncedSearch);

// Initial load
fetchSeatingData();
