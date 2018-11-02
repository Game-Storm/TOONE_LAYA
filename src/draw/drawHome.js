// 主页相关逻辑

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
var Tween = Laya.Tween;
var Ease = Laya.Ease;
var SoundManager = Laya.SoundManager;

export default class DrawGame {
    constructor() {
        // 绘图相关的属性
        // 运行
        Laya.stage.bgColor="#ded6df"
        this.init();
    }
    init() {
        // this.drawCard();
        Laya.loader.load("res/atlas/assets/images.atlas", Laya.Handler.create(this, this.drawCard));
    }
    /**
     * 绘制画布
     */

    // 绘制中心卡片
    drawCard() {
        var card_bg = new Laya.Sprite();
        // card_bg.size(590, 820);
        // card_bg.pos(80,200)
        // Laya.stage.addChild(card_bg);
        // card_bg.loadImage('assets/images/card.png');

        var card_animate=new Laya.Animation();
        card_animate.loadAnimation('cardscale.ani');
        // card_animate.pos(80,200);
        card_animate.x=80;
        card_animate.y=200;
        Laya.stage.addChild(card_bg);
        card_animate.play();

        
    }

    /**
     * 逻辑处理
     */
}