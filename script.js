// Main app initialization
document.addEventListener('DOMContentLoaded', () => {
    initNutritionApp();
});

// Initialize the application
function initNutritionApp() {
    // DOM elements
    const chatContainer = document.getElementById('chat-container');
    const foodInput = document.getElementById('food-input');
    const quantityInput = document.getElementById('quantity-input');
    const getNutritionButton = document.getElementById('get-nutrition');
    const errorMessage = document.getElementById('error-message');
    const listFoodsButton = document.getElementById('list-foods');
    const howManyGramsButton = document.getElementById('how-many-grams');

    // Show welcome message
    addBotMessage("Welcome! Ask me about the nutritional value of fruits, vegetables, and meats.");

    // Set up event listeners
    getNutritionButton.addEventListener('click', handleNutritionRequest);
    foodInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleNutritionRequest(); });
    quantityInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleNutritionRequest(); });
    listFoodsButton.addEventListener('click', displayFoodList);
    howManyGramsButton.addEventListener('click', showGramsInfo);

    // Handle nutrition request from user
    function handleNutritionRequest() {
        const foodName = foodInput.value.trim().toLowerCase();
        const quantity = quantityInput.value.trim();

        // Validate inputs
        if (!validateInputs(foodName, quantity)) return;

        // Process the request
        const quantityNum = Number(quantity);
        addBotMessage(`Looking for nutrition information for ${foodName}...`);

        // Short delay to simulate processing
        setTimeout(() => {
            const response = getNutritionInformation(foodName, quantityNum);

            if (response.startsWith('Sorry')) {
                addBotMessage(response, true);
            } else {
                addBotMessage(response);
            }

            // Clear inputs
            foodInput.value = '';
            quantityInput.value = '100';
        }, 500);
    }

    // Add a bot message to the chat
    function addBotMessage(message, isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `bot-message ${isError ? 'error-message' : ''}`;

        // If message contains HTML, use innerHTML, otherwise textContent
        if (message.includes('<div class="category-heading">')) {
            messageDiv.innerHTML = message;
        } else {
            messageDiv.textContent = message;
        }

        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Validate user inputs
    function validateInputs(foodName, quantity) {
        errorMessage.textContent = '';

        if (!foodName) {
            errorMessage.textContent = 'Please enter a food item.';
            return false;
        }

        if (!quantity) {
            errorMessage.textContent = 'Please enter a quantity.';
            return false;
        }

        const quantityNum = Number(quantity);
        if (isNaN(quantityNum) || quantityNum <= 0) {
            errorMessage.textContent = 'Please enter a valid positive number for quantity.';
            return false;
        }

        return true;
    }

    // Get nutrition information for a food item
    function getNutritionInformation(foodName, quantity) {
        if (nutritionData[foodName]) {
            const nutritionInfo = nutritionData[foodName];
            return formatNutritionInfo(nutritionInfo, quantity, foodName);
        } else {
            const closestMatch = findClosestMatch(foodName);
            if (closestMatch) {
                return `Sorry, I don't have the exact information for "${foodName}". Did you mean "${closestMatch}"?`;
            }
            return "Sorry, I don't have nutrition information for that item.";
        }
    }

    // Format nutrition information for display
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

    // Find closest matching food item
    function findClosestMatch(foodName) {
        const foodNames = Object.keys(nutritionData);
        let closestMatch = '';
        let minDistance = Infinity;

        for (const name of foodNames) {
            const distance = levenshteinDistance(foodName, name);
            if (distance < minDistance) {
                minDistance = distance;
                closestMatch = name;
            }
        }

        return minDistance <= 3 ? closestMatch : null;
    }

    // Calculate Levenshtein distance between two strings
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

    // Display list of known foods
    function displayFoodList() {
        // Categorize foods
        const categories = {
            "Fruits": [],
            "Vegetables": [],
            "Meats": []
        };

        // Food category definitions
        const fruits = ['apple', 'banana', 'orange', 'strawberry', 'blueberry', 'grape', 'watermelon',
            'mango', 'pineapple', 'kiwi', 'peach', 'pear', 'cherry', 'raspberry', 'avocado',
            'lemon', 'lime', 'plum', 'cranberry', 'grapefruit', 'cantaloupe', 'honeydew melon'];

        const vegetables = ['broccoli', 'carrot', 'spinach', 'kale', 'lettuce', 'tomato', 'potato',
            'sweet potato', 'onion', 'garlic', 'ginger', 'cucumber', 'bell pepper',
            'zucchini', 'eggplant', 'cabbage', 'cauliflower', 'asparagus'];

        const meats = ['beef', 'chicken', 'pork', 'turkey', 'lamb', 'salmon', 'tuna', 'shrimp', 'cod',
            'egg', 'tofu', 'steak', 'bacon', 'ham', 'sausage', 'veal', 'venison', 'duck'];

        // Categorize all foods
        for (const food in nutritionData) {
            if (fruits.includes(food)) {
                categories["Fruits"].push(food);
            } else if (vegetables.includes(food)) {
                categories["Vegetables"].push(food);
            } else if (meats.includes(food) || food.includes('steak') || food.includes('beef') ||
                food.includes('chicken') || food.includes('pork') || food.includes('turkey') ||
                food.includes('fish') || food.includes('salmon') || food.includes('tuna')) {
                categories["Meats"].push(food);
            }
        }

        // Build HTML output
        let html = "";

        for (const category in categories) {
            if (categories[category].length > 0) {
                html += `<div class="category-heading">${category}</div>`;

                // Sort items alphabetically
                categories[category].sort().forEach(food => {
                    const foodData = nutritionData[food];
                    let foodInfo = `<div class="food-item">${capitalizeFirstLetter(food)} - (`;

                    // Add nutrition facts
                    const facts = [];
                    for (const key in foodData) {
                        facts.push(`${key}: ${foodData[key]}`);
                    }

                    foodInfo += facts.join(', ');
                    foodInfo += ')</div>';
                    html += foodInfo;
                });
            }
        }

        addBotMessage(html);
    }

    // Show information about gram calculations
    function showGramsInfo() {
        addBotMessage("The nutrition information is based on 100 grams of the food item. For other quantities, the values are adjusted proportionally. For example, if you enter 150 grams, the displayed values will be 1.5 times the values listed in the database for 100 grams.");
    }

    // Helper function to capitalize first letter
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}