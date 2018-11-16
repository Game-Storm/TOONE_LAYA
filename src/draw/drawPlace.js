// 创建主游戏场景
import DRAW from '../lib/graphics';
import GameConfig from "../GameConfig";
import { getNum, gameData, getBlock } from "../lib/gameData";
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
var Text = Laya.Text;
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
        this.refreshSp = ""
        this.returnSp = ""
        this.failBgSp = ""
        this.failMaskSp = ""
        this.failRefresh = ""
        this.failReturn = ""
        this.slideBlock = ""
        this.numText = ""
        this.tipText = ""



        // 游戏数据
        this.level = ""
        this.numData = "";
        this.arr = [];//宫格的实时数据
        this.pNow = [0, 0];
        this.frontPostion = [];
        this.isGaming = false;

        // 游戏交互
        this.startP = [];

        // 动画
        this.topTextLine = ""
        this.tipTextLine = ""
        this.winLine = ""
        this.winMoveLine = ""

        // 运行
        this.init();
    }
    // 首次注册
    init() {
        // 皮肤
        this.item_0_active = `assets/images/block-mini/item-0-active${getBlock()}.png`
        this.item_1_active = `assets/images/block-mini/item-1-active${getBlock()}.png`
        this.item_1_active_no = `assets/images/block-mini/item-1-active-no${getBlock()}.png`

        // console.log('执行init');
        this.drawPlace()
        this.refreshTable()
        // this.drawTopButton();
        this.drawTableBg()
        this.startGame()
    }

    // 开启游戏
    startGame() {
        // 
        // 
        // this.topSp.zOrder = 4;

        // 缓动动画
        Tween.from(this.game_bg, { alpha: 0 }, 500).to(this.game_bg, { alpha: 1 }, 500)
        // 开启比赛
        // this.refreshTable();
        for (var i = 0; i < this.col; i++) {
            this.itemsSprite[i] = [];
            for (var j = 0; j < this.row; j++) {
                // 创建宫格舞台
                this.itemsSprite[i][j] = new Sprite();
                if (!this.itemsSprite) this.itemsSprite[i][j] = new Sprite();
                Laya.stage.addChild(this.itemsSprite[i][j]);
                this.itemsSprite[i][j].zOrder = 4;
            }
        }
        SoundManager.playSound("assets/music/load.mp3", 1, null, null, 5000);
        this.drawTipText();

        this.aniSplit = 2000 / this.row / this.col;

        setTimeout(() => {
            this.drawTable(true, true, true);
        }, 1500);

        // 4500ms 后转码完成
        setTimeout(() => {
            this.tipText.text = "   转码完成！"
            var timeLine = new TimeLine();
            this.topTextLine.destroy();
            this.numText.alpha = 1;
            this.drawTopButton();
        }, 3500)
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
        this.game_bg.loadImage('assets/images/game_bg1.png');
        this.game_bg.alpha = 0;
        this.game_bg.zOrder = 2;
        //添加键盘抬起事件
        Laya.stage.on(Event.KEY_UP, this, this.onKeyUp);
    }
    // 画背景色
    drawTableBg() {
        // 画中心的方块组背景
        this.table_bg = new Laya.Sprite();
        this.table_bg.size(750, 1334);//一定要设置size才能监控事件
        Laya.stage.addChild(this.table_bg);
        this.table_bg.alpha = 0.2
        this.table_bg.zOrder = 3;
        this.table_bg.on(Event.MOUSE_DOWN, this, this.onMouseDown);
        this.table_bg.on(Event.MOUSE_UP, this, this.onMouseUp);
        DRAW.drawRoundedRectangle(this.table_bg, this.x, this.y, this.tWidth, this.tHeight, this.gab, '#2f0048');
    }
    // 画顶部按钮
    drawTopButton() {
        // this.topSp = new Sprite();
        // Laya.stage.addChild(this.topSp);
        // this.topSp.graphics.drawRect(0, 0, 142, 106, "#4d2f8a");
        // 绘制刷新按钮
        this.refreshSp = new Sprite();
        Laya.stage.addChild(this.refreshSp);
        this.refresh
        this.refreshSp.loadImage('assets/images/refresh_btn.png');
        this.refreshSp.pos(578, 30);
        this.refreshSp.size(142, 106);
        this.refreshSp.on('click', this, this.refresh)
        this.refreshSp.alpha = 0;
        this.refreshSp.zOrder = 4;

        // 动画
        var timeLine = new TimeLine();
        timeLine.addLabel("move", 0).to(this.refreshSp, { alpha: 1 }, 500, null, 0)
        timeLine.play(0, false);

        // 绘制返回按钮
        this.returnSp = new Sprite();
        Laya.stage.addChild(this.returnSp);
        this.returnSp.loadImage('assets/images/return_btn.png');
        this.returnSp.pos(30, 30);
        this.returnSp.size(142, 106);

        this.returnSp.alpha = 0;
        this.returnSp.zOrder = 4;
        this.returnSp.on('click', this, this.returnHome);
        // 动画
        var timeLine2 = new TimeLine();
        timeLine2.addLabel("move", 0).to(this.returnSp, { alpha: 1 }, 500, null, 0)
        timeLine2.play(0, false);
    }
    // 画宫格
    drawTable(first = false, showAnimate = false, callback) {
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
                    }, showAnimate ? 100 : 250, Ease.circInOut, null, showAnimate ? i * this.aniSplit * this.row + j * this.aniSplit : 500)
                    Tween.to(this.itemsSprite[i][j], {
                        scaleY: 1,
                        scaleX: 1,
                        pivotX: this.iWidth * 0.5,
                        pivotY: this.iWidth * 0.5,
                        alpha: 1
                    }, showAnimate ? 100 : 250, Ease.circInOut, null, showAnimate ? i * this.aniSplit * this.row + j * this.aniSplit : 500)
                }

            }
            if (showAnimate) {
                // 播放音效
                let i = 1;
                SoundManager.playSound("assets/music/output.mp3", 1, null, null, 0);
                let soundInterval = setInterval(() => {
                    i++;
                    if (i >= this.col * this.row) clearInterval(soundInterval);
                    SoundManager.playSound("assets/music/output.mp3", 1, null, null, 0);
                }, this.aniSplit)
            } else {
                SoundManager.playSound("assets/music/load.mp3", 1, null, null, 5000);
            }
            if (callback) {
                setTimeout(() => {
                    this.drawTable(true, false);
                    setTimeout(() => {
                        this.isGaming = true;
                    }, 500)
                }, 2300)
            }
        } else {
            // 移动滑块
            if (!this.slideBlock) {
                this.slideBlock = new Sprite()
                Laya.stage.addChild(this.slideBlock);
                this.slideBlock.zOrder = 4;
                this.slideBlock.loadImage(this.item_1_active_no);
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

            this.drawItemBlock(this.pNow[1], this.pNow[0]);
            this.drawItemBlock(this.frontPostion[1], this.frontPostion[0]);
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
            url = this.arr[i][j].num == '0' ? this.item_0_active : (this.isLock ? this.item_1_active : this.item_1_active_no);
        } else if (this.arr[i][j].isUsed) {
            url = 'assets/images/item-1-lock.png'
        } else {
            url = this.arr[i][j].num == '0' ? 'assets/images/item-0.png' : 'assets/images/item-1.png';
        }
        this.itemsSprite[i][j].graphics.clear();
        this.itemsSprite[i][j].loadImage(url);
    }
    // 画顶部提示
    drawTipText() {
        this.numText = new Text();
        Laya.stage.addChild(this.numText);
        this.numText.text = gameData[this.level].num;
        this.numText.font = "din";
        this.numText.bold = true;
        this.numText.fontSize = 120;
        this.numText.width = 750;
        this.numText.zOrder = 4;
        this.numText.color = "#fde5cd"
        // this.numText.pivot(245, 0);
        this.numText.align = "center";
        this.numText.y = 48;
        this.numText.x = 0;
        this.numText.alpha = 0;
        this.topTextLine = new TimeLine();

        this.topTextLine.addLabel("move", 0).to(this.numText, { alpha: 1 }, 500, null, 0)
            .addLabel("move1", 0).to(this.numText, { alpha: 0.2 }, 500, null, 0)
        this.topTextLine.play(0, true);

        this.tipText = new Text()
        Laya.stage.addChild(this.tipText);
        this.tipText.text = "二进制转码中...";
        // this.tipText.font = "din";
        this.tipText.bold = true;
        this.tipText.fontSize = 40;
        this.tipText.width = 750;
        this.tipText.zOrder = 4;
        this.tipText.color = "#fde5cd"
        // this.tipText.pivot(245, 0);
        this.tipText.align = "center";
        this.tipText.y = 180;
        this.tipText.x = 0;
        this.tipText.alpha = 0;
        this.tipTextLine = new TimeLine();
        this.tipTextLine.addLabel("move", 0).to(this.tipText, { alpha: 0.8 }, 500, null, 1000)
        this.tipTextLine.play(0, false);
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
        // console.log(direction, moveX, moveY)
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

        this.numData = getNum(this.level).items;
        this.col = getNum(this.level).col;
        this.row = getNum(this.level).row;
        this.isLock = getNum(this.level).lock;

        let xArr = [150, 80, 40, 40, 40, 40, 40, 40];
        let yArr = [400, 300, 250, 250, 250, 250, 250, 250, 250]
        this.x = xArr[this.row - 2];
        this.y = yArr[this.col - 1];

        this.gab = 20 + (4 - this.row) * 5
        this.tWidth = 750 - 2 * this.x;//桌面宽度
        this.iWidth = (this.tWidth - (this.row + 1) * this.gab) / this.row;//单个的高度
        this.tHeight = this.iWidth * this.col - 1 + (this.col + 1) * this.gab;
        this.arr = [];
        for (var i = 0; i < this.col; i++) {
            this.arr[i] = [];
            for (var j = 0; j < this.row; j++) {
                this.arr[i][j] = this.numData[i * this.row + j];
            }
        }
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
        if (this.isLock) {
            this.arr[i][j].isUsed = this.arr[i][j].num == "1" ? true : false;
        }


        this.drawTable();
        // 播放滑动音效
        SoundManager.setSoundVolume(0.5);
        SoundManager.playSound("assets/music/dong.mp3", 1, null, null, 0);
    }
    // 判断是否失败以及成功
    judgeSuccess() {
        // 判断是否赢了的逻辑
        let isWin = this.arr.every(items => {
            return items.every(item => item.num == '1')
        })
        console.log(this.arr);
        if (isWin) {
            SoundManager.playSound("assets/music/win.mp3", 1, null, null, 5000);
            setTimeout(() => {
                this.showWin()
            }, 500)
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
                this.showFail();
            }
        }

    }
    // 重置游戏
    refresh(isFirst) {
        this.closeAlert()
        this.refreshTable()
        this.drawTable(true, null)
    }
    // 返回 Home
    returnHome() {
        $ob.emit('returnHome')
        this.clearPlaceAll()
        // new DrawHome()
    }
    // 清除所有画布的东西
    clearPlaceAll(iswin) {
        console.log('执行')
        console.log(this.winLine);
        // 清除动画

        if (iswin) {
            this.winLine.pause();
            this.winLine.destroy();
            // this.winMoveLine.destroy();
        }
        // 清除画布
        this.clearSp(this.game_bg);
        this.clearSp(this.table_bg, 0.5);
        // this.topSp.destroy();
        this.clearSp(this.refreshSp);
        this.clearSp(this.returnSp);
        this.clearSp(this.tipText);
        this.clearSp(this.numText);

        this.clearSp(this.slideBlock, 0.2);

        this.clearSp(this.failBgSp);
        this.clearSp(this.failMaskSp);
        this.clearSp(this.failRefresh);
        this.clearSp(this.failReturn);
        // debugger
        for (var i = 0; i < this.col; i++) {
            for (var j = 0; j < this.row; j++) {
                this.clearSp(this.itemsSprite[i][j], 0)
            }
        }
        // debugger
        this.slideBlock = ""
        // 事件监听失效
        this.isGaming = false;
    }
    // 封装clear的事件
    clearSp(sp, alpha = 1) {
        // console.log(sp);
        if (!sp) return;
        Tween.from(sp, { alpha: alpha }, 500).to(sp, { alpha: 0 }, 800);
        setTimeout(() => {
            sp.destroy()
        }, 1500);
    }
    // 输了的逻辑
    showFail() {
        SoundManager.playSound("assets/music/win.mp3", 1, null, null, 13);

        this.failMaskSp = new Sprite();
        this.failMaskSp.size(750, Browser.height);
        this.failMaskSp.loadImage('assets/images/alert_fail_mask.png')
        Laya.stage.addChild(this.failMaskSp);
        this.failMaskSp.zOrder = 5;
        this.failMaskSp.alpha = 0;
        Tween.to(this.failMaskSp, {
            alpha: 1
        }, 250, Ease.linearIn, null, 200)

        // 画卡片背景
        this.failBgSp = new Sprite();
        this.failBgSp.size(655, 558);
        Laya.stage.addChild(this.failBgSp);
        this.failBgSp.loadImage('assets/images/alert_fail_bg.png');
        this.failBgSp.pos(50, -550);
        this.failBgSp.zOrder = 6;
        this.failBgSp.alpha = 1;
        // 进入动画
        Tween.to(this.failBgSp, {
            y: 250,
            alpha: 1
        }, 550, Ease.bounceOut, null, 200)

        // 画返回按钮
        this.failReturn = new Sprite()
        this.failReturn.size(170, 126)
        Laya.stage.addChild(this.failReturn)
        this.failReturn.loadImage('assets/images/return_btn.png')
        this.failReturn.on('click', this, this.returnHome)
        this.failReturn.pos(900, 480)
        this.failReturn.zOrder = 7;
        this.failReturn.alpha = 1;

        Tween.to(this.failReturn, {
            x: 500,
        }, 550, Ease.bounceOut, null, 200)
        // 画重新按钮
        this.failRefresh = new Sprite()
        this.failRefresh.size(170, 126)
        Laya.stage.addChild(this.failRefresh)
        this.failRefresh.loadImage('assets/images/refresh_btn.png')
        this.failRefresh.on('click', this, this.refresh)
        this.failRefresh.pos(900, 650)
        this.failRefresh.zOrder = 7
        this.failRefresh.alpha = 1
        Tween.to(this.failRefresh, {
            x: 500,
        }, 550, Ease.strongIn, null, 100)
    }
    // 赢了的逻辑
    showWin() {
        console.log(this.pNow);
        this.tipText.text = "  TO ONE ！"
        // let x = this.pNow[x]
        let moveX = this.x + this.pNow[0] * (this.iWidth + this.gab) + this.gab, moveY = this.y + this.pNow[1] * (this.iWidth + this.gab) + this.gab;
        console.log(moveX, moveY);
        for (var i = 0; i < this.col; i++) {
            for (var j = 0; j < this.row; j++) {
                if (this.pNow[0] == j && this.pNow[1] == i) {
                    this.itemsSprite[i][j].on(Event.CLICK, this, this.clickToNext);
                    this.itemsSprite[i][j].loadImage('assets/images/item-enter.png');
                    this.itemsSprite[i][j].zOrder = 6;
                    this.winLine = new TimeLine();
                    this.winLine.addLabel('big', 0).to(this.itemsSprite[i][j], { scaleX: 1.1, scaleY: 1.1 }, 300, null, 300)
                        .addLabel('big', 0).to(this.itemsSprite[i][j], { scaleX: 1, scaleY: 1 }, 300, null, 300)
                    this.winLine.play(0, true);

                    this.clearSp(this.returnSp)
                    this.clearSp(this.refreshSp)
                    this.clearSp(this.table_bg, 0.8)

                } else {
                    Tween.to(this.itemsSprite[i][j], {
                        pivotX: this.iWidth * 0.5,
                        pivotY: this.iWidth * 0.5,
                        x: moveX + this.iWidth * 0.5,
                        y: moveY + this.iWidth * 0.5,
                        alpha: 0
                    }, 500)

                }

            }
        }
    }
    // 点击进入下一关
    clickToNext() {
        setTimeout(() => {
            this.clearPlaceAll(true);
        }, 500)
        SoundManager.playSound("assets/music/return-home.mp3", 1, null, null, 0);
        // 如果不是玩的以前的关卡
        if (this.level - 1 == Laya.LocalStorage.getItem('realLevel')) {
            Laya.LocalStorage.setItem('realLevel', this.level++)
            $ob.emit('nextGame', true);
        } else {
            $ob.emit('nextGame', false);
        }
    }
    //关闭弹窗
    closeAlert() {
        if (this.failBgSp) {
            this.failBgSp.destroy();
            this.failMaskSp.destroy();
            this.failRefresh.destroy();
            this.failReturn.destroy();
        }
    }
}