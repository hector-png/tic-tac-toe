function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    //populate board grid with rows & add 0s to all 'column'
    for(let row = 0; row < rows; row++) {
        board[row] = [];
        for(let column = 0; column < columns; column++) {
            board[row].push(cell());
        }
    }

    const getBoard = () => board;

    const addMarker = (playerMarker, row, column) => {
        let choseCell = false;
        if(!board[row][column].getValue()) {
            board[row][column].changeValue(playerMarker);
            choseCell = true;
        }
        return choseCell;
    };
    //for findWinner, i want to try and use the wining indexs to change the button text color to green to show the winning line
    const findWinner = ()  => {
        let winnerFound = false;
        //scan rows
        for(let i = 0; i < 3; i++) {
            let match = getBoard()[i][0].getValue();
            let counter = 0;
        
            for(let x = 1; x < 3; x++) {
                if(getBoard()[i][x].getValue() === match && match != 0) {
                    counter++;
                } else {
                    break;
                }
            }

            if(counter === 2) {
                console.log(`${match} winner`)
                winnerFound = true;
            }
        }

        //scan columns
        for(let i = 0; i < 3; i++) {
            let match = getBoard()[0][i].getValue();
            let counter = 0;

            for(let x = 1; x < 3; x++) {
                if(getBoard()[x][i].getValue() === match && match != 0) {
                    counter++;
                } else {
                    break;
                }
            }

            if(counter === 2) {
                console.log(`${match} winner`)
                winnerFound = true;
            }
        }

        //criss cross
        for(let i = 0; i < 1; i++) {
            let match = getBoard()[i][0].getValue();
            let counter = 0;

            for(let x = 1; x < 3; x++) {
                if(getBoard()[x][x].getValue() === match && match != 0) {
                    counter++;
                } else {
                    break;
                }
            }

            if(counter === 2) {
                console.log(`${match} winner`)
                winnerFound = true;
            }
        }

        for(let i = 0; i < 1; i++) {
            let match = getBoard()[i][2].getValue();
            let counter = 0;

            for(let x = 1; x < 3; x++) {
                if(getBoard()[x][x].getValue() === match && match != 0 && x != 2) {
                    counter++;
                } else if(getBoard()[x][0].getValue() === match && match != 0) {
                    counter++;
                } else {
                    break;
                }
            }

            if(counter === 2) {
                console.log(`${match} winner`)
                winnerFound = true;
            }
        }

        return winnerFound;
    };

    //For console use 
    const printBoard = () => {
        const boardWithValues = board.map(row => row.map(cell => cell.getValue()));
        boardWithValues.map(row => console.log(row))
    };

    return {getBoard, addMarker, findWinner, printBoard};
}

function cell() {
    let value = 0;

    const changeValue = (player) => {
        value = player;
    }

    const getValue = () => value;

    return {changeValue, getValue}
}

function GameController(player1 = 'player1', player2 = 'player2') {
    const board = Gameboard();

    const players = [{
        name: player1,
        marker: 'X',
    }, {
        name: player2,
        marker: 'O',
    }];

    const getPlayers = () => players;

    let currentPlayer = players[0];

    const getCurrentPlayer = () => currentPlayer;

    const switchPlayer = () => {
        currentPlayer === players[0] ? currentPlayer = players[1]: currentPlayer = players[0];
    };

    const printNewRound = () => {
        board.printBoard(); 
    };

    const playRound = (row, column) => {
        // console.log(getCurrentPlayer())
        if(board.addMarker(currentPlayer.marker, row, column)) {
            if(board.findWinner()) {
                return true;
            } else {
                switchPlayer(currentPlayer);
            }
        }
        //allows us to play in console by showing us game status
        // printNewRound();
    };

    //Understand what is happening here with baord object
    return {getPlayers, playRound, getCurrentPlayer, getBoard: board.getBoard};
}

function ScreenController() {
    const game = GameController();
    const board = game.getBoard();

    const gameContainer = document.querySelector('.game-container');
    const restartButton = document.querySelector('.restart');
    const winnerMessage = document.querySelector('.game-result');

    // const startGame = () => {}

    const restartGame = () => {
        board.forEach(row => 
            row.forEach(cell =>
            cell.changeValue(0)));
            winnerMessage.classList.toggle('hide');
            updateScreen();
            gameContainer.addEventListener('click', addPlayerMarker);
    }

    const displayWinner = () => {
        //missing logic for a tie
        updateScreen();
        winnerMessage.innerText = `${game.getCurrentPlayer().name} wins!`;
        winnerMessage.classList.toggle('hide');
        gameContainer.removeEventListener('click', addPlayerMarker);
    }

    const updateScreen = () => {
        const playerOne = document.querySelector('.one');
        const playerTwo = document.querySelector('.two');

        //Using game methods
        const activePlayer = game.getCurrentPlayer();

        if(activePlayer.marker === 'X') {
            playerOne.classList.toggle('active');
            if(playerTwo.classList.value.includes('active')) playerTwo.classList.toggle('active');
        } else if(activePlayer.marker === 'O') {
            playerTwo.classList.toggle('active');
            if(playerOne.classList.value.includes('active')) playerOne.classList.toggle('active');
        }

        //every execution remove previous render before adding new one
        gameContainer.textContent = '';

        board.forEach( (row, rowIndex) => {
            row.forEach((cell, columnIndex)=> {
                const button = document.createElement('button');

                button.dataset.row = rowIndex;
                button.dataset.column = columnIndex;
                button.classList.add('cell')
                button.innerText = cell.getValue() === 0 ? '': cell.getValue();
                gameContainer.appendChild(button)
            });
        });
    };

    const addPlayerMarker = (e) => {
        const row = e.target.dataset.row;
        const column = e.target.dataset.column;

        if(game.playRound(row, column)) {
            displayWinner();
        } 
        updateScreen();
    }
    restartButton.addEventListener('click', restartGame);
    gameContainer.addEventListener('click', addPlayerMarker);
    updateScreen();
}

const init = (ScreenController)();