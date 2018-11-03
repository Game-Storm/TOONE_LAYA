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
var HSlider = Laya.HSlider;
var GlowFilter = Laya.GlowFilter;

export default class DrawHome {
    constructor() {

        this.realLevel = "";
        this.gameLevel = "";
        this.GAME = ""

        // 绘制有关的属性
        this.game_bg = ""
        this.title = ""

        // 运行
        Laya.stage.bgColor = "#ded6df"
        this.init();
    }
    init() {
        // Laya.LocalStorage.setItem("item", str);
        Laya.LocalStorage.setItem("realLevel", 0.02);
        this.drawBg();
        this.drawCard();
    }

    /**
     * 绘制画布
     */

    // 绘制背景
    drawBg() {
        this.game_bg = new Laya.Sprite();
        this.game_bg.size(750, 1334);
        Laya.stage.addChild(this.game_bg);
        this.game_bg.loadImage('assets/images/game_bg.png');
        // 绘制标题
        this.title_sp = new Laya.Sprite();
        this.title_sp.size(344, 110);
        this.title_sp.pos(200, 86);
        Laya.stage.addChild(this.title_sp);
        this.title_sp.loadImage('assets/images/logo_title.png');

    }
    // 绘制中心卡片
    drawCard() {
        // 绘制背景
        var card_bg = new Laya.Sprite();
        card_bg.size(615, 817);
        card_bg.pos(68, 200);
        Laya.stage.addChild(card_bg);
        card_bg.loadImage('assets/images/card-bg.png');
        card_bg.on(Event.CLICK, this, this.startGame);
        //创建一个发光滤镜
        console.log(Laya)
        // var glowFilter = new GlowFilter("#8a68b3", 50, 10, 0);
        // var glowFilter1 = new GlowFilter("#8a68b3", 50, 0, 10);
        // var glowFilter2 = new GlowFilter("#8a68b3", 50, -10, 0);
        // var glowFilter3 = new GlowFilter("#8a68b3", 50, 0, -10);
        // //设置滤镜集合为发光滤镜
        // card_bg.filters = [glowFilter,glowFilter1,glowFilter2,glowFilter3];

        // 绘制文字
        // this.realLevel = Laya.LocalStorage.getItem("realLevel");
        var num = new Text();
        num.color = "#f9dfc7";
        num.font = "Impact";
        num.fontSize = 150;
        num.width = 590;
        // num.borderColor = "#FFFF00";
        num.x = 80;
        num.y = 670;
        num.align = "center";
        num.alpha = 0.8;
        Laya.stage.addChild(num);
        num.text = this.realLevel = Laya.LocalStorage.getItem("realLevel");

        // var card_animate=new Laya.Animation();
        // card_animate.loadAnimation('cardscale.ani');
        // // card_animate.pos(80,200);
        // card_animate.x=80;
        // card_animate.y=200;
        // Laya.stage.addChild(card_bg);
        // card_animate.play();

        // 绘制数字 
    }

    /**
     * 逻辑处理
     */
    // 进入关卡
    startGame(params) {
        this.GAME ? this.GAME.startGame() : this.GAME = new DrawGame();
    }
}