const tiles = document.querySelectorAll('.tile');
const player = 'X';
const opponent = 'O';
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

let tileNum = Object.values(numValue);
let playerTiles = [];
let opponentTiles = [];
let playerCount = [];
let opponentCount = [];
let corners = [1, 3, 7, 9];
let winningTiles = [[1,2,3], [4,5,6], [7,8,9], [1,4,7], [2,5,8], [3,6,9], [1,5,9], [3,5,7]];

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
    let count1 = 0;
    let count2 = 0;
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
    
    record.forEach(tiles => {
        for (let i = 0; i < 3; i++) {
            if (player.includes(tiles[i])) {
                count1 += 1;
            }
        }
        playerCount.push(count1);
        count1 = 0;
    })

    record.forEach(tiles => {
        for (let i = 0; i < 3; i++) {
            if (opponent.includes(tiles[i])) {
                count2 += 1;
            }
        }
        opponentCount.push(count2);
        count2 = 0;
    })
    console.log(record)
}

const isWinning = (player) => {
    let storeCount = []
    let count = 0;
    getRecord().map(tiles => {
        for (let i = 0; i < 3; i++) {
            if (player.includes(tiles[i])) {
                count += 1;
            }
        }
        storeCount.push(count);
        count = 0;
    })
    console.log(storeCount)
    return storeCount;
}

const opponentResponse = () => {
    if (opponentTiles.length < 3 && corners.length > 0) {
        const randomCorner = corners[Math.floor(Math.random()*corners.length)];
        opponentTiles.push(getTileNum(numValue[randomCorner]));
        setTimeout(() => {
            document.querySelector('.' + numValue[randomCorner]).textContent = opponent;
        }, 500)
        removeCorner(randomCorner);
        remove(numValue[randomCorner]);
    } 
    getRecord(playerTiles, opponentTiles);
    //isWinning(playerTiles);
    console.log(playerCount)
    console.log(opponentCount)
}

tiles.forEach(tile => {
    tile.addEventListener('click', e => {
        const currentTile = e.currentTarget.classList;
        let lastMove;
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
    })
})
