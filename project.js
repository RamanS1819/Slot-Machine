// What we have done in the whole code
// 1. Deposit some money
// 2. Determine the number of lines to bet on
// 3. Collect a bet amount
// 4. Spin the slot machine
// 5. Check if the user won
// 6. Give the user their winnings
// 7. Check if the user has any money left
// 8. If they do, ask if they want to play again
// 9. If they don't, end the game
// 10. If they want to play again, go back to step 2

const prompt = require('prompt-sync')();


const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    "A": 2,
    "B": 4,
    "C": 6,
    "D": 8,
}

const SYMBOL_VALUES = {
    "A": 5,
    "B": 4,
    "C": 3,
    "D": 2,
}


const deposit = () => {
    while (true) {
        const depositAmount = prompt("Enter the deposit amount: ");
        const numberDepositAmount = parseFloat(depositAmount);

        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log("Invalid deposit amount. Please enter a valid amount.");
        } else {
            return numberDepositAmount;
        }
    }   
};

const getNumberOfLines = () => {
    while (true) {
        const lines = prompt("Enter the the number of lines to bet on (1-3): ");
        const numberOfLines = parseFloat(lines);

        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
            console.log("Invalid number of lines. Try again.");
        } else {
            return numberOfLines;
        }
    }
};

const getBet = (balance, lines) => {
    while (true) {
        const bet = prompt("Enter the bet amount per line: ");
        const betAmount = parseFloat(bet);

        if (isNaN(betAmount) || betAmount <= 0 || betAmount > (balance / lines)) {
            console.log("Invalid bet amount. Try again.");
        } else {
            return betAmount;
        }
    }
};

const spin = () => {
    const symbols = [];

    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
};

const transpose = (reels) => {
    const transposedReels = [];

    for (let i = 0; i < ROWS; i++) {
        transposedReels.push([]);
        for (let j = 0; j < COLS; j++) {
            transposedReels[i].push(reels[j][i]);
        }
    }
    return transposedReels;
};

const printRows = (transposedReels) => {
    for (const row of transposedReels) {
        let rowString = "";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol;
            if (i < row.length - 1) {
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
};

const getWinnings = (transposedReels, bet, lines) => {
    let winnings = 0;

    for ( let row = 0; row < lines; row++) {
        const symbols = transposedReels[row];
        let allSame = true;

        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }

        if (allSame) {
            winnings += bet * SYMBOL_VALUES[symbols[0]];
        }
    }
    return winnings;
};


const game = () => {
    let balance = deposit();

    while (true) {
        console.log(`Your balance is $${balance}.`);
        const numberOfLines = getNumberOfLines();
        const bet = getBet(balance, numberOfLines);
        balance -= bet * numberOfLines;
        const reels = spin();
        const transposedReels = transpose(reels);
        printRows(transposedReels);
        const winnings = getWinnings(transposedReels, bet, numberOfLines);
        balance += winnings;
        console.log(`You won $${winnings}.`);

        if (balance <= 0) {
            console.log("You have no money left. Game over.");
            break;
        }

        const playAgain = prompt("Do you want to play again? (yes/no): ");

        if (playAgain.toLowerCase() !== "yes") {
            console.log("Thank you for playing. Goodbye!");
            break;
        }
        else {
            console.log("Let's play again!");
        }
    }
    
};

game();


