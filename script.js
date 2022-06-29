const displayController = (() => {
    
    //Generates the squares on page load.
    const generateBoard = () => {
        const gameboard = document.getElementById('gameboard');
        for(let i = 0; i < 9; i++){
            const square = document.createElement('div');
            square.classList.add('gameboard-square');
            square.setAttribute("data-square", i)
            square.setAttribute("onclick", "clicks()")
            gameboard.appendChild(square);
        }
    }

    //Highlights winning squares.
    const highlightSquare = (winningSquares) => {
        const square1 = document.querySelector(`[data-square="${winningSquares[0]}"]`);
        const square2 = document.querySelector(`[data-square="${winningSquares[1]}"]`);
        const square3 = document.querySelector(`[data-square="${winningSquares[2]}"]`);
        const squares = [square1, square2, square3];
        squares.forEach(square => {
            square.style="background-color:green;color:white;"
        });
    }


    /**
     * POST GAME FUNCTIONS
     */

    //Opens a modal that says either winner or draw
    const openModal = (isWin) => {
        const modal = document.getElementById('modal-container');
        const modalTitle = document.getElementById('modal-title');
        const overlay = document.getElementById('overlay');

        modal.classList.add('active')
        overlay.classList.add('active')

        if(isWin){
            modalTitle.textContent = "Winner"
        } else {
            modalTitle.textContent = "Draw"
        }
        
        const playAgainButton = document.getElementById('play-again');
        playAgainButton.addEventListener("click", playAgain);
    }
    
    //Helper function to close the modal. Used by playAgain()
    const closeModal = () => {
        const modal = document.getElementById('modal-container');
        const overlay = document.getElementById('overlay');

        modal.classList.remove('active')
        overlay.classList.remove('active')
    }

    //When Play Again button is clicked, reset gameboard array, numOfClicks, reset gameboard screen, and close the modal.
    const playAgain = () => {
        gameBoard.resetGameboard();
        resetScreen();
        closeModal();
    }
    
    //Helper function to reset the screen. Used by playAgain()
    const resetScreen = () => {
        const gameBoardContainer = document.getElementById('gameboard');
        let squares = gameBoardContainer.getElementsByTagName('div');
        for (let i = 0; i < squares.length; i++) {
            squares[i].textContent = '';
            squares[i].style.backgroundColor = "lightgray";
            squares[i].style.color = "black";
          }
    }
    return {
        generateBoard,
        highlightSquare,
        openModal,
    }
})();

const gameBoard = (() => {
    let gameBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    let numOfClicks = 0;

    //Every time a legal square is clicked, add it to gameBoard array.
    const addToGameBoardArray = (position, letter) => {
        gameBoard[position] = letter;
    }

    //Runs after every square click to determine if someone has won, or if there is a draw
    const winCheck = () => {
        //Horizontal Sets
        console.log(gameBoard)
        hset1 = new Set([gameBoard[0], gameBoard[1], gameBoard[2]]);
        hset2 = new Set([gameBoard[3], gameBoard[4], gameBoard[5]]);
        hset3 = new Set([gameBoard[6], gameBoard[7], gameBoard[8]]);
        //Vertical Sets
        vset1 = new Set([gameBoard[0], gameBoard[3], gameBoard[6]]);
        vset2 = new Set([gameBoard[1], gameBoard[4], gameBoard[7]]);
        vset3 = new Set([gameBoard[2], gameBoard[5], gameBoard[8]]);
        //Left-To-Right Diagonal Set
        lrset = new Set([gameBoard[0], gameBoard[4], gameBoard[8]]);
        //Right-To-Left Diagonal Set
        rlset = new Set([gameBoard[2], gameBoard[4], gameBoard[6]]);
        
        if(hset1.size === 1 || hset2.size === 1 || hset3.size === 1){
            console.log("winner horizontal");
            return checkWhichSet(hset1, hset2, hset3, [0, 1, 2], [3, 4, 5], [6, 7, 8]);
        } else if(vset1.size === 1 || vset2.size === 1 || vset3.size === 1){
            console.log("winner vertical");
            return checkWhichSet(vset1, vset2, vset3, [0, 3, 6], [1, 4, 7], [2, 5, 8]);
        } else if(lrset.size === 1){
            console.log("winner lr diagonal");
            return [0, 4, 8];
        } else if(rlset.size === 1){
            console.log("winner rl diagonal");
            return [2, 4, 6];
        } else if(numOfClicks >= 9){
            console.log("draw")
            return 0;
        }
    }

    //Helper function to find out which row for horizontal wins, or which column for vertical wins is correct.
    //This is to ensure the highlight is correct.
    //Used by winCheck()
    const checkWhichSet = (set1, set2, set3, arr1, arr2, arr3) => {
        if(set1.size == 1){
            return arr1;
        } else if(set2.size == 1){
            return arr2;
        } else if(set3.size == 1){
            return arr3;
        }
    }

    //Main function of gameBoard module that runs necessary functions when a square is clicked.
    //First checks if there already is an X or O in a square. If so, do nothing.
    //Next sets either X or O alternating if it's a legal square.
    //Increments numOfClicks and adds the X or O to the gameBoard array.
    //Then runs winCheck and appropriately pops up modal for draw or for win.
    const clickHandler = (e) => {
        if(e.innerHTML != '') return;
        if(numOfClicks % 2 == 0) {
            e.innerHTML = "X"
        } else {
            e.innerHTML = "O"
        };
        numOfClicks++;
        addToGameBoardArray(e.dataset.square, e.innerHTML);

        let winningSquares = winCheck();
        if(winningSquares != undefined){
            //if draw
            if(winningSquares == 0){
                displayController.openModal(false)
            //if win
            } else if (winningSquares.size != 1) {
                const winner = document.querySelector(`[data-square="${winningSquares[0]}"]`);
                if(winner.textContent == 'X'){
                    console.log(player1.getScore())
                    player1.incrementScore();
                    console.log(player1.getScore())
                } else if(winner.textContent == 'O'){
                    console.log(player2.getScore())
                    player2.incrementScore();
                    console.log(player2.getScore())
                }
                displayController.highlightSquare(winningSquares);
                displayController.openModal(true);
            }
        }
        
    }

    //Helper function to reset gameBoard array and numOfClicks
    const resetGameboard = () => {
        gameBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        numOfClicks = 0;
    }
    return {
        clickHandler,
        resetGameboard,
    }
})();

const Player = (letter) => {
    let score = 0;

    const getScore = () => score;
    const getLetter = () => letter;
    const incrementScore = () => score++;

    const playerHandler = (letter, p2) => {
        
    };

    return {
        getScore,
        getLetter,
        incrementScore,
        playerHandler,
    }
};

displayController.generateBoard()

//For now its just people, but we can make it computer and playerHandler() should still be able to work.
const player1 = Player('X');
const player2 = Player('O');

function clicks(){
    gameBoard.clickHandler(event.target);
}