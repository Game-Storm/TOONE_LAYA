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
        // sprite
        this.sence_bg = ""
        this.first_text = ""
        this.textArr = [
            "18世纪\n德国数理哲学大师莱布尼兹发现了二进制",
            "这个由0和1组成的数字电路\n打开了一个奇幻而精分的世界",
            "由于特殊的算法\n在这个二进制世界里",
            "一个简单的小数会被编译成无限的0和1",
            "而这些无限的0和1\n就是你要面临的每重关卡",
            "记住,你要不留余力的达到最大值",
            "试试看，\n也许你能得到不一样的东西",
            "FROM ZERO",
            "TO ONE",
        ]
        this.init()
    }
    init() {
        // Laya.LocalStorage.setItem("item", str);
        this.drawBg();
        SoundManager.setSoundVolume(0.1);
        SoundManager.playSound("assets/music/troughts.mp3", 1, null, null, 13);
        Laya.LocalStorage.setItem("realLevel", 0.02);
    }

    /**
     * 绘制画布
     */

    // 绘制背景
    drawBg() {
        // 开始的场景
        this.sence_bg = new Laya.Sprite();
        this.sence_bg.size(750, 1334);
        Laya.stage.addChild(this.sence_bg);
        this.sence_bg.loadImage('assets/images/sence-0_bg.png');
        this.sence_bg.alpha = 0;
        Tween.to(this.sence_bg, {
            alpha: 1
        }, 500, Ease.linearIn, null, 200)
        // 文字的动画过场
        this.drawText(this.textArr[0]);
        let i = 1;
        let textInterval = setInterval(() => {
            if (i >= this.textArr.length - 1) clearInterval(textInterval)
            this.drawText(this.textArr[i]);
            i++;
        }, 5000)
    }
    drawText(textContent) {
        this.first_text = new Text()
        this.first_text.color = "#fff"
        this.first_text.fontSize = 35
        this.first_text.width = 600;
        this.first_text.align = "center";
        this.first_text.leading = 20;
        this.first_text.x = 75
        this.first_text.y = 200
        this.first_text.alpha = 0;
        // this.first_text.text = "18世纪\n德国数理哲学大师莱布尼兹发现了二进制"
        this.first_text.text = textContent;
        Laya.stage.addChild(this.first_text)
        
        var timeLine = new TimeLine();
        timeLine.addLabel("show", 0).to(this.first_text, { alpha: 1 }, 1000, null, 1000)
            .addLabel("hidden", 0).to(this.first_text, { alpha: 0 }, 1000, null, 2000)
        timeLine.play(0, false);
    }
    /**
     * 逻辑处理
     */
}