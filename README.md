# NutritionChatbot

## Overview

NutritionChatbot is an interactive web application that provides detailed nutritional information for a wide variety of foods including fruits, vegetables, and meats. The application features an intelligent search system with fuzzy matching capabilities to help users find nutritional data even when they make spelling errors.

## Features

- **Comprehensive Food Database**: Information on 100+ food items including fruits, vegetables, and various meat products
- **Dynamic Nutritional Calculations**: Automatically adjusts nutritional values based on specified quantity in grams
- **Intelligent Search**: Implements the Levenshtein distance algorithm for fuzzy matching to suggest similar foods when exact matches aren't found
- **Categorized Food Browser**: Easily explore foods by category with their nutritional profiles
- **Responsive Design**: Clean, modern UI that works across different screen sizes
- **User-Friendly Interface**: Simple chat-like interface for natural interaction

## Technologies Used

- **HTML5**: Semantic structure for the application
- **CSS3**: Modern styling with flexbox, gradients, and responsive design
- **JavaScript (ES6+)**: Core application logic and calculations
- **Levenshtein Algorithm**: For intelligent fuzzy matching of food names

## How It Works

1. **Input Processing**: Users enter a food item and quantity (in grams)
2. **Fuzzy Matching**: If the exact food isn't found, the app uses the Levenshtein distance algorithm to suggest similar foods
3. **Proportional Calculation**: Nutritional values are proportionally calculated based on the requested quantity
4. **Formatted Output**: Results are displayed in an easy-to-read format in the chat interface

## Technical Implementation Details

### Levenshtein Distance Algorithm

The application implements the Levenshtein distance algorithm to calculate the similarity between two strings. This allows the app to make intelligent suggestions when users misspell food names. The algorithm calculates the minimum number of single-character operations (insertions, deletions, or substitutions) required to change one word into another.

```javascript
function levenshteinDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = Array(b.length + 1).fill().map(() => Array(a.length + 1).fill(0));

    for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= b.length; j++) {
        for (let i = 1; i <= a.length; i++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[j][i] = Math.min(
                matrix[j][i - 1] + 1,       // deletion
                matrix[j - 1][i] + 1,       // insertion
                matrix[j - 1][i - 1] + cost // substitution
            );
        }
    }

    return matrix[b.length][a.length];
}
```

### Dynamic Nutritional Calculations

The application dynamically calculates nutritional information based on the specified quantity:

```javascript
function formatNutritionInfo(nutritionInfo, quantity, foodName) {
    let output = `Nutrition information for ${quantity}g of ${foodName}:\n\n`;

    for (const key in nutritionInfo) {
        if (nutritionInfo.hasOwnProperty(key)) {
            const value = nutritionInfo[key];
            const parts = value.split(/(\d+\.?\d*)/);
            let numericValue = parseFloat(parts[1]);
            const unit = parts.slice(2).join('').trim();

            if (!isNaN(numericValue)) {
                const calculatedValue = (numericValue / 100) * quantity;
                output += `• ${key.charAt(0).toUpperCase() + key.slice(1)}: ${calculatedValue.toFixed(2)} ${unit}\n`;
            } else {
                output += `• ${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}\n`;
            }
        }
    }

    return output;
}
```

## Installation and Setup

1. Clone the repository:
   ```
   git clone https://github.com/benjamincward/NutritionChatbot.git
   ```

2. Navigate to the project directory:
   ```
   cd NutritionChatbot
   ```

3. Open `index.html` in your browser or set up a local server.

## Usage

1. Enter a food item in the text field (e.g., "apple", "chicken breast", "broccoli")
2. Specify the quantity in grams (default is 100g)
3. Click "Get Nutrition" or press Enter
4. View the detailed nutritional information
5. Use "List of Known Foods" to browse all available foods by category
6. Click "How Many Grams?" for information about quantity calculations

## Future Enhancements

- Add user authentication to save favorite foods
- Implement meal planning functionality
- Add barcode scanning for packaged foods
- Include more detailed nutritional information
- Add data visualization for nutritional components
- Expand the database with more food items


## Author

Benjamin C. Ward

## Acknowledgments

- Food nutrition data compiled from various public health resources
- UI design inspired by modern chat applications