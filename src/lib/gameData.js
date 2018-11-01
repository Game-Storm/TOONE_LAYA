function getNum(num) {
    let arr = toBinaryLists(num)
    return arr.map(item => {
        return {
            num: item,
            isUsed: false
        }
    })
}

function toBinaryLists(num){
    if(typeof(num)!='number'){
        num=Number(num);
    }
    return num.toString(2).split('')
}

module.exports = {
    getNum: getNum
}