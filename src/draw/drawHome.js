// 主页相关逻辑以及总入口
import DRAW from '../lib/graphics';
import GameConfig from "../GameConfig";
import { getNum, gameData } from "../lib/gameData";
import DrawGame from "./drawPlace";
import DrawStartSence from './drawStartSence'
import DrawNumPass from './drawNumPass'
import DrawSkin from './drawSkin'

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
var Text = Laya.Text;
var GlowFilter = Laya.GlowFilter;
var TimeLine = Laya.TimeLine;

export default class DrawHome {
    constructor() {
        this.realLevel = ""
        this.gameLevel = ""
        this.GAME = ""
        this.StartSence = ""
        this.isHome = true
        this.drawSkin = ""

        // 绘制有关的属性
        this.game_bg = ""
        this.title = ""
        this.card_bg = ""
        this.num = ""
        this.card_bg_next = ""
        this.num_next = ""
        this.card_bg_top = ""
        this.num_top = ""

        this.left = ""
        this.right = ""
        this.refresh = ""
        this.level_text = ""
        this.progress_bg = ""
        this.progress_active = ""
        this.bottombtnlists = []
        this.bottombtnBg = []

        // 动画
        this.timeLine = ""
        this.timeLine2 = ""
        this.changeCard_timeline = ""
        this.changeNum_timeline = ""

        this.isAnimating = false;
        this.isgaming = false;

        // 运行
        Laya.stage.bgColor = "#ded6df"
        this.init()
    }
    init() {
        if (!Laya.LocalStorage.getItem("realLevel")) {
            Laya.LocalStorage.setItem("realLevel", -1);
            this.realLevel = -1;
        } else {
            this.realLevel = Number(Laya.LocalStorage.getItem("realLevel"))
        }

        this.drawBg();
        this.drawCard();

        if (this.realLevel >= 0) {
            this.drawBottomBtn();
            this.drawTopProgress();
            this.drawBottomFourBtn();
        }

        $ob.on('nextGame', [this.goNextGame, this]);
        // $ob.on('nextGame', [this.goNextGame, this]);
        $ob.on('returnHome', [this.returnHome, this]);

        this.initAnimate();
        SoundManager.autoStopMusic = false;
        SoundManager.setMusicVolume(0.6);
        SoundManager.playMusic('assets/music/steven.mp3', 0);

    }
    /**
     * 加载动画
     */
    initAnimate() {
    }

    /**
     * 绘制画布
     */

    // 绘制背景
    drawBg() {
        this.game_bg = new Laya.Sprite();
        console.log(Browser.height)
        this.game_bg.size(750, 1334);
        this.game_bg.top = 0;
        Laya.stage.addChild(this.game_bg);
        this.game_bg.loadImage('assets/images/home_bg.png');
        // 绘制标题
    }
    // 绘制中心卡片
    drawCard(next_url, text, color) {
        if (!this.card_bg) {
            // 绘制背景
            this.card_bg = new Laya.Sprite();
            this.card_bg.size(615, 817);
            this.card_bg.zOrder = 1;
            Laya.stage.addChild(this.card_bg);
            let url = "assets/images/card-bg.png";
            if (this.realLevel < 0) {
                url = "assets/images/card-0-bg.png"
            } else if (this.realLevel == gameData.length - 2) {
                url = "assets/images/card-1-active.png"
            }
            this.card_bg.loadImage(url);
            this.card_bg.on(Event.CLICK, this, this.startGame);
            // 卡片放大缩小动画 
            this.timeLine = new TimeLine();
            this.timeLine.addLabel("big", 0).to(this.card_bg, { scaleX: 1.07, scaleY: 1.05 }, 1500, null, 0)
                .addLabel("small", 0).to(this.card_bg, { scaleX: 1, scaleY: 1 }, 1500, null, 0);
            this.timeLine.play(0, true);
        } else {
            this.card_bg.loadImage(next_url);
        }
        this.card_bg.pos(375, 510);
        this.card_bg.pivot(307, 408);
        this.card_bg.rotation = 0;

        if (!this.num) {
            // 绘制文字
            this.num = new Text();
            this.num.color = "#f9dfc7";
            this.num.font = "din";
            this.num.bold = true;
            this.num.fontSize = 170;
            this.num.width = 590;
            this.num.align = "center";
            this.num.alpha = 0.8;
            this.num.zOrder = 1;
            // var glowFilter = new GlowFilter("#e5dac3", 13, 0, 0);
            // //设置滤镜集合为发光滤镜
            // this.num.filters = [glowFilter];
            Laya.stage.addChild(this.num);
            this.gameLevel = this.gameLevel == '' ? this.realLevel + 1 : this.gameLevel
            this.num.text = gameData[this.gameLevel].num;
            // 动画
            // 卡片文字放大缩小动画 
            this.timeLine2 = new TimeLine();
            this.timeLine2.addLabel("big", 0).to(this.num, { scaleX: 1.07, scaleY: 1.05 }, 1500, null, 0)
                .addLabel("small", 0).to(this.num, { scaleX: 1, scaleY: 1 }, 1500, null, 0)
            this.timeLine2.play(0, true);
        } else {
            this.num.color = color;
            this.num.text = text;
        }
        this.num.pivot(245, 0);
        this.num.x = 325;
        this.num.y = 610;
        this.num.rotation = 0;

    }
    // 绘制底部的卡片
    drawNextCard(card_url, text, color, isUp, symbol = -1) {
        // 绘制背景
        if (!this.card_bg_next) {
            this.card_bg_next = new Laya.Sprite();
            this.card_bg_next.size(615, 817);
            this.card_bg_next.pos(375, 510);
            this.card_bg_next.pivot(307, 408);
            Laya.stage.addChild(this.card_bg_next);
        }
        this.card_bg_next.loadImage(card_url);
        this.card_bg_next.alpha = 1;
        this.card_bg_next.zOrder = 0;
        if (!isUp) {
            this.card_bg_next.rotation = 50 * symbol;
            this.card_bg_next.x = 307 + 800 * symbol;
            this.card_bg_next.zOrder = 2;
        }

        // 绘制文字
        if (!this.num_next) {
            this.num_next = new Text();
            this.num_next.font = "din";
            this.num_next.bold = true;
            this.num_next.fontSize = 170;
            this.num_next.width = 590;
            this.num_next.pivot(245, 0);
            this.num_next.x = 325;
            this.num_next.y = 610;
            this.num_next.align = "center";
            this.num_next.alpha = 0.8;
            // var glowFilter = new GlowFilter("#e5dac3", 13, 0, 0);
            // //设置滤镜集合为发光滤镜
            // this.num_next.filters = [glowFilter];
            Laya.stage.addChild(this.num_next);
        }
        this.num_next.text = text;
        this.num_next.color = color;
        this.num_next.alpha = 1;
        this.num_next.zOrder = 0;
        if (!isUp) {
            this.num_next.x = 325 + 800 * symbol;
            this.num_next.rotation = 50 * symbol;
            this.num_next.zOrder = 2;
        }
    }
    // 绘制顶部进度条
    drawTopProgress() {

        this.progress_bg = new Sprite();
        this.progress_bg.graphics.drawRect(0, 0, 750, 30, '#a984ec');
        this.progress_bg.alpha = 0.5;
        Laya.stage.addChild(this.progress_bg);

        this.level_text = new Text();
        this.level_text.color = "ddc8fe"
        this.level_text.font = "din"
        this.level_text.fontSize = 40;
        this.level_text.width = 750;
        this.level_text.x = 0
        this.level_text.y = 70
        this.level_text.align = "center"
        this.level_text.text = `- ${this.gameLevel + 1} / ${gameData.length} -`
        Laya.stage.addChild(this.level_text);
        this.drawTopProgressActive();
    }
    drawTopProgressActive() {
        let aWidth = this.realLevel / (gameData.length - 1) * 750
        console.log(aWidth)
        this.progress_active = new Sprite();
        this.progress_active.graphics.drawCircle(aWidth, 15, 15, '#8e2f7e');
        this.progress_active.graphics.drawRect(0, 0, aWidth, 30, '#8e2f7e');
        // this.progress_active.size(100, 30);
        Laya.stage.addChild(this.progress_active);
    }
    //绘制底部按钮
    drawBottomBtn() {
        this.left = new Sprite();
        Laya.stage.addChild(this.left);
        this.left.loadImage('assets/images/home_left.png');
        this.left.size(122, 91);
        this.left.pos(138, 935);
        this.left.name = "left"
        this.left.on(Event.CLICK, this, this.changeLevel, [-1]);

        this.refresh = new Sprite()
        Laya.stage.addChild(this.refresh);
        this.refresh.loadImage('assets/images/refresh-card.png');
        this.refresh.size(157, 119);
        this.refresh.pos(288, 921)
        this.refresh.on(Event.CLICK, this, this.changeLevel);

        this.right = new Sprite()
        Laya.stage.addChild(this.right);
        this.right.loadImage('assets/images/home_right.png');
        this.right.size(122, 91);
        this.right.pos(473, 935);
        this.right.on(Event.CLICK, this, this.changeLevel, [1]);
    }
    // 绘制底部四个按钮
    drawBottomFourBtn() {
        this.bottombtnBg = new Sprite();
        this.bottombtnBg.graphics.drawRect(0, 1052, 750, 121, '#5e46a7');
        this.bottombtnBg.alpha = 0.5;
        Laya.stage.addChild(this.bottombtnBg);
        let imagesUrl = ['pifu-icon.png', 'music-icon.png', 'world-icon.png', 'my-icon.png'];
        // 音乐图标
        var musicControl = Laya.LocalStorage.getItem('music');
        if (musicControl == 'off') {
            SoundManager.muted = true;
            imagesUrl[1] = "music-icon-no.png"
        }
        for (let i = 0; i < 4; i++) {
            this.bottombtnlists[i] = new Sprite();
            this.bottombtnlists[i].size(112, 91);
            this.bottombtnlists[i].pos(90 + i * (40 + 112), 1072);
            this.bottombtnlists[i].loadImage('assets/images/' + imagesUrl[i]);
            Laya.stage.addChild(this.bottombtnlists[i]);
            this.bottombtnlists[i].on(Event.CLICK, this, this.clickBottomFour, [i + 1]);
        }
    }
    /**
     * 逻辑处理
     */
    // 进入关卡
    startGame(params) {
        console.log(this.isHome)
        if (!this.isHome) {
            return;
        }
        // console.log('ok')
        if (this.gameLevel > this.realLevel + 1) return;
        // console.log('ok')
        SoundManager.playSound("assets/music/dong.mp3", 1, null, null, 13);
        if (this.gameLevel == 0) {
            // 0关 初始场景
            this.StartSence = new DrawStartSence();
        } else if (this.gameLevel == gameData.length - 1) {
            // 1关 结束场景
        } else {
            // 正常关卡
            Laya.LocalStorage.setItem('gameLevel', this.gameLevel);

            if (this.GAME) {
                // this.GAME.startGame()
                this.GAME.init()
            } else {
                this.GAME = new DrawGame();
            }
        }
        this.isHome = false
    }
    // 切换关卡
    changeLevel(change) {
        // console.log('-------')
        console.log(change)
        if (this.isAnimating) return;
        let isUp = true;//是否是向下滑卡片？
        // 修改关卡
        if (change == -1) {
            if (this.gameLevel - 1 < 0) return;
            this.gameLevel--;
            isUp = false;
        } else if (change == 1) {
            if (this.gameLevel + 1 >= gameData.length) return;
            this.gameLevel++;
        } else {
            if (this.gameLevel == this.realLevel + 1) return;
            if (this.gameLevel > this.realLevel + 1) isUp = false
            this.gameLevel = this.realLevel + 1;
        }
        // 绘制底下的卡片
        let next_url = "", color = "", text = "";

        if (this.gameLevel - 1 > this.realLevel) {
            next_url = this.gameLevel == gameData.length - 1 ? "assets/images/card-1-lock.png" : "assets/images/card-bg-lock.png"
            color = '#514682'
            this.timeLine.pause();
            this.timeLine2.pause();
        } else {
            if (this.gameLevel == 0) {
                next_url = "assets/images/card-0-bg.png"
            } else if (this.gameLevel == gameData.length - 1) {
                next_url = "assets/images/card-1-active.png"
            } else {
                next_url = "assets/images/card-bg.png"
            }
            color = "#f9dfc7"
            this.timeLine.play(0, true);
            this.timeLine2.play(0, true);
        }
        text = gameData[this.gameLevel].num;

        // 变换效果
        // 卡片切换时的动效
        let symbol = this.gameLevel % 2 == 0 ? -1 : 1;

        this.drawNextCard(next_url, text, color, isUp, symbol);
        if (isUp) {
            this.changeCard_timeline = new TimeLine();
            this.changeCard_timeline.addLabel("big", 0).to(this.card_bg, { scaleX: 1.06, scaleY: 1.05, rotation: 10 * symbol, x: 390 }, 100, null, 0)
                .addLabel("small", 0).to(this.card_bg, { scaleX: 1, scaleY: 1, rotation: -50 * symbol, x: 307 - 800 * symbol }, 300, null, 0);
            // 卡片切换时文字动效
            this.changeNum_timeline = new TimeLine();
            this.changeNum_timeline.addLabel("big", 0).to(this.num, { scaleX: 1.06, scaleY: 1.05, rotation: 10 * symbol, x: 340 }, 100, null, 0)
                .addLabel("small", 0).to(this.num, { scaleX: 1, scaleY: 1, rotation: -50 * symbol, x: 325 - 800 * symbol }, 300, null, 0);
        } else {
            this.changeCard_timeline = new TimeLine();
            this.changeCard_timeline.addLabel("big", 0).to(this.card_bg_next, { scaleX: 1.06, scaleY: 1.05, rotation: -10 * symbol, x: 375 }, 300, null, 0)
                .addLabel("big", 0).to(this.card_bg_next, { scaleX: 1, scaleY: 1, rotation: 0, x: 375 }, 100, null, 0)
            // 卡片切换时文字动效
            this.changeNum_timeline = new TimeLine();
            this.changeNum_timeline.addLabel("big", 0).to(this.num_next, { scaleX: 1.06, scaleY: 1.05, rotation: -10 * symbol, x: 325 }, 300, null, 0)
                .addLabel("big", 0).to(this.num_next, { scaleX: 1, scaleY: 1, rotation: 0, x: 325 }, 100, null, 0)
        }

        this.changeCard_timeline.play(0, false);
        this.changeNum_timeline.play(0, false);
        this.isAnimating = true;

        // SoundManager.playSound("assets/music/shua.mp3", 1, null, null, 13);

        setTimeout(() => {
            this.level_text.text = `- ${this.gameLevel + 1} / ${gameData.length} -`;
            this.changeCard_timeline.pause();
            this.changeNum_timeline.pause();
            this.num_next.alpha = 0;
            this.card_bg_next.alpha = 0;
            this.num.zOrder = 1;
            this.card_bg.zOrder = 1;
            this.drawCard(next_url, text, color)
            this.isAnimating = false;
        }, 600)
    }
    // 回到首页进入下一关
    goNextGame(isNext) {
        this.isHome = true;
        // debugger
        if (this.gameLevel + 1 >= gameData.length) return;
        this.realLevel = Number(Laya.LocalStorage.getItem('realLevel'))
        // 说明是刚解锁新的关卡需要一个转换的动画
        if (isNext) {
            this.gameLevel++;
            // 创建卡片飞出去的效果
            let symbol = this.gameLevel % 2 == 0 ? 1 : -1;
            this.changeCard_timeline = new TimeLine();
            this.changeCard_timeline.addLabel("big", 0).to(this.card_bg, { scaleX: 1.06, scaleY: 1.05, rotation: 10 * symbol, x: 390 }, 100, null, 0)
                .addLabel("small", 0).to(this.card_bg, { scaleX: 1, scaleY: 1, rotation: -50 * symbol, x: 307 - 1000 * symbol }, 200, null, 0);
            // 卡片切换时文字动效
            this.changeNum_timeline = new TimeLine();
            this.changeNum_timeline.addLabel("big", 0).to(this.num, { scaleX: 1.06, scaleY: 1.05, rotation: 10 * symbol, x: 340 }, 100, null, 0)
                .addLabel("small", 0).to(this.num, { scaleX: 1, scaleY: 1, rotation: -50 * symbol, x: 325 - 1000 * symbol }, 200, null, 0);
            //绘制下一关的卡片 
            if (gameData[this.gameLevel].num == 1) {
                this.drawNextCard('assets/images/card-1-lock.png', gameData[this.gameLevel].num, '#514682', symbol)
            } else {
                this.drawNextCard('assets/images/card-bg-lock.png', gameData[this.gameLevel].num, '#514682', symbol)
            }

            // SoundManager.playSound("assets/music/zhuanchang.mp3", 1, null, null, 13);
            setTimeout(() => {
                this.changeCard_timeline.play(0, false);
                this.changeNum_timeline.play(0, false);
                this.isAnimating = true;
                SoundManager.playSound("assets/music/shua.mp3", 1, null, null, 13);
            }, 500);
            // 动画渐变

            let showWinCardLine = new TimeLine();
            let showWinNumLine = new TimeLine();
            showWinCardLine.addLabel('show', 0).to(this.card_bg, { alpha: 1 }, 500, null, 0);
            showWinNumLine.addLabel('show', 0).to(this.num, { alpha: 1 }, 500, null, 0);

            setTimeout(() => {
                SoundManager.playSound("assets/music/dianzi.mp3", 1, null, null, 13);
            }, 1700)

            setTimeout(() => {
                if (gameData[this.gameLevel].num == 1) {
                    this.drawCard('assets/images/card-1-active.png', gameData[this.gameLevel].num, '#f9dfc7');
                } else {
                    this.drawCard('assets/images/card-bg.png', gameData[this.gameLevel].num, '#f9dfc7');
                }
                this.card_bg.alpha = 0;
                this.num.alpha = 0;
                this.num.zOrder = 1;
                this.card_bg.zOrder = 1;
                showWinNumLine.play(0, false);
                showWinCardLine.play(0, false);
                this.drawTopProgressActive();
                if (this.realLevel == 0) {
                    this.drawBottomBtn();
                    this.drawTopProgress();
                    this.drawBottomFourBtn();
                }
            }, 2000);

            setTimeout(() => {
                // 这里缺一个进度条前进
                this.level_text.text = `- ${this.gameLevel + 1} / ${gameData.length} -`
                this.num_next.alpha = 0;
                this.card_bg_next.alpha = 0;
                this.isAnimating = false;
            }, 3000)
        } else {
            // this.card_bg.loadImage( 'assets/images/card-bg.png')
            this.num.alpha = 1
            this.timeLine.play(0, true)
            this.timeLine2.play(0, true)
        }
    }
    // 点击底部四个按钮
    clickBottomFour(i) {
        console.log(i)
        if (i == 1) {
            // 进入皮肤管理页
            this.drawSkin = new DrawSkin()
        } else if (i == 2) {
            // 音乐控制
            var stopMusic = Laya.LocalStorage.getItem('music');
            console.log(stopMusic);
            // console.log(!Boolean(stopMusic));
            if (stopMusic == 'off') {
                // 开启音乐
                this.bottombtnlists[1].loadImage('assets/images/music-icon.png');
                Laya.LocalStorage.setItem('music', "on");
                SoundManager.muted = false;
            } else {
                // 关闭音乐
                console.log('开启')
                this.bottombtnlists[1].loadImage('assets/images/music-icon-no.png');
                Laya.LocalStorage.setItem('music', "off");
                SoundManager.muted = true;
            }

        } else if (i == 3) {
            this.StartSence = new DrawStartSence();
        } else if (i == 4) {
        }
        this.isHome = false
    }
    // 返回主页
    returnHome() {
        this.isHome = true;
        SoundManager.playSound("assets/music/dong.mp3", 1, null, null, 13);
        SoundManager.playMusic('assets/music/steven.mp3', 0)
        // debugger
    }
}