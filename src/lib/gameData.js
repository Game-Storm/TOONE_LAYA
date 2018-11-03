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
    console.log(num)
    let binary=num.toString(2).split('.')[1]
    console.log(binary)
    return binary.split('');
}

module.exports = {
    getNum: getNum
}