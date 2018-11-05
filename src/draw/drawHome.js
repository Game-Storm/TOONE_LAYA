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
        this.isHome = true

        // 绘制有关的属性
        this.game_bg = ""
        this.title = ""
        this.card_bg = ""
        this.num = ""
        this.left_card = ""
        this.right_card = ""
        this.slider_bg = ""
        this.slider_bar = ""
        this.slider_active = ""

        // 运行
        Laya.stage.bgColor = "#ded6df"
        this.init()
    }
    init() {
        // Laya.LocalStorage.setItem("item", str);
        Laya.LocalStorage.setItem("realLevel", 0);
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
        this.title_sp.pos(200, 30);
        Laya.stage.addChild(this.title_sp);
        this.title_sp.loadImage('assets/images/logo_title.png');
    }
    // 绘制中心卡片
    drawCard() {
        // 绘制背景
        this.card_bg = new Laya.Sprite();
        this.card_bg.size(615, 817);
        this.card_bg.pos(375, 558);
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
        this.num.x = 325;
        this.num.y = 620;
        this.num.align = "center";
        this.num.alpha = 0.8;
        // this.num.zOrder=1;
        Laya.stage.addChild(this.num);
        this.num.text = this.realLevel = Laya.LocalStorage.getItem("realLevel");
        // 放大缩小动画
        var timeLine = new TimeLine();
        timeLine.addLabel("big", 0).to(this.card_bg, { scaleX: 1.08, scaleY: 1.05 }, 1500, null, 0)
            .addLabel("small", 0).to(this.card_bg, { scaleX: 1, scaleY: 1 }, 1500, null, 0)
        timeLine.play(0, true);
        var timeLine2 = new TimeLine();
        timeLine2.addLabel("big", 0).to(this.num, { scaleX: 1.08, scaleY: 1.05 }, 1500, null, 0)
            .addLabel("small", 0).to(this.num, { scaleX: 1, scaleY: 1 }, 1500, null, 0)
        timeLine2.play(0, true);
        this.drawSideCard();
    }

    // 绘制旁边两侧的卡片
    drawSideCard() {
        setTimeout(() => {
            this.cardAnimate()
        }, 1000)
    }
    // 绘制底部滑块
    drawSliderBar() {
        this.slider_bg = new Sprite();
        Laya.stage.addChild(this.slider_bg);
        DRAW.drawRoundedRectangle(this.slider_bg, 0, 0, 550, 30, 15, '#2f0048,#ffffff,#00ffff,#ff00ff');
        this.slider_bg.size(550, 30);
        this.slider_bg.pos(100, 1050)

        this.slider_bar = new Sprite();
        DRAW.drawRoundedRectangle(this.slider_bar, 0, 0, 80, 60, 10, "#aaa");
        this.slider_bar.pos(100, 1035);
        this.slider_bar.size(80, 60);
        Laya.stage.addChild(this.slider_bar);
        this.slider_bar.on(Event.MOUSE_MOVE, this, this.mouseMoveBar)
    }
    // 滑动轨道的逻辑
    mouseMoveBar(params) {
        console.log(Laya.stage.mouseX)
        if (Laya.stage.mouseX < 100 || Laya.stage.mouseX > 650) return;
        this.slider_bar.x = Laya.stage.mouseX - 30;
        let nowNum = this.realLevel = ((Laya.stage.mouseX - 100) / 550).toFixed(2);
        // let gameData = getGameData()

        // console.log(nowNum, this.judgeSplitNum(nowNum, gameData.length))
        let index = this.judgeSplitNum(nowNum, gameData.length);
        let showData = gameData[index];
        if (index && this.num.text != showData.num) {
            this.num.text = showData.num;
            Laya.LocalStorage.setItem('realLevel', showData.num);
            var timeLine = new TimeLine();
            timeLine.addLabel("big", 0).to(this.card_bg, { scaleX: 1.1, scaleY: 1.1, rotation: Math.random() > 0.5 ? -1 : 1 }, 10, null, 0)
                // .addLabel("rotation", 0).to(this.card_bg, { scaleX: 1.1, scaleY: 1.05, rotation: -1 }, 7, null, 0)
                .addLabel("small", 0).to(this.card_bg, { scaleX: 1, scaleY: 1, rotation: 0 }, 10, null, 0)
            timeLine.play(0, false);
            var timeLine2 = new TimeLine();
            timeLine2.addLabel("big", 0).to(this.num, { scaleX: 1.1, scaleY: 1.1, alpha: 0.5 }, 10, null, 0)
                // .addLabel("color", 0).to(this.num, { scaleX: 1.05, scaleY: 1.05 }, 10, null, 0)
                .addLabel("small", 0).to(this.num, { scaleX: 1, scaleY: 1, alpha: 1 }, 10, null, 0)
            timeLine2.play(0, false);
        }

        // if (nowNum in gameData) {

        // }
    }
    judgeSplitNum(nowNum, length) {
        let split = 1 / length;
        for (let i = 0; i < length; i++) {
            let temp = i * split
            if (Math.abs(nowNum - temp) < 0.05) {
                return i;
                break;
            }
        }
        return null
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
        if (!this.isHome) {
            return;
        }
        if (this.realLevel == 0) {
            // 0关 初始场景
            console.log('ok')
            new DrawStartSence()

        } else if (this.realLevel == 1) {
            // 1关 结束场景
        } else {
            // 正常关卡
            this.GAME ? this.GAME.startGame() : this.GAME = new DrawGame();
        }
        // this.isHome = false
        // SoundManager.playSound("assets/music/dong.mp3", 1, null, null, 13);
    }
}