let gameData = [
    {
        num: 0
    },
    {
        num: 0.02
    },
    {
        num: 0.022
    },
    {
        num: 0.05
    },
    {
        num: 0.08
    },
    {
        num: 0.088
    },
    {
        num: 0.1
    },
    {
        num: 0.111
    },
    {
        num: 0.13
    },
    {
        num: 0.16
    },
    {
        num: 0.17
    },
    {
        num: 0.182
    },
    {
        num: 0.2
    },
    {
        num: 0.21
    },
    {
        num: 0.233
    },
    {
        num: 0.265
    },
    {
        num: 0.26
    },
    {
        num: 0.27
    },
    {
        num: 0.277
    },
    {
        num: 0.286
    },
    {
        num: 0.3
    },
    {
        num: 0.31,

    },
    {
        num: 0.33
    },
    {
        num: 0.35,
        last: [0, 2]
    },
    {
        num: 0.37,
        last: [2, 3]
    },
    {
        num: 0.38
    },
    {
        num: 0.388
    },
    {
        num: 0.39
    },
    {
        num: 0.41
    },
    {
        num: 0.427
    },
    {
        num: 0.44
    },
    {
        num: 0.46
    },
    {
        num: 0.48
    },
    {
        num: 0.49
    },
    {
        num: 0.52
    },
    {
        num: 0.533
    },
    {
        num: 0.556
    },
    {
        num: 0.56
    },
    {
        num: 0.571
    },
    {
        num: 0.58
    },
    {
        num: 0.582
    },
    {
        num: 0.599
    },
    {
        num: 0.6
    },
    {
        num: 0.61
    },
    {
        num: 0.63
    },
    {
        num: 0.64
    },
    {
        num: 0.651
    },
    {
        num: 0.66
    },
    {
        num: 0.666
    },
    {
        num: 0.688
    },
    {
        num: 0.69
    },
    {
        num: 0.7
    },
    {
        num: 0.711
    },
    {
        num: 0.73
    },
    {
        num: 0.74
    },
    {
        num: 0.76
    },
    {
        num: 0.77
    },
    {
        num: 0.778
    },
    {
        num: 0.784
    },
    {
        num: 0.79
    },
    {
        num: 0.799
    },
    {
        num: 0.81
    },
    {
        num: 0.815
    },
    {
        num: 0.83
    },
    {
        num: 0.833
    },
    {
        num: 0.85
    },
    {
        num: 0.86
    },
    {
        num: 0.87
    },
    {
        num: 0.88
    },
    {
        num: 0.892
    },
    {
        num: 0.9
    },
    {
        num: 0.91
    },
    {
        num: 0.92
    },
    {
        num: 0.93
    },
    {
        num: 0.94
    },
    {
        num: 0.95
    },
    {
        num: 0.96
    },
    {
        num: 0.97
    },
    {
        num: 0.99
    },
    {
        num: 1
    }
]
let skinLevel = [0, 18, 35, 50, 62, 75];


function getNum(level) {
    // console.log(level)
    // console.log(gameData[Number(level)])
    let num = gameData[Number(level)].num
    // let last = JSON.parse(JSON.stringify()) || null
    let arr = toBinaryLists(num)
    arr.row = getRow(Number(level))
    arr.col = getCol(Number(level))
    arr.lock = Number(level) < 10 ? false : true
    arr.last = gameData[Number(level)].last || null
    arr.items = arr.map(item => {
        return {
            num: item,
            isUsed: false
        }
    })
    return arr;
}

function getRow(level) {
    if (level == 2) return 2;
    // else if (level <= 5) return 3;
    else if (level <= 8) return 3;
    else if (level <= 25) return 4;
    else if (level <= 35) return 5;
    else if (level <= 45) return 6;
    else if (level <= 55) return 7;
    else return 7;
}

function getCol(level) {
    if (level <= 1) return 1;
    else if (level <= 5) return 2;
    else if (level <= 10) return 3;
    else if (level <= 25) return 4;
    else if (level <= 35) return 5;
    else if (level <= 40) return 6;
    else if (level <= 48) return 7;
    else if (level <= 60) return 7;
    else return 7;
}

function toBinaryLists(num) {
    if (typeof (num) != 'number') {
        num = Number(num);
    }
    let binary = num.toString(2).split('.')[1]
    return binary.split('');
}
// 获取当前是哪个色块
function getBlock() {
    // Laya.LocalStorage.setItem('block', 4);
    var type = Laya.LocalStorage.getItem('skin') - 1;
    return type > 0 ? '-' + type : '';
}

function getSkinBg(i) {
    let skin = Laya.LocalStorage.getItem('skin');
    let realLevel = Laya.LocalStorage.getItem('realLevel');
    if ((!skin && i == 1) || skin == i) {
        return "f39700";
    }
    else if (realLevel < skinLevel[i - 1] - 1) {
        return "#313131";
    } else {
        return "#3955df"
    }

}

module.exports = {
    getNum: getNum,
    skinLevel: skinLevel,
    gameData: gameData,
    getBlock: getBlock,
    getSkinBg: getSkinBg
}