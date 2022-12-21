const tiles = document.querySelectorAll('.tile');
const comment = document.querySelector('.comment');
const continueMessage = document.querySelector('.continue');
const X = document.getElementById('x-btn');
const O = document.getElementById('o-btn');
const firstMoves = [1, 3, 5, 7, 9];

const numValue = {
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five',
    6: 'six',
    7: 'seven',
    8: 'eight',
    9: 'nine'
}

let player = 'X';
let opponent = 'O';

let tileNum,
    playerTiles,
    opponentTiles,
    opponentCount,
    corners,
    winningTiles,
    haveWon;

const initialize = () => {
    playerTiles = [];
    opponentTiles = [];
    opponentCount = [];
    corners = [1, 3, 7, 9];
    tileNum = Object.values(numValue);
    winningTiles = [[1,2,3], [4,5,6], [7,8,9], [1,4,7], [2,5,8], [3,6,9], [1,5,9], [3,5,7]];
    haveWon = false;
}

initialize();

const remove = currentTile => tileNum = tileNum.filter(tile => tile !== currentTile);
const removeCorner = corner => corners = corners.filter(num => num !== corner);

const getTileNum = currentTile => {
    for (let i = 1; i <= 9; i++) {
        if (numValue[i] === currentTile) return i;
    }
}

const generateRandomFirstMove = () => {
    const randomNum = firstMoves[Math.floor(Math.random()*firstMoves.length)];
    document.querySelector('.' + numValue[randomNum]).textContent = opponent;
    opponentTiles.push(getTileNum(numValue[randomNum]));
    removeCorner(getTileNum(numValue[randomNum]));
    remove(numValue[randomNum]);
}

setTimeout(() => generateRandomFirstMove(), 300);

const getRecord = (player, opponent) => {
    let record = [];
    winningTiles.map(tiles => {
        for (let i = 0; i < 3; i++) {
            if (player.includes(tiles[i]) && !record.includes(tiles)) {
                record.push(tiles);
            }
        }
    })

    for (let i = 0; i < opponent.length; i++) {
        record = record.filter(tile => !tile.includes(opponent[i]))
    }
    
    return record
}

const countTile = (currentPlayer, record) => {
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
    })
    return playerCount
}

const clear = () => {
    for (let i = 0; i < tileNum.length; i++) {
        document.querySelector('.' + tileNum[i]).textContent = '';
    }
    comment.textContent = '';
    continueMessage.textContent = '';
}

const stratPlay = () => {
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
                }, 1000)
            }

        }, 500)
        haveWon = true;
        tileNum = [];
        
    }
    else if (playerCountedTiles.includes(2)) {
        let tileToDefend = playerRecord[playerCountedTiles.indexOf(2)];
        let tile = tileToDefend.filter(tile => !playerTiles.includes(tile))[0];
        opponentTiles.push(tile);

        setTimeout(() => {
            document.querySelector('.' + numValue[tile]).textContent = opponent;
        }, 500)

        remove(numValue[tile]);  
    } 
    else if (opponentRecord.length == 2) {
        opponentTiles.push(corners[0]);

        setTimeout(() => {
            document.querySelector('.' + numValue[corners[0]]).textContent = opponent;
        }, 500)

        remove(numValue[corners[0]]);
    } 
    else if (tileNum.length > 0) {
        const randomTile = tileNum[Math.floor(Math.random()*tileNum.length)];
        opponentTiles.push(getTileNum(randomTile));

        setTimeout(() => {
            document.querySelector('.' + randomTile).textContent = opponent;
        }, 500)

        remove(randomTile);
    }

    if (tileNum.length == 0) {
        setTimeout(() => {
            continueMessage.textContent = "Click anywhere on the board to continue";
            continueMessage.style.animation = "fadeInOut 2s ease-out infinite";
        }, 1000)

        if(!haveWon) {
            setTimeout(() => {
                comment.textContent = "It'a draw!";
            }, 500)
        } 
    }
}

const opponentResponse = () => {
    if (opponentTiles.length < 2 && corners.length > 0) {
        const randomCorner = corners[Math.floor(Math.random()*corners.length)];
        opponentTiles.push(getTileNum(numValue[randomCorner]));

        setTimeout(() => {
            document.querySelector('.' + numValue[randomCorner]).textContent = opponent;
        }, 500)

        removeCorner(randomCorner);
        remove(numValue[randomCorner]);
    } else {
        stratPlay();
    }
}

X.addEventListener('click', () => {
    initialize();
    player = 'X';
    opponent = 'O';
    X.style.textDecoration = 'underline';
    O.style.textDecoration = 'none';
    clear();
    generateRandomFirstMove();
})

O.addEventListener('click', () => {
    initialize();
    player = 'O';
    opponent = 'X';
    X.style.textDecoration = 'none';
    O.style.textDecoration = 'underline';
    clear();
    generateRandomFirstMove();
})

tiles.forEach(tile => {
    tile.addEventListener('click', e => {
        const currentTile = e.currentTarget.classList;
        let lastMove;
        
        if (tileNum.length > 0) {
            for (let i = 0; i < tileNum.length; i++) {
                if (currentTile.contains(tileNum[i])) {
                    document.querySelector('.' + tileNum[i]).textContent = player;
                    lastMove = getTileNum(tileNum[i]);
                    playerTiles.push(lastMove);
                    removeCorner(lastMove);
                    remove(tileNum[i]);
                    opponentResponse();
                }
            }
        } else {
            initialize();
            setTimeout(() => {
                clear();
                generateRandomFirstMove();
            }, 1000)
        }
    })
})
