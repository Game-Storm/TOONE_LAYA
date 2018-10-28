function getNum(num) {
    let arr = num.split('');
    return arr.map(item => {
        return {
            num: item,
            isUsed: false
        }
    })
}

module.exports = {
    getNum: getNum
}