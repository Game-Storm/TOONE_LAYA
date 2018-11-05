let gameData = [
    {
        num: 0.02,
        row: 3,
        col: 1
    }, {
        num: 0.05,
        row: 3,
        col: 1
    }, {
        num: 0.1,
        row: 3,
        col: 1
    }, {
        num: 0.2,
        row: 3,
        col: 1
    }, {
        num: 0.3,
        row: 3,
        col: 1
    }, {
        num: 0.5,
        row: 3,
        col: 1
    }, {
        num: 0.55,
        row: 3,
        col: 1
    }, {
        num: 0.6,
        row: 3,
        col: 1
    }, {
        num: 0.8,
        row: 3,
        col: 1
    }, {
        num: 0.02,
        row: 3,
        col: 1
    }, {
        num: 0.05,
        row: 3,
        col: 1
    }, {
        num: 0.1,
        row: 3,
        col: 1
    }, {
        num: 0.2,
        row: 3,
        col: 1
    }, {
        num: 0.3,
        row: 3,
        col: 1
    }, {
        num: 0.5,
        row: 3,
        col: 1
    }, {
        num: 0.55,
        row: 3,
        col: 1
    }, {
        num: 0.6,
        row: 3,
        col: 1
    }, {
        num: 0.8,
        row: 3,
        col: 1
    }, {
        num: 0.02,
        row: 3,
        col: 1
    }, {
        num: 0.05,
        row: 3,
        col: 1
    }, {
        num: 0.1,
        row: 3,
        col: 1
    }, {
        num: 0.2,
        row: 3,
        col: 1
    }, {
        num: 0.3,
        row: 3,
        col: 1
    }, {
        num: 0.5,
        row: 3,
        col: 1
    }, {
        num: 0.55,
        row: 3,
        col: 1
    }, {
        num: 0.6,
        row: 3,
        col: 1
    }, {
        num: 0.8,
        row: 3,
        col: 1
    }, {
        num: 0.02,
        row: 3,
        col: 1
    }, {
        num: 0.05,
        row: 3,
        col: 1
    }, {
        num: 0.1,
        row: 3,
        col: 1
    }, {
        num: 0.2,
        row: 3,
        col: 1
    }, {
        num: 0.3,
        row: 3,
        col: 1
    }, {
        num: 0.5,
        row: 3,
        col: 1
    }, {
        num: 0.55,
        row: 3,
        col: 1
    }, {
        num: 0.6,
        row: 3,
        col: 1
    }, {
        num: 0.8,
        row: 3,
        col: 1
    }
]




function getNum(num) {
    let arr = toBinaryLists(num)
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
        // console.log(key)
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