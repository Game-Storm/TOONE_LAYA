// 创建主游戏场景
import DRAW from '../lib/graphics';
import GameConfig from "../GameConfig";

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
        this.col = 3;
        this.row = 3;
        this.gab = 20;
        this.tWidth = 750 - 2 * this.x;//桌面宽度
        this.iWidth = (this.tWidth - (this.row + 1) * this.gab) / this.row;//单个的高度
        this.tHeight = this.iWidth * this.col + (this.col + 1) * this.gab;

        // 游戏数据
        this.num = '011010011001101010001010';
        this.arr = [];

        // 游戏交互
        this.startP = [];


        this.init();
    }
    init() {
        console.log('执行init');
        this.drawPlace()
        this.drawTable()
    }
    // 画背景图
    drawPlace() {
        console.log('执行draw');
        var bg = new Laya.Sprite();
        bg.size(this.tWidth, this.tHeight);//一定要设置size才能监控事件 
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
        Laya.stage.on(Event.KEY_UP, this, this.onKeyUp);

    }

    // 画初始宫格
    drawTable(col, row) {
        var spItem = new Laya.Sprite();
        Laya.stage.addChild(spItem);
        for (var i = 0; i < this.row; i++) {
            this.arr[i] = [];
            for (var j = 0; j < this.col; j++) {
                this.arr[i][j] = this.num.slice(i * this.row + j, i * this.row + j + 1)
                let x = this.x + i * (this.iWidth + this.gab) + this.gab, y = this.y + j * (this.iWidth + this.gab) + this.gab;
                // console.log(x, y);
                let color = this.arr[i][j] == 0 ? '#efb7dd' : '#666'
                DRAW.drawRoundedRectangle(spItem, x, y, this.iWidth, this.iWidth, 15, '#efb7dd')
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
    }

    /**
     * 手机滑动事件
     */
    onMouseDown(params) {
        this.startP = [Laya.stage.mouseX, Laya.stage.mouseY];
        // console.log(this.startP);
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
    }
    onMouseMove(e) {
        // console.log(e)
        // console.log(Laya.stage.mouseX)
    }


    /**
     * 逻辑处理
     */
}