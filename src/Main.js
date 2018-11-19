import DrawGame from './draw/drawPlace'
import DrawHome from './draw/drawHome'
import GameConfig from './GameConfig';
import DRAW from './lib/graphics';

(function () {
    var Sprite = Laya.Sprite;
    var Stage = Laya.Stage;
    var Texture = Laya.Texture;
    var Browser = Laya.Browser;
    var Handler = Laya.Handler;
    var WebGL = Laya.WebGL;
    var Event = Laya.Event;
    var Loader = Laya.Loader;
    var SoundManager = Laya.SoundManager;

    // var pageWidth  = Browser.clientWidth;
    // var pageHeight = Browser.clientHeight;
    var pageWidth = 750;
    var pageHeight = 1334;
    var loadBG, loadLogo, loadText;



    (function () {
        // 不支持WebGL时自动切换至Canvas
        Laya.init(pageWidth, pageHeight, WebGL);
        //性能统计面板的调用
        // Laya.Stat.show(0,0);
        console.log(Browser.clientHeight, Browser.pixelRatio)
        Laya.stage.alignV = Stage.ALIGN_MIDDLE;
        Laya.stage.alignH = Stage.ALIGN_CENTER;
        Laya.stage.screenAdaptationEnabled = true;
        Laya.stage.screenMode = "none";
        if (Laya.Browser.onPC || Laya.Browser.onIPad) {
            Laya.stage.scaleMode = "showall";
        } else {
            Laya.stage.scaleMode = "fixedwidth";
        }
        // Laya.stage.scaleMode = Stage.SCALE_FIXED_WIDTH; //fixedwidth | fixedauto | full | showall
        Laya.stage.bgColor = "#736bc5";
        // 首先加载位图文件，然后在进入加载页
        var mBitmapFont = new Laya.BitmapFont();
        mBitmapFont.loadFont("font/myFont.fnt", new Laya.Handler(this, downLoadMedia));
        mBitmapFont.setSpaceWidth(10);
        Laya.Text.registerBitmapFont('din1', mBitmapFont);

        // 创建一个发布订阅模式
        function Observer2() {
            //创建观察者数组
            this.observerList = [];
        }
        Observer2.prototype.on = function (key, obj) {
            if (!this.observerList[key]) {
                this.observerList[key] = []
            }
            //将observerpush进对应的key内存中
            this.observerList[key].push(obj);
        }
        Observer2.prototype.emit = function () {
            //获取key值
            var oKey = Array.prototype.shift.apply(arguments);
            // 遍历数组所有的观察者并执行操作
            this.observerList[oKey].forEach(obj => {
                obj[0].apply(obj[1], arguments)
            })
        }
        window.$ob = new Observer2();
    })();

    // 加载文件以及滚动条
    function downLoadMedia() {
        console.log(GameConfig.host)
        //加载静态文件资源
        var assets = [];
        // 添加字体 
        let fontNames = ['DIN.ttf', 'SFC.otf']
        fontNames.map(item => {
            assets.push({
                url: 'font/' + item
            });
        })

        // 加载images下的文件
        let imgNames = ['item-0-active.png', 'item-0.png', 'item-1-active.png', 'alert_fail_bg.png', 'sence-0_bg.png',
            'item-1-lock.png', 'item-1.png', 'refresh_btn.png', 'return_btn.png', "card-0-bg.png", 'alert_fail_mask.png',
            'card-bg.png', 'home_bg.png', 'card-bg-lock.png', 'pass_btn.png', 'item-1-active-no.png', 'refresh-card.png',
            'home_right.png', 'home_left.png', 'next_btn.png', 'item-enter.png', 'card-1-lock.png', 'music-icon-no.png',
            'music-icon.png', 'my-icon.png', 'pifu-icon.png', 'world-icon.png', 'main_1.png', 'main_2.png', 'main_3.png',
            'main_4.png', 'main_5.png',
        ];
        imgNames.map(item => {
            assets.push({
                url: 'assets/images/' + item,
                type: Loader.IMAGE  // type类型一定要加！！
            });
        })

        // 添加音效
        let soundNames = ['shua.mp3', 'dong.mp3', "zhuanchang.mp3", "dao.mp3", "dianzi.mp3", "load.mp3",
            "output.mp3", 'steven.mp3', 'enter.mp3']
        soundNames.map(item => {
            assets.push({
                url: 'assets/music/' + item,
                type: Loader.SOUND
            });
        })

        // console.log(assets)
        //加载
        Laya.loader.load('assets/images/logo_title2.png', Handler.create(this, function () {
            Laya.loader.load(assets, Handler.create(this, init), Handler.create(this, onLoading, null, false), Loader.TEXT);
        }))

        // 侦听加载失败
        Laya.loader.on(Event.ERROR, this, onError);

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // 绘制顶部logo
        loadLogo = new Sprite();
        Laya.stage.addChild(loadLogo);
        loadLogo.size(323, 103)
        loadLogo.pos(222, 340)
        loadLogo.loadImage('assets/images/logo_title2.png')
        // 绘制文字
        loadText = new Laya.Text();
        Laya.stage.addChild(loadText);
        loadText.width = 750;
        loadText.y = 480;
        loadText.fontSize = 35;
        loadText.align = 'center';
        loadText.text = '建议佩戴耳机';
        loadText.color = "#ccc";

        //绘制进度条
        loadBG = new Sprite();
        Laya.stage.addChild(loadBG);
        // DRAW.drawRoundedRectangle(loadBG, 100, 650, 150, 80, 40, '#fff');
    }

    //加载静态资源完成，开始初始化游戏
    function init() {
        clearLoading()
        console.log('初始化游戏');
        new DrawHome();
    }

    // 加载进度侦听器
    function onLoading(progress) {
        let width = 578 * progress;
        // console.log(width)
        loadBG.graphics.clear();
        DRAW.drawRoundedRectangle(loadBG, 80, 700, width, 30, 15, '#44348c');
    }

    // 清除滚动条
    function clearLoading() {
        loadLogo.graphics.clear();
        loadText.graphics.clear();
        loadBG.graphics.clear();
    }

    //打印加载失败日志
    function onError(err) {
        console.log("加载失败: " + err);
    }

})();