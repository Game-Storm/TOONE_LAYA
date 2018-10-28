// 创建主游戏场景
import DRAW from '../lib/graphics';
import GameConfig from "../GameConfig";
import { getNum } from "../lib/gameData";

var Sprite = Laya.Sprite;
var Stage = Laya.Stage;
var Browser = Laya.Browser;
var Handler = Laya.Handler;
var WebGL = Laya.WebGL;
var Event = Laya.Event;
var Loader = Laya.Loader;

export default class DrawGame {
    constructor() {
        // 绘图相关的属性
        this.x = 40;
        this.y = 200;
        this.col = 4;
        this.row = 4;
        this.gab = 20;
        this.tWidth = 750 - 2 * this.x;//桌面宽度
        this.iWidth = (this.tWidth - (this.row + 1) * this.gab) / this.row;//单个的高度
        this.tHeight = this.tWidth;
        // this.spItem;
        this.itemsSprite = [];//存放宫格的Sprite

        // 游戏数据
        this.num = '011010011001101010001010';
        this.numData = getNum('011010011001101010001010');
        this.arr = [];
        this.pNow = [0, 0];

        // 游戏交互
        this.startP = [];
        // 运行
        this.init();
    }
    init() {
        console.log('执行init');
        this.drawPlace()

        for (var i = 0; i < this.row; i++) {
            this.arr[i] = [];
            this.itemsSprite[i] = [];
            for (var j = 0; j < this.col; j++) {
                // this.arr[i][j] = this.num.slice(i * this.row + j, i * this.row + j + 1);
                this.arr[i][j] = this.numData[i * this.row + j];
                // 创建宫格舞台
                this.itemsSprite[i][j] = new Sprite();
                Laya.stage.addChild(this.itemsSprite[i][j]);
            }
        }

        // this.spItem = new Laya.Sprite();
        // Laya.stage.addChild(this.spItem);
        this.drawTable()
    }
    // 画背景图
    drawPlace() {
        console.log('执行draw');
        var bg = new Laya.Sprite();
        bg.size(this.tWidth, this.tHeight*2);//一定要设置size才能监控事件 
        Laya.stage.addChild(bg);
        // 画圆角矩形
        bg.graphics.alpha(0.8)
        DRAW.drawRoundedRectangle(bg, this.x, this.y, this.tWidth, this.tHeight, this.gab, '#412873');
        // 绑定事件
        // bg.on()
        bg.on(Event.MOUSE_MOVE, this, this.onMouseMove);
        bg.on(Event.MOUSE_DOWN, this, this.onMouseDown);
        bg.on(Event.MOUSE_UP, this, this.onMouseUp);
        //添加键盘抬起事件
        Laya.stage.on(Event.KEY_UP, this, this.onKeyUp);9
    }

    // 画初始宫格
    drawTable() {
        // this.spItem.graphics.clear();
        for (var i = 0; i < this.row; i++) {
            for (var j = 0; j < this.col; j++) {
                let x = this.x + j * (this.iWidth + this.gab) + this.gab, y = this.y + i * (this.iWidth + this.gab) + this.gab;
                let url = "";
                if (j == this.pNow[0] && i == this.pNow[1]) {
                    url = this.arr[i][j].num == '0' ? 'assets/images/item-0-active.png' : 'assets/images/item-1-active.png';
                } else if (this.arr[i][j].isUsed) {
                    url = 'assets/images/item-1-lock.png'
                } else  {
                    url = this.arr[i][j].num == '0' ? 'assets/images/item-0.png' : 'assets/images/item-1.png';
                }
                this.itemsSprite[i][j].graphics.clear();
                // DRAW.drawRoundedRectangle(this.spItem, x, y, this.iWidth, this.iWidth, 15, color)
                this.itemsSprite[i][j].loadImage(url);
                this.itemsSprite[i][j].pos(x, y);
                this.itemsSprite[i][j].size(this.iWidth, this.iWidth);
            }
        }
        console.log(this.arr)
    }

    /**
     * 键盘事件
     */

    onKeyUp(e) {
        // delete keyDownList[e["keyCode"]];
        let direction = "";
        switch (e.keyCode) {
            case 37: direction = 'left'; break;
            case 38: direction = 'top'; break;
            case 39: direction = 'right'; break;
            case 40: direction = 'down'; break;
        }
        console.log('direction is ' + direction)
        this.moveBlock(direction)
    }

    /**
     * 手机滑动事件
     */
    onMouseDown(params) {
        this.startP = [Laya.stage.mouseX, Laya.stage.mouseY];
    }
    onMouseUp() {
        let endP = [Laya.stage.mouseX, Laya.stage.mouseY];
        let direction = "";
        let moveX = endP[0] - this.startP[0];
        let moveY = endP[1] - this.startP[1];
        if (Math.abs(moveX) > Math.abs(moveY)) {
            direction = Math.abs(moveX) > 50 && moveX > 0 ? 'right' : 'left';
        } else {
            direction = Math.abs(moveY) > 50 && moveY > 0 ? 'down' : 'top';
        }
        console.log(direction, moveX, moveY)
        this.moveBlock(direction)
    }
    onMouseMove(e) {
        // console.log(e)
        // console.log(Laya.stage.mouseX)
    }


    /**
     * 逻辑处理
     */

    moveBlock(direction) {
        console.log("移动");
        let b = this.pNow[0],
            a = this.pNow[1];
        // this.arr[a][b] = this.arr[a][b] == "1" ? "0" : "1";
        if (direction == "down") {
            if (this.pNow[1] >= this.col - 1) {
                return;
            }
            this.pNow[1]++;
        } else if (direction == "top") {
            if (this.pNow[1] <= 0) {
                return;
            }
            this.pNow[1]--;
        } else if (direction == "right") {
            if (this.pNow[0] >= this.row - 1) {
                return;
            }
            this.pNow[0]++;
        } else if (direction == "left") {
            if (this.pNow[0] <= 0) {
                return;
            }
            this.pNow[0]--;
        }
        let j = this.pNow[0],
            i = this.pNow[1];
        // console.log(this.arr)
        if (this.arr[i][j].isUsed) {
            this.pNow[0] = b;
            this.pNow[1] = a;
            return;
        }
        this.arr[i][j].num = this.arr[i][j].num == "1" ? "0" : "1";
        this.arr[i][j].isUsed = this.arr[i][j].num == "1" ? true : false;
        console.log(this.arr[i][j]);
        // this.arr[1][0] = "1";
        // 为了视图更新
        // let temp = this.arr;
        // this.arr = [];
        // this.arr = temp;
        // this.judgeSuccess();
        this.drawTable();
    }
}