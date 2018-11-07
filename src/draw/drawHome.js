// 主页相关逻辑以及总入口
import DRAW from '../lib/graphics';
import GameConfig from "../GameConfig";
import { getNum, gameData } from "../lib/gameData";
import DrawGame from "./drawPlace";
import DrawStartSence from './drawStartSence'

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

        // 绘制有关的属性
        this.game_bg = ""
        this.title = ""
        this.card_bg = ""
        this.num = ""
        this.left = ""
        this.right = ""
        this.left_more = ""
        this.right_more = ""
        this.level_text = ""
        this.progress_bg = ""
        this.progress_active = ""

        // 动画
        this.timeLine = ""
        this.timeLine2 = ""

        // 运行
        Laya.stage.bgColor = "#ded6df"
        this.init()
    }
    init() {
        // 
        // Laya.LocalStorage.setItem("realLevel", 0);
        if (!Laya.LocalStorage.getItem("realLevel")) {
            Laya.LocalStorage.setItem("realLevel", 0);
            this.realLevel = 0;
        } else {
            this.realLevel = Number(Laya.LocalStorage.getItem("realLevel"))
        }
        this.drawBg();
        this.drawCard();
        this.drawBottomBtn();
        this.drawTopProgress();
        $ob.on('nextGame', [this.goNextGame, this]);
    }
    /**
     * 绘制画布
     */

    // 绘制背景
    drawBg() {
        this.game_bg = new Laya.Sprite();
        this.game_bg.size(750, 1334);
        Laya.stage.addChild(this.game_bg);
        this.game_bg.loadImage(GameConfig.host + 'assets/images/home_bg.png');
        // 绘制标题
    }
    // 绘制中心卡片
    drawCard() {
        // 绘制背景
        this.card_bg = new Laya.Sprite();
        this.card_bg.size(615, 817);
        this.card_bg.pos(375, 540);
        this.card_bg.pivot(307, 408);
        Laya.stage.addChild(this.card_bg);
        this.card_bg.loadImage(GameConfig.host + 'assets/images/card-bg.png');
        this.card_bg.on(Event.CLICK, this, this.startGame);

        // 绘制文字
        this.num = new Text();
        this.num.color = "#f9dfc7";
        this.num.font = "din";
        this.num.bold = true;
        this.num.fontSize = 170;
        this.num.width = 590;
        this.num.pivot(245, 0);
        this.num.x = 325;
        this.num.y = 640;
        this.num.align = "center";
        this.num.alpha = 0.8;
        // this.num.zOrder=1;
        Laya.stage.addChild(this.num);
        this.gameLevel = this.gameLevel == '' ? this.realLevel + 1 : this.gameLevel
        // console.log(this.gameLevel, gameData[this.gameLevel])
        this.num.text = gameData[this.gameLevel].num
        // 放大缩小动画 
        this.timeLine = new TimeLine();
        this.timeLine.addLabel("big", 0).to(this.card_bg, { scaleX: 1.07, scaleY: 1.05 }, 1500, null, 0)
            .addLabel("small", 0).to(this.card_bg, { scaleX: 1, scaleY: 1 }, 1500, null, 0)
        this.timeLine.play(0, true);
        this.timeLine2 = new TimeLine();
        this.timeLine2.addLabel("big", 0).to(this.num, { scaleX: 1.07, scaleY: 1.05 }, 1500, null, 0)
            .addLabel("small", 0).to(this.num, { scaleX: 1, scaleY: 1 }, 1500, null, 0)
        this.timeLine2.play(0, true);
        // this.drawSideCard();
    }
    // 绘制顶部进度条
    drawTopProgress() {
        this.progress_bg = new Sprite();
        this.progress_bg.graphics.drawRect(0, 0, 750, 30, '#a984ec');
        this.progress_bg.alpha = 0.5
        Laya.stage.addChild(this.progress_bg);

        this.level_text = new Text();
        this.level_text.color = "ddc8fe"
        this.level_text.font = "din"
        this.level_text.fontSize = 40;
        this.level_text.width = 750;
        this.level_text.x = 0
        this.level_text.y = 80
        this.level_text.align = "center"
        this.level_text.text = `- ${this.gameLevel + 1} / ${gameData.length} -`
        Laya.stage.addChild(this.level_text);
    }
    //绘制底部按钮
    drawBottomBtn() {
        this.left_more = new Sprite()
        Laya.stage.addChild(this.left_more);
        this.left_more.loadImage(GameConfig.host + 'assets/images/home_left_more.png');
        this.left_more.size(122, 91);
        this.left_more.pos(94, 975)

        this.left = new Sprite();
        Laya.stage.addChild(this.left);
        this.left.loadImage(GameConfig.host + 'assets/images/home_left.png');
        this.left.size(122, 91);
        this.left.pos(241, 975);
        this.left.name = "left"
        this.left.on(Event.CLICK, this, this.changeLevel);

        this.right = new Sprite()
        Laya.stage.addChild(this.right);
        this.right.loadImage(GameConfig.host + 'assets/images/home_right.png');
        this.right.size(122, 91);
        this.right.pos(388, 975);
        this.right.on(Event.CLICK, this, this.changeLevel);

        this.right_more = new Sprite()
        Laya.stage.addChild(this.right_more);
        this.right_more.loadImage(GameConfig.host + 'assets/images/home_right_more.png');
        this.right_more.size(122, 91);
        this.right_more.pos(535, 975);
    }
    /**
     * 逻辑处理
     */
    // 进入关卡
    startGame(params) {
        if (!this.isHome) {
            return;
        }
        if (this.gameLevel > this.realLevel + 1) return;
        if (this.gameLevel == 0) {
            // 0关 初始场景
            this.StartSence ? this.StartSence.showStartSence() : this.StartSence = new DrawStartSence()
        } else if (this.gameLevel == gameData.length - 1) {
            // 1关 结束场景
        } else {
            // 正常关卡
            Laya.LocalStorage.setItem('gameLevel', this.gameLevel);
            if (this.GAME) {
                this.GAME.startGame()
            } else {
                this.GAME = new DrawGame();
                console.log(this.GAME);
                // this.GAME.level=6;
                // console.log(this.GAME);
            }
        }
        // this.isHome = false
        SoundManager.playSound(GameConfig.host + "assets/music/dong.mp3", 1, null, null, 13);
    }
    // 切换关卡
    changeLevel(e) {
        // console.log(Laya.stage.mouseX)
        let x = Laya.stage.mouseX
        if (x < 240) {
            // this.gameLevel--;
            // this.num.text = gameData[this.gameLevel].num
        } else if (x < 380) {
            if (this.gameLevel - 1 < 0) return;
            this.gameLevel--;
            this.num.text = gameData[this.gameLevel].num
        } else if (x < 530) {
            if (this.gameLevel + 1 >= gameData.length) return;
            this.gameLevel++;
            this.num.text = gameData[this.gameLevel].num
        } else {
            // this.gameLevel++;
            // this.num.text = gameData[this.gameLevel].num
        }

        this.level_text.text = `- ${this.gameLevel + 1} / ${gameData.length} -`
        console.log(this.gameLevel, this.realLevel);
        if (this.gameLevel - 1 > this.realLevel) {
            this.card_bg.loadImage(GameConfig.host + 'assets/images/card-bg-lock.png');
            this.num.alpha = 0.5;
            this.timeLine.pause();
            this.timeLine2.pause();
        } else {
            this.card_bg.loadImage(GameConfig.host + 'assets/images/card-bg.png')
            this.num.alpha = 1
            this.timeLine.play(0, true)
            this.timeLine2.play(0, true)
        }
        // 变换效果
        var timeLine2 = new TimeLine();
        timeLine2.addLabel("big", 0).to(this.num, { scaleX: 1.06, scaleY: 1.05, alpha: 0.5 }, 100, null, 0)
            .addLabel("small", 0).to(this.num, { scaleX: 1, scaleY: 1, alpha: 1 }, 100, null, 0)
        timeLine2.play(0, false);

    }
    // 进入下一关
    goNextGame() {
        // changeLevel(530);
        if (this.gameLevel + 1 >= gameData.length) return;
        this.gameLevel++;
        this.realLevel = Number(Laya.LocalStorage.getItem('realLevel'))
        // 说明是刚解锁新的关卡需要一个转换的动画
        if (this.gameLevel > this.realLevel) {
            setTimeout(() => {
                this.level_text.text = `- ${this.gameLevel + 1} / ${gameData.length} -`
                this.num.text = gameData[this.gameLevel].num
                this.card_bg.loadImage(GameConfig.host + 'assets/images/card-bg.png');
                this.num.alpha = 0.8;
                this.timeLine.play(0, true);
                this.timeLine2.play(0, true);
            }, 500)
        } else {
            // this.card_bg.loadImage(GameConfig.host + 'assets/images/card-bg.png')
            // this.num.alpha = 1
            // this.timeLine.play(0, true)
            // this.timeLine2.play(0, true)
        }
        // 变换效果
        // var timeLine2 = new TimeLine();
        // timeLine2.addLabel("big", 0).to(this.num, { scaleX: 1.06, scaleY: 1.05, alpha: 0.5 }, 100, null, 0)
        //     .addLabel("small", 0).to(this.num, { scaleX: 1, scaleY: 1, alpha: 1 }, 100, null, 0)
        // timeLine2.play(0, false);
    }
}