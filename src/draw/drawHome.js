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

export default class DrawHome {
    constructor() {

        this.realLevel = "";
        this.gameLevel = "";

        // 运行
        Laya.stage.bgColor = "#ded6df"
        this.init();
    }
    init() {
        // this.drawCard();
        // 读取数据缓存
        // var data = { "index": 0, "index1": 1 };
        // var str = JSON.stringify(data);
        // Laya.LocalStorage.setItem("item", str);
        Laya.LocalStorage.setItem("realLevel", 0.12);
        // Laya.loader.load("res/atlas/assets/images.atlas", Laya.Handler.create(this, this.drawCard));
        this.drawCard();
    }

    /**
     * 绘制画布
     */

    // 绘制中心卡片
    drawCard() {
        // 绘制背景
        var card_bg = new Laya.Sprite();
        card_bg.size(590, 820);
        card_bg.pos(80, 200)
        Laya.stage.addChild(card_bg);
        card_bg.loadImage('assets/images/card-bg.png');
        card_bg.on(Event.CLICK, this, this.startGame);

        // 绘制文字
        // this.realLevel = Laya.LocalStorage.getItem("realLevel");
        var num = new Text();
        num.color = "#f9dfc7";
        num.font = "Impact";
        num.fontSize = 180;
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
        let GAME = new DrawGame();
    }
}