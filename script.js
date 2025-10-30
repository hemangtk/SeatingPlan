// 🔹 Dummy seating data (hardcoded instead of API fetch)
let seatingData = {
    classrooms: {
        "Class A": {
            "Column 1": [
                3,
                [
                    ["student1@email.com", "student2@email.com", "student3@email.com"],
                    ["student4@email.com", "student5@email.com", "student6@email.com"],
                    ["student7@email.com", "student8@email.com", "student9@email.com"]
                ]
            ],
            "Column 2": [
                2,
                [
                    ["student10@email.com", "student11@email.com"],
                    ["student12@email.com", "N/A"],
                    ["student13@email.com", "student14@email.com"]
                ]
            ]
        },
        "Class B": {
            "Left Section": [
                4,
                [
                    ["alice@email.com", "bob@email.com", "N/A", "carol@email.com"],
                    ["david@email.com", "N/A", "eve@email.com", "frank@email.com"]
                ]
            ],
            "Right Section": [
                3,
                [
                    ["george@email.com", "harry@email.com", "ian@email.com"],
                    ["jack@email.com", "karen@email.com", "lisa@email.com"]
                ]
            ]
        },
        "Class C": {
            "Main Block": [
                2,
                [
                    ["studentA@email.com", "studentB@email.com"],
                    ["studentC@email.com", "studentD@email.com"]
                ]
            ]
        }
    }
};

let currentClass = 'Class A';

// Render classroom layout
function renderClassroom(className) {
    const classroom = document.querySelector('.classroom');
    classroom.innerHTML = '';

    if (seatingData && !seatingData.classrooms[className]) {
        classroom.innerHTML = "<h3>No seating available in this classroom.</h3>";
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

// Enhanced search functionality
function searchSeats(searchTerm) {
    const seats = document.querySelectorAll('.seat');
    let firstMatch = null;

    seats.forEach(seat => {
        seat.classList.remove('highlight');
        if (searchTerm && seat.textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
            seat.classList.add('highlight');
            if (!firstMatch) firstMatch = seat;
        }
    });

    if (firstMatch) {
        const scrollOptions = { behavior: 'smooth', block: 'center', inline: 'center' };
        setTimeout(() => {
            firstMatch.scrollIntoView(scrollOptions);
            firstMatch.style.animation = 'none';
            firstMatch.offsetHeight;
            firstMatch.style.animation = 'pulse 1s';
        }, 100);
    }
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
    else if (systemPrefersDark) document.documentElement.setAttribute('data-theme', 'dark');
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

document.querySelector('.theme-toggle').addEventListener('click', toggleTheme);
initializeTheme();

const style = document.createElement('style');
style.textContent = `
@keyframes pulse {
    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4); }
    50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(37, 99, 235, 0); }
    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
}`;
document.head.appendChild(style);

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// Class button click
document.querySelector('.class-selector').addEventListener('click', (e) => {
    if (e.target.classList.contains('class-btn')) {
        document.querySelectorAll('.class-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        currentClass = e.target.dataset.class;
        renderClassroom(currentClass);
    }
});

// Debounced search
const debouncedSearch = debounce((e) => {
    searchSeats(e.target.value);
}, 300);

document.querySelector('.search-box').addEventListener('input', debouncedSearch);

// Initial load
renderClassroom(currentClass);
