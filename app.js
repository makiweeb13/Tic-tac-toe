const tiles = document.querySelectorAll('.tile');
const comment = document.querySelector('.comment');
const continueMessage = document.querySelector('.continue');
const XBtn = document.getElementById('x-btn');
const OBtn = document.getElementById('o-btn');
const singleMode = document.getElementById('single');
const multiplayerMode = document.getElementById('multiplayer');
const pickCharacter = document.querySelector('.pick-character');
const firstMoves = [1, 3, 5, 7, 9];

const numValue = { 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 
                   6: 'six', 7: 'seven', 8: 'eight', 9: 'nine' }

let player = 'X';
let opponent = 'O';
let currentMode = 'single';
let countTurn = 1;

let tileNum, playerTiles, opponentTiles, opponentCount, corners, winningTiles, haveWon, interval;
const remove = currentTile => tileNum = tileNum.filter(tile => tile !== currentTile);
const removeCorner = corner => corners = corners.filter(num => num !== corner);


function initialize() {
    playerTiles = [];
    opponentTiles = [];
    opponentCount = [];
    corners = [1, 3, 7, 9];
    tileNum = Object.values(numValue);
    winningTiles = [[1,2,3], [4,5,6], [7,8,9], [1,4,7], [2,5,8], [3,6,9], [1,5,9], [3,5,7]];
    haveWon = false;
}

function startGame() {
    initialize();
    if (currentMode === 'single') generateRandomFirstMove();
    tiles.forEach(tile => tile.addEventListener('click', function(event) {
        const currentTile = event.currentTarget.classList;
        handleGame(currentTile);
    }))
}

function startOver() {
    interval = currentMode === 'single' ? 1000 : 2000;
    setTimeout(() => {
        initialize();
        clear();
        if (currentMode === 'single') generateRandomFirstMove()
        else countTurn = 1;
    }, interval);
}

startGame();

function handleGame(tiles) {
    if (tileNum.length > 0) {
        for (let i = 0; i < tileNum.length; i++) {
            if (tiles.contains(tileNum[i])) {
                if (currentMode === 'single') {
                    handleSingleGame(tileNum[i]);
                } 
                else if (currentMode === 'multiplayer') {
                    handleMultiplayerGame(tileNum[i]);
                }
            }
        }
    } 
}

function handleSingleGame(tile) {
    let lastMove;
    document.querySelector('.' + tile).textContent = player;
    lastMove = getTileNum(tile);
    playerTiles.push(lastMove);
    removeCorner(lastMove);
    remove(tile);
    opponentResponse();
}

function handleMultiplayerGame(tile) {
    if (countTurn%2 !== 0) {
        document.querySelector('.' + tile).textContent = player;
        lastMove = getTileNum(tile);
        playerTiles.push(lastMove);
        remove(tile);
    } else {
        document.querySelector('.' + tile).textContent = opponent;
        lastMove = getTileNum(tile);
        opponentTiles.push(lastMove);
        remove(tile);
    }

    let recordP1 = getRecord(playerTiles, opponentTiles);
    let countedTilesP1 = countTile(playerTiles, recordP1);
    let recordP2 = getRecord(opponentTiles, playerTiles);
    let countedTilesP2 = countTile(opponentTiles, recordP2);

    if (countedTilesP1.includes(3)) {
        let tilesToWinP1 = recordP1[countedTilesP1.indexOf(3)];
        comment.textContent = `Player ${player} Won!`;
        for (let i = 0; i < tilesToWinP1.length; i++) {
            let tilesWonP1 = document.querySelector('.' + numValue[tilesToWinP1[i]]);
            tilesWonP1.style.animation = "fadeInOut 700ms ease-out";
            setTimeout(() => {
                tilesWonP1.style.animation = "none";
            }, 1000);
        }
        haveWon = true;
        tileNum = [];
        startOver();
    } else if (countedTilesP2.includes(3)) {
        let tilesToWinP2 = recordP2[countedTilesP2.indexOf(3)];
        comment.textContent = `Player ${opponent} Won!`;
        for (let i = 0; i < tilesToWinP2.length; i++) {
            let tilesWonP2 = document.querySelector('.' + numValue[tilesToWinP2[i]]);
            tilesWonP2.style.animation = "fadeInOut 700ms ease-out";
            setTimeout(() => {
                tilesWonP2.style.animation = "none";
            }, 1000);
        }
        haveWon = true;
        tileNum = [];
        startOver();
    } else if (countTurn === 9) {
        comment.textContent = "It's a draw!";
        startOver();
    }
    countTurn++;
}

function getTileNum(currentTile) {
    for (let i = 1; i <= 9; i++) {
        if (numValue[i] === currentTile) return i;
    }
}

function generateRandomFirstMove() {
    const randomNum = firstMoves[Math.floor(Math.random() * firstMoves.length)];
    document.querySelector('.' + numValue[randomNum]).textContent = opponent;
    opponentTiles.push(getTileNum(numValue[randomNum]));
    removeCorner(getTileNum(numValue[randomNum]));
    remove(numValue[randomNum]);
}

function getRecord(player, opponent) {
    let record = [];
    winningTiles.map(tiles => {
        for (let i = 0; i < 3; i++) {
            if (player.includes(tiles[i]) && !record.includes(tiles)) {
                record.push(tiles);
            }
        }
    });

    for (let i = 0; i < opponent.length; i++) {
        record = record.filter(tile => !tile.includes(opponent[i]));
    }

    return record;
}

function countTile(currentPlayer, record) {
    let playerCount = [];
    let count = 0;
    record.forEach(tiles => {
        for (let i = 0; i < 3; i++) {
            if (currentPlayer.includes(tiles[i])) {
                count += 1;
            }
        }
        playerCount.push(count);
        count = 0;
    });
    return playerCount;
}

function clear() {
    for (let i = 0; i < tileNum.length; i++) {
        document.querySelector('.' + tileNum[i]).textContent = '';
    }
    comment.textContent = '';
    continueMessage.textContent = '';
}

function stratPlay() {
    let playerRecord = getRecord(playerTiles, opponentTiles);
    let playerCountedTiles = countTile(playerTiles, playerRecord);
    let opponentRecord = getRecord(opponentTiles, playerTiles);
    let opponentCountedTiles = countTile(opponentTiles, opponentRecord);

    if (opponentCountedTiles.includes(2)) {
        let tileToWin = opponentRecord[opponentCountedTiles.indexOf(2)];
        let tile = tileToWin.filter(tile => !opponentTiles.includes(tile))[0];

        setTimeout(() => {
            document.querySelector('.' + numValue[tile]).textContent = opponent;
            comment.textContent = "Opponent wins!";

            for (let i = 0; i < tileToWin.length; i++) {
                let wonTiles = document.querySelector('.' + numValue[tileToWin[i]]);
                wonTiles.style.animation = "fadeInOut 700ms ease-out";
                setTimeout(() => {
                    wonTiles.style.animation = "none";
                }, 1000);
            }
        }, 500);
        haveWon = true;
        tileNum = [];
    }
    else if (playerCountedTiles.includes(2)) {
        let tileToDefend = playerRecord[playerCountedTiles.indexOf(2)];
        let tile = tileToDefend.filter(tile => !playerTiles.includes(tile))[0];
        opponentTiles.push(tile);

        setTimeout(() => {
            document.querySelector('.' + numValue[tile]).textContent = opponent;
        }, 500);

        remove(numValue[tile]);
    }
    else if (opponentRecord.length == 2) {
        opponentTiles.push(corners[0]);

        setTimeout(() => {
            document.querySelector('.' + numValue[corners[0]]).textContent = opponent;
        }, 500);

        remove(numValue[corners[0]]);
    }
    else if (tileNum.length > 0) {
        const randomTile = tileNum[Math.floor(Math.random() * tileNum.length)];
        opponentTiles.push(getTileNum(randomTile));

        setTimeout(() => {
            document.querySelector('.' + randomTile).textContent = opponent;
        }, 500);

        remove(randomTile);
    }

    if (tileNum.length == 0) {
        setTimeout(() => {
            startOver();
        }, 1500);

        if (!haveWon) {
            setTimeout(() => {
                comment.textContent = "It'a draw!";
            }, 500);
        }
    }
}

function opponentResponse() {
    if (opponentTiles.length < 2 && corners.length > 0) {
        const randomCorner = corners[Math.floor(Math.random() * corners.length)];
        opponentTiles.push(getTileNum(numValue[randomCorner]));

        setTimeout(() => {
            document.querySelector('.' + numValue[randomCorner]).textContent = opponent;
        }, 500);

        removeCorner(randomCorner);
        remove(numValue[randomCorner]);
    } else {
        stratPlay();
    }
}

XBtn.addEventListener('click', function() {
    initialize();
    player = 'X';
    opponent = 'O';
    XBtn.style.textDecoration = 'underline';
    OBtn.style.textDecoration = 'none';
    clear();
    startGame();
})

OBtn.addEventListener('click', function() {
    initialize();
    player = 'O';
    opponent = 'X';
    XBtn.style.textDecoration = 'none';
    OBtn.style.textDecoration = 'underline';
    clear();
    startGame();
})

multiplayerMode.addEventListener('click', function() {
    multiplayerMode.style.textDecoration = 'underline';
    singleMode.style.textDecoration = 'none';
    pickCharacter.innerHTML = 'First player as:';
    currentMode = 'multiplayer';
    initialize();
    clear();
    startGame();
})

singleMode.addEventListener('click', function() {
    singleMode.style.textDecoration = 'underline';
    multiplayerMode.style.textDecoration = 'none';
    pickCharacter.innerHTML = 'Play as:';
    currentMode = 'single';
    interval = 2000;
    initialize();
    clear();
    startGame();
})