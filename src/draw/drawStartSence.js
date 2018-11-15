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
        // this.first_text = ""
        this.next_btn = ""
        this.next_top_btn = ""
        this.main = ""
        this.imgArr = [
            "main_1.png",
            "main_2.png",
            "main_3.png"
        ]
        this.isShowing = false

        this.timeout = ""
        this.showStartSence()
    }
    //显示0关
    showStartSence() {
        if (this.isShowing) return;

        this.timeLine = new TimeLine();
        this.lastTimeLine = new TimeLine();
        this.lastBtnTimeLine = new TimeLine();

        this.drawBg();
        SoundManager.setMusicVolume(0.1);
        SoundManager.playMusic("assets/music/troughts.mp3", 1, null, null, 13);
        this.isShowing = true;
    }

    /**
     * 绘制画布
     */

    // 绘制背景
    drawBg() {
        // 开始的场景
        this.sence_bg = new Laya.Sprite();
        this.sence_bg.size(750, Browser.height);
        Laya.stage.addChild(this.sence_bg);
        this.sence_bg.loadImage('assets/images/sence-0_bg.png');
        this.sence_bg.alpha = 0;
        this.sence_bg.zOrder = 1
        Tween.to(this.sence_bg, {
            alpha: 1
        }, 500, Ease.linearIn, null, 200)
        // 文字和图片的动画过场
        let i = 1;
        setTimeout(() => {
            this.drawImage(0)
            this.timeout = setInterval(() => {
                this.drawImage(i)
                i++;
                console.log(i, this.imgArr.length)
                if (i >= this.imgArr.length) {
                    clearInterval(this.timeout)
                }
            }, 7000);
        }, 2000)

        if (Laya.LocalStorage.getItem('realLevel') >= 0) {
            this.drawNextTopBtn();
        }
    }

    // 绘制当前场景图
    drawImage(index) {
        if (!this.main) {
            this.main = new Sprite();
            this.main.pos(10, 120);
            this.main.size(750, 1068);
            this.main.zOrder = 2;
            Laya.stage.addChild(this.main);
        }
        this.main.loadImage(`assets/images/main_${index + 1}.png`);
        this.main.alpha = 0;
        Tween.to(this.main, { alpha: 1 }, 800);
        if (index == this.imgArr.length - 1) {
            setTimeout(() => {
                this.drawNextBtn();
            }, 6000)
        }

        setTimeout(() => {
            Tween.to(this.main, { alpha: 0 }, 800);
        }, 6000)
    }

    // 绘制下一部按钮
    drawNextBtn() {
        this.next_btn = new Sprite();
        this.next_btn.pos(375, 800);
        this.next_btn.size(150, 150);
        this.next_btn.pivot(75, 75)
        Laya.stage.addChild(this.next_btn);
        this.next_btn.loadImage('assets/images/item-enter.png');
        this.next_btn.on(Event.CLICK, this, this.clickNext);
        this.next_btn.zOrder = 2;
        this.next_btn.alpha = 0;
        // 缓慢显示
        setTimeout(() => {
            Tween.to(this.next_btn, { alpha: 1 }, 800);
        }, 500)
        this.lastBtnTimeLine.addLabel("show", 0).to(this.next_btn, { scaleX: 1.05, scaleY: 1.05 }, 0, null, 500)
            .addLabel("show", 0).to(this.next_btn, { scaleX: 1, scaleY: 1 }, 500, null, 500)
        this.lastBtnTimeLine.play(0, true);
    }

    // 绘制跳过按钮
    drawNextTopBtn() {
        this.next_top_btn = new Sprite();
        this.next_top_btn.zOrder = 3;
        this.next_top_btn.alpha = 0;
        // DRAW.drawRoundedRectangle(this.next_top_btn, 0, 0, 150, 80, 40, '#fff');
        this.next_top_btn.loadImage('assets/images/pass_btn.png')
        this.next_top_btn.size(170, 92)
        this.next_top_btn.pos(540, 40)
        Laya.stage.addChild(this.next_top_btn)
        this.next_top_btn.on(Event.CLICK, this, this.clickNext);
        Tween.to(this.next_top_btn, {
            alpha: 1
        }, 700, Ease.linearIn, null, 1000)
    }

    // 点击进入下一关
    clickNext() {
        SoundManager.stopAll();
        
        clearInterval(this.timeout);
        
        this.timeLine.destroy();
        this.lastTimeLine.destroy();
        this.lastBtnTimeLine.destroy();
        
        this.clearSp(this.sence_bg)
        this.clearSp(this.main)
        this.clearSp(this.next_btn)
        this.clearSp(this.next_top_btn)
        this.isShowing = false;

        let realLevel = Laya.LocalStorage.getItem('realLevel');

        if (realLevel == -1) {
            Laya.LocalStorage.setItem('realLevel', 0);
            $ob.emit('nextGame', true);
        } else {
            $ob.emit('nextGame')
        }
    }

    clearSp(sp, alpha = 1) {
        console.log(sp);
        if (!sp) return;
        Tween.from(sp, { alpha: alpha }, 500).to(sp, { alpha: 0 }, 800);
        setTimeout(() => {
            sp.destroy()
        }, 1500);
    }

    /**
     * 逻辑处理
     */
}