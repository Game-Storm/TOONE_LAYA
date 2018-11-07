let gameData = [
    {
        num: 0
    },
    {
        num: 0.02
    },
    {
        num: 0.2
    },
    {
        num: 0.3
    },
    {
        num: 0.44
    },
    {
        num: 0.52
    },
    {
        num: 0.66
    },
    {
        num: 0.7
    }, {
        num: 0.77
    },
    {
        num: 0.88
    },
    {
        num: 0.9
    },
    {
        num: 0.99
    }
]

function getNum(level) {
    // console.log(level)
    // console.log(gameData[Number(level)])
    let num = gameData[Number(level)].num
    let arr = toBinaryLists(num)
    arr.row = getRow(num)
    arr.col = getCol(num)
    arr.items= arr.map(item => {
        return {
            num: item,
            isUsed: false
        }
    })
    return arr;
}

function getRow(num) {
    if (num < 0.2) return 3;
    else if (num < 0.2) return 3;
    else if (num < 0.4) return 4;
    else if (num < 0.5) return 4;
    else if (num < 0.6) return 4;
    else if (num < 0.7) return 5;
    // else if (num < 0.95) return 6;
    else return 7;
}

function getCol(num) {
    if (num < 0.1) return 2;
    else if (num < 0.2) return 2;
    else if (num < 0.25) return 3;
    else if (num < 0.35) return 4;
    else if (num < 0.5) return 4;
    else if (num < 0.6) return 4;
    else if (num < 0.7) return 5;
    // else if (num < 0.95) return 7;
    else return 6
}

function toBinaryLists(num) {
    if (typeof (num) != 'number') {
        num = Number(num);
    }
    let binary = num.toString(2).split('.')[1]
    return binary.split('');
}

module.exports = {
    getNum: getNum,
    // getGameData: getGameData
    gameData: gameData
}