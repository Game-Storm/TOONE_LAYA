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
    console.log(level)
    console.log(gameData[Number(level)])
    let arr = toBinaryLists(gameData[Number(level)].num)
    return arr.map(item => {
        return {
            num: item,
            isUsed: false
        }
    })
}

function toBinaryLists(num) {
    if (typeof (num) != 'number') {
        num = Number(num);
    }
    console.log(num)
    let binary = num.toString(2).split('.')[1]
    console.log(binary)
    return binary.split('');
}

function getGameData() {
    let i = 0;
    for (let key in gameData) {
        if (key != 'length') i++;
    }
    // console.log(i++);
    gameData['length'] = i;
    return gameData;
}

module.exports = {
    getNum: getNum,
    // getGameData: getGameData
    gameData: gameData
}