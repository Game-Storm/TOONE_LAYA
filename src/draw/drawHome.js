// 主页相关逻辑以及总入口
import DRAW from '../lib/graphics';
import GameConfig from "../GameConfig";
import { getNum } from "../lib/gameData";
import DrawGame from "./drawPlace";

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

        // 绘制有关的属性
        this.game_bg = ""
        this.title = ""
        this.card_bg = ""
        this.num = ""
        this.left_card = ""
        this.right_card = ""
        this.slider_bg = ""
        this.slider_active = ""

        // 运行
        Laya.stage.bgColor = "#ded6df"
        this.init()
    }
    init() {
        // Laya.LocalStorage.setItem("item", str);
        Laya.LocalStorage.setItem("realLevel", 0.02);
        this.drawBg();
        this.drawCard();
        this.drawSliderBar()
    }

    /**
     * 绘制画布
     */

    // 绘制背景
    drawBg() {
        this.game_bg = new Laya.Sprite();
        this.game_bg.size(750, 1334);
        Laya.stage.addChild(this.game_bg);
        this.game_bg.loadImage('assets/images/home_bg.png');
        // 绘制标题
        this.title_sp = new Laya.Sprite();
        this.title_sp.size(344, 110);
        this.title_sp.pos(200, 46);
        Laya.stage.addChild(this.title_sp);
        this.title_sp.loadImage('assets/images/logo_title.png');
    }
    // 绘制中心卡片
    drawCard() {
        // 绘制背景
        this.card_bg = new Laya.Sprite();
        this.card_bg.size(615, 817);
        this.card_bg.pos(375, 608);
        this.card_bg.pivot(307, 408);
        Laya.stage.addChild(this.card_bg);
        this.card_bg.loadImage('assets/images/card-bg.png');
        this.card_bg.on(Event.CLICK, this, this.startGame);

        // 绘制文字
        // this.realLevel = Laya.LocalStorage.getItem("realLevel");
        this.num = new Text();
        this.num.color = "#f9dfc7";
        this.num.font = "Impact";
        this.num.fontSize = 150;
        this.num.width = 590;
        this.num.pivot(245, 0);
        this.num.x = 80 + 245;
        this.num.y = 670;
        this.num.align = "center";
        this.num.alpha = 0.8;
        // this.num.zOrder=1;
        Laya.stage.addChild(this.num);
        this.num.text = this.realLevel = Laya.LocalStorage.getItem("realLevel");
        // 放大缩小动画
        var timeLine = new TimeLine();
        timeLine.addLabel("big", 0).to(this.card_bg, { scaleX: 1.05, scaleY: 1.05 }, 1500, null, 0)
            .addLabel("small", 0).to(this.card_bg, { scaleX: 1, scaleY: 1 }, 1500, null, 0)
        timeLine.play(0, true);
        var timeLine2 = new TimeLine();
        timeLine2.addLabel("big", 0).to(this.num, { scaleX: 1.05, scaleY: 1.05 }, 1500, null, 0)
            .addLabel("small", 0).to(this.num, { scaleX: 1, scaleY: 1 }, 1500, null, 0)
        timeLine2.play(0, true);
        this.drawSideCard();
    }

    // 绘制旁边两侧的卡片
    drawSideCard() {
        // 绘制左侧卡片
        // this.left_card = new Laya.Sprite();
        // this.left_card.size(460, 638);
        // this.left_card.pos(-190, 608);
        // this.left_card.pivot(230, 319);
        // Laya.stage.addChild(this.left_card);
        // this.left_card.loadImage('assets/images/card.png');
        // this.left_card.on(Event.CLICK, this, this.startGame);

        this.right_card = new Laya.Sprite();
        this.right_card.size(460, 638);
        this.right_card.pos(940, 608);
        this.right_card.pivot(230, 319);
        Laya.stage.addChild(this.right_card);
        this.right_card.loadImage('assets/images/card.png');

        setTimeout(() => {
            this.cardAnimate()
        }, 1000)
    }
    // 绘制底部滑块
    drawSliderBar() {
        this.slider_bg = new Sprite();
        Laya.stage.addChild(this.slider_bg)
        DRAW.drawRoundedRectangle(this.slider_bg, 100, 1100, 550, 30, 15, '#2f0048,#ffffff,#00ffff,#ff00ff');
    }
    // 卡片滑动时的效果
    cardAnimate() {
        // var timeLine = new TimeLine();
        // timeLine.addLabel("big", 0).to(this.card_bg, { scaleX: 0.8, scaleY: 0.8, x: -190 }, 2000, null, 0)
        // timeLine.play(0, true);

        // var timeLine2 = new TimeLine();
        // timeLine2.addLabel("big", 0).to(this.right_card, { scaleX: 1.1, scaleY: 1.1, x: 375 }, 2000, null, 0)
        // timeLine2.play(0, true);

        // var timeLine3 = new TimeLine();
        // timeLine3.addLabel("big", 0).to(this.num, { scaleX: 0.8, scaleY: 0.8, x: -190 }, 2000, null, 0)
        // timeLine3.play(0, true);
    }
    /**
     * 逻辑处理
     */
    // 进入关卡
    startGame(params) {
        this.GAME ? this.GAME.startGame() : this.GAME = new DrawGame();
        SoundManager.playSound("assets/music/dong.mp3", 1, null, null, 13);
    }
}