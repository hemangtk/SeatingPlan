# Classroom Seating Manager

A web-based application designed to help students and administrators manage and locate exam seating arrangements efficiently. This system provides an intuitive interface for viewing classroom seating layouts and quickly finding assigned seats.

## Features

### Core Functionality
- **Multiple Class Support**: Switch between different classes (Class A, B, C) to view different seating arrangements
- **Real-time Search**: Instantly locate students by name with highlighted results
- **Responsive Layout**: Works seamlessly on desktop and mobile devices
- **Dark/Light Mode**: Toggle between dark and light themes for comfortable viewing in any environment

### User Interface
- **Interactive Navigation**: Easy-to-use class selection buttons
- **Visual Seat Layout**: Clear visualization of classroom columns and rows
- **Smooth Scrolling**: Automatically scrolls to searched students with animation
- **Accessibility**: Keyboard navigation and screen reader support

## Technical Details

### API Integration
The application fetches seating data from a Google Apps Script endpoint. The seating arrangement is structured as follows:
```javascript
{
    classrooms: {
        "Class A": {
            "Column Name": [
                seatsPerRow,
                [["Student1@email", "Student2@email"], ...]
            ]
        }
    }
}
```

### Layout Structure
- Each classroom is divided into columns
- Columns contain rows with configurable numbers of seats
- Empty seats are marked as "N/A"
- Student names are displayed without email addresses

## Setup Instructions

1. **Dependencies**
   - No installation required - runs in any modern web browser
   - External fonts loaded from Google Fonts (Inter, Manrope)

2. **Configuration**
   - Update the `API_URL` in `script.js` to point to your data source
   - Customize themes by modifying CSS variables in `style.css`

3. **Deployment**
   - Host the files on any web server
   - Ensure CORS is properly configured for API access

## Usage Guide

1. **Finding a Seat**
   - Use the search box in the top navigation to find a specific student
   - The matching seat will be highlighted and automatically scrolled into view

2. **Switching Classes**
   - Click the class buttons in the navigation to switch between different classroom layouts
   - The current class selection is highlighted in blue

3. **Theme Preferences**
   - Click the sun/moon icon to toggle between light and dark modes
   - Theme preference is saved locally and persists between sessions

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Considerations
- Search functionality is debounced to prevent excessive API calls
- Lazy loading of classroom data
- Optimized scrolling performance
- Responsive images and SVG icons

## Accessibility Features
- ARIA labels for interactive elements
- Keyboard navigation support
- High contrast color options
- Screen reader friendly structure

## Contributing
To contribute to this project:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request with a clear description of changes
