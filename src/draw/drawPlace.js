// 创建主游戏场景
import DRAW from '../lib/graphics';
import GameConfig from "../GameConfig";
import { getNum, gameData } from "../lib/gameData";
import DrawHome from "./drawHome";

console.log(GameConfig)

var Sprite = Laya.Sprite;
var Stage = Laya.Stage;
var Browser = Laya.Browser;
var Handler = Laya.Handler;
var WebGL = Laya.WebGL;
var Event = Laya.Event;
var Loader = Laya.Loader;
var Tween = Laya.Tween;
var Ease = Laya.Ease;
var SoundManager = Laya.SoundManager;
var TimeLine = Laya.TimeLine;

export default class DrawGame {
    constructor() {
        // 绘图相关的属性
        this.x = 40;
        this.y = 250;
        this.col = 3;
        this.row = 3;
        this.gab = 20;
        this.tWidth = 750 - 2 * this.x;//桌面宽度
        this.iWidth = (this.tWidth - (this.row + 1) * this.gab) / this.row;//单个的高度
        this.tHeight = this.iWidth * this.col + (this.col + 1) * this.gab;
        this.itemsSprite = [];//存放宫格的Sprite
        // 画布
        this.game_bg = ""
        this.table_bg = ""
        this.topSp = ""
        this.refreshSp = ""
        this.returnSp = ""
        this.numScreenSp = ""
        this.failBgSp = ""
        this.failMaskSp = ""
        this.failRefresh = ""
        this.failReturn = ""
        this.slideBlock = ""

        // 游戏数据
        this.level = ""
        this.numData = "";
        this.arr = [];//宫格的实时数据
        this.pNow = [0, 0];
        this.frontPostion = [];
        this.isGaming = false;

        // 游戏交互
        this.startP = [];
        // 运行
        this.init();
    }
    // 首次注册
    init() {
        // console.log('执行init');
        this.drawPlace()
        this.refreshTable()
        this.drawTopButton()
        this.startGame()
    }

    // 开启游戏
    startGame() {
        this.game_bg.zOrder = 2;
        this.table_bg.zOrder = 3;
        this.topSp.zOrder = 4;
        this.refreshSp.zOrder = 4;
        this.returnSp.zOrder = 4;
        this.numScreenSp.zOrder = 4;

        // 开启比赛
        this.isGaming = true;
        this.refreshTable();
        for (var i = 0; i < this.col; i++) {
            this.itemsSprite[i] = [];
            for (var j = 0; j < this.row; j++) {
                // 创建宫格舞台
                this.itemsSprite[i][j] = new Sprite();
                Laya.stage.addChild(this.itemsSprite[i][j]);
                this.itemsSprite[i][j].zOrder = 4;
            }
        }
        this.drawTable(true);
        // 调试
        // this.showFail()
    }

    /**
     * 绘制画布
     */

    // 画背景图
    drawPlace() {
        // 画游戏的背景布
        this.game_bg = new Laya.Sprite();
        this.game_bg.size(750, 1334);
        Laya.stage.addChild(this.game_bg);
        this.game_bg.loadImage('assets/images/game_bg1.png')
        //添加键盘抬起事件
        Laya.stage.on(Event.KEY_UP, this, this.onKeyUp);
    }
    // 画背景色
    drawTableBg() {
        // 画中心的方块组背景
        if (this.table_bg) {
            this.table_bg.graphics.clear()
        } else {
            this.table_bg = new Laya.Sprite();
            this.table_bg.size(this.tWidth, this.tHeight * 2);//一定要设置size才能监控事件 
            Laya.stage.addChild(this.table_bg);
            this.table_bg.alpha = 0.2
            this.table_bg.on(Event.MOUSE_DOWN, this, this.onMouseDown);
            this.table_bg.on(Event.MOUSE_UP, this, this.onMouseUp);
        }
        DRAW.drawRoundedRectangle(this.table_bg, this.x, this.y, this.tWidth, this.tHeight, this.gab, '#2f0048');
    }
    // 画顶部按钮
    drawTopButton() {
        this.topSp = new Sprite();
        Laya.stage.addChild(this.topSp);
        // this.topSp.graphics.drawRect(0, 0, 142, 106, "#4d2f8a");
        // 绘制刷新按钮
        this.refreshSp = new Sprite();
        Laya.stage.addChild(this.refreshSp);
        this.refresh
        this.refreshSp.loadImage('assets/images/refresh_btn.png');
        this.refreshSp.pos(578, 30);
        this.refreshSp.size(142, 106);
        this.refreshSp.on('click', this, this.refresh)
        // this.refreshSp.graphics.destroy()
        // 绘制数字显示屏
        this.numScreenSp = new Sprite();
        Laya.stage.addChild(this.numScreenSp);
        this.numScreenSp.loadImage('assets/images/top_num_screen.png');
        this.numScreenSp.size(330, 130);
        this.numScreenSp.pos(210, 20)

        // 绘制返回按钮
        this.returnSp = new Sprite();
        Laya.stage.addChild(this.returnSp);
        this.returnSp.loadImage('assets/images/return_btn.png');
        this.returnSp.pos(30, 30);
        this.returnSp.size(142, 106);
        this.returnSp.on('click', this, this.returnHome)
    }
    // 画宫格
    drawTable(first = false) {
        // 如果是第一次画宫格
        if (first) {
            for (var i = 0; i < this.col; i++) {
                for (var j = 0; j < this.row; j++) {
                    let x = this.x + j * (this.iWidth + this.gab) + this.gab, y = this.y + i * (this.iWidth + this.gab) + this.gab;
                    this.drawItemBlock(i, j);
                    this.itemsSprite[i][j].pos(x + this.iWidth * 0.5, y + this.iWidth * 0.5);
                    this.itemsSprite[i][j].size(this.iWidth, this.iWidth);
                    // 动画
                    this.itemsSprite[i][j].alpha = 0
                    Tween.from(this.itemsSprite[i][j], {
                        // y:10
                        scaleY: 0,
                        scaleX: 0,
                        pivotX: this.iWidth * 0.5,

                        pivotY: this.iWidth * 0.5,
                        alpha: 0
                    }, 250, Ease.circInOut, null, 200)
                    Tween.to(this.itemsSprite[i][j], {
                        scaleY: 1,
                        scaleX: 1,
                        pivotX: this.iWidth * 0.5,
                        pivotY: this.iWidth * 0.5,
                        alpha: 1
                    }, 250, Ease.circInOut, null, 200)
                }
            }
        } else {
            // 移动滑块
            if (!this.slideBlock) {
                this.slideBlock = new Sprite()
                Laya.stage.addChild(this.slideBlock);
                this.slideBlock.zOrder = 4;
                this.slideBlock.loadImage('assets/images/item-1-active.png');
                this.slideBlock.size(this.iWidth, this.iWidth);
            }
            let toX = this.x + this.pNow[0] * (this.iWidth + this.gab) + this.gab, toY = this.y + this.pNow[1] * (this.iWidth + this.gab) + this.gab;
            let fromX = this.x + this.frontPostion[0] * (this.iWidth + this.gab) + this.gab, fromY = this.y + this.frontPostion[1] * (this.iWidth + this.gab) + this.gab;
            this.slideBlock.pos(fromX, fromY);
            this.slideBlock.alpha = 0.5;
            var timeLine2 = new TimeLine();
            timeLine2.addLabel("move", 0).to(this.slideBlock, { x: toX, y: toY }, 100, null, 0)
                .addLabel("move", 0).to(this.slideBlock, { x: toX, y: toY, alpha: 0 }, 100, null, 0)
            timeLine2.play(0, false);

            let scaleSp = this.itemsSprite[this.pNow[1]][this.pNow[0]];
            var timeLine = new TimeLine();
            timeLine.addLabel("move", 0).to(scaleSp, { scaleX: 1.07, scaleY: 1.07 }, 100, null, 0)
                .addLabel("move", 0).to(scaleSp, { scaleX: 1, scaleY: 1 }, 100, null, 0)
            timeLine.play(0, false);

            this.drawItemBlock(this.pNow[1], this.pNow[0])
            this.drawItemBlock(this.frontPostion[1], this.frontPostion[0])
        }
        // 格式化棋盘数据
        Tween.clearAll(this.itemsSprite)

        setTimeout(() => {
            this.judgeSuccess();
        }, 100)
    }
    // 根据坐标绘制相应的色块
    drawItemBlock(i, j) {
        let url;
        if (j == this.pNow[0] && i == this.pNow[1]) {
            url = this.arr[i][j].num == '0' ? 'assets/images/item-0-active.png' : 'assets/images/item-1-active.png';
        } else if (this.arr[i][j].isUsed) {
            url = 'assets/images/item-1-lock.png'
        } else {
            url = this.arr[i][j].num == '0' ? 'assets/images/item-0.png' : 'assets/images/item-1.png';
        }
        this.itemsSprite[i][j].graphics.clear();
        this.itemsSprite[i][j].loadImage(url);
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
        if (direction) this.moveBlock(direction)
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
            if (Math.abs(moveX) > 80) direction = moveX > 0 ? 'right' : 'left';
        } else {
            if (Math.abs(moveY) > 80) direction = moveY > 0 ? 'down' : 'top';
        }
        console.log(direction, moveX, moveY)
        if (direction) this.moveBlock(direction)
    }
    /**
     * 逻辑处理
     */

    // 格式化棋盘
    refreshTable() {
        // console.log('执行了！！！')
        this.pNow = [0, 0];
        this.level = Laya.LocalStorage.getItem('gameLevel');
        // console.log(this.level)
        this.numData = getNum(this.level).items;
        this.col = getNum(this.level).col;
        this.row = getNum(this.level).row;
        this.gab = 20 + (4 - this.row) * 5
        this.tWidth = 750 - 2 * this.x;//桌面宽度
        this.iWidth = (this.tWidth - (this.row + 1) * this.gab) / this.row;//单个的高度
        this.tHeight = this.iWidth * this.col - 1 + (this.col + 1) * this.gab;
        // console.log(this.tWidth, this.tHeight)
        for (var i = 0; i < this.col; i++) {
            this.arr[i] = [];
            for (var j = 0; j < this.row; j++) {
                // this.arr[i][j] = this.num.slice(i * this.row + j, i * this.row + j + 1);
                this.arr[i][j] = this.numData[i * this.row + j];
            }
        }
        this.drawTableBg()
    }

    moveBlock(direction) {
        if (!this.isGaming) return;

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
        if (this.arr[i][j].isUsed) {
            this.pNow[0] = b;
            this.pNow[1] = a;
            return;
        }
        this.frontPostion[0] = b;
        this.frontPostion[1] = a;

        this.arr[i][j].num = this.arr[i][j].num == "1" ? "0" : "1";
        this.arr[i][j].isUsed = this.arr[i][j].num == "1" ? true : false;

        this.drawTable();
        // 播放滑动音效

        SoundManager.setSoundVolume(0.5);
        SoundManager.playSound("assets/music/dong.mp3", 1, null, null, 13);
    }
    // 判断是否失败以及成功
    judgeSuccess() {
        // 判断是否赢了的逻辑
        let isWin = this.arr.every(items => {
            return items.every(item => item.num == '1')
        })
        if (isWin) {
            // 如果不是玩的以前的关卡
            console.log(this.level, Laya.LocalStorage.getItem('realLevel'))
            if (this.level - 1 == Laya.LocalStorage.getItem('realLevel')) {
                Laya.LocalStorage.setItem('realLevel', this.level++)
                $ob.emit('nextGame', true)
            } else {
                $ob.emit('nextGame', false)
            }

            this.clearPlaceAll()
        } else {
            // 验证是否失败
            let j = this.pNow[0],
                i = this.pNow[1];
            if ((i + 1 < this.col && !this.arr[i + 1][j].isUsed) ||
                (j + 1 < this.row && !this.arr[i][j + 1].isUsed) ||
                (i - 1 >= 0 && !this.arr[i - 1][j].isUsed) ||
                (j - 1 >= 0 && !this.arr[i][j - 1].isUsed)) {
                return;
            } else {
                // alert('你输了！');
                this.showFail();
                // this.refresh();
            }
        }

    }
    // 重置游戏
    refresh() {
        this.closeAlert()
        this.refreshTable()
        this.drawTable(true)
    }
    // 返回 Home
    returnHome() {
        this.clearPlaceAll()
        // new DrawHome()
    }
    // 清除所有画布的东西
    clearPlaceAll() {
        // 设置层级下沉
        this.game_bg.zOrder = -1;
        this.table_bg.zOrder = -3;
        this.topSp.zOrder = -2
        this.refreshSp.zOrder = -2
        this.returnSp.zOrder = -2
        this.numScreenSp.zOrder = -2;
        if (this.slideBlock) this.slideBlock.zOrder = -2;
        if (this.failBgSp) {
            this.failBgSp.zOrder = -2
            this.failMaskSp.zOrder = -2
            this.failRefresh.zOrder = -2
            this.failReturn.zOrder = -2
        }

        for (var i = 0; i < this.col; i++) {
            for (var j = 0; j < this.row; j++) {
                this.itemsSprite[i][j].zOrder = -2
            }
        }
        this.slideBlock = ""
        // 事件监听失效
        this.isGaming = false;
    }
    // 输了的逻辑
    showFail() {
        SoundManager.playSound("assets/music/sou.mp3", 1, null, null, 13);

        if (!this.failMaskSp) {
            this.failMaskSp = new Sprite();
            // this.failBgSp.pos(50, 200);
            this.failMaskSp.size(750, Browser.height);
            this.failMaskSp.loadImage('assets/images/alert_fail_mask.png')
            Laya.stage.addChild(this.failMaskSp);
        }
        this.failMaskSp.zOrder = 5;
        this.failMaskSp.alpha = 0;
        Tween.to(this.failMaskSp, {
            alpha: 1
        }, 250, Ease.linearIn, null, 200)

        // 画卡片背景
        if (!this.failBgSp) {
            this.failBgSp = new Sprite();
            this.failBgSp.size(655, 558);
            Laya.stage.addChild(this.failBgSp);
            this.failBgSp.loadImage('assets/images/alert_fail_bg.png');
        }
        this.failBgSp.pos(50, -550);
        this.failBgSp.zOrder = 6;
        // 进入动画
        Tween.to(this.failBgSp, {
            y: 250,
        }, 550, Ease.bounceOut, null, 200)

        // 画返回按钮
        if (!this.failReturn) {
            this.failReturn = new Sprite()

            this.failReturn.size(170, 126)
            Laya.stage.addChild(this.failReturn)
            this.failReturn.loadImage('assets/images/return_btn.png')
            this.failReturn.on('click', this, this.returnHome)
        }
        this.failReturn.pos(900, 480)
        this.failReturn.zOrder = 7;
        Tween.to(this.failReturn, {
            x: 500,
        }, 550, Ease.bounceOut, null, 200)
        // 画重新按钮
        if (!this.failRefresh) {
            this.failRefresh = new Sprite()
            this.failRefresh.size(170, 126)
            Laya.stage.addChild(this.failRefresh)
            this.failRefresh.loadImage('assets/images/refresh_btn.png')
            this.failRefresh.on('click', this, this.refresh)
        }
        this.failRefresh.pos(900, 650)
        this.failRefresh.zOrder = 7
        Tween.to(this.failRefresh, {
            x: 500,
        }, 550, Ease.strongIn, null, 100)
    }
    //关闭弹窗
    closeAlert() {
        if (this.failBgSp) {
            this.failBgSp.zOrder = -2
            this.failMaskSp.zOrder = -2
            this.failRefresh.zOrder = -2
            this.failReturn.zOrder = -2
        }

    }
}