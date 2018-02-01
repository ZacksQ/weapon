function output(message) {
    // var output = document.getElementById("output");
    // output.innerHTML = output.innerHTML + message + "\n";
}

var h, m, s;//时 分 秒
h = m = s = 0;//初始化
var ms = 0;//毫秒
var int;//定时器

function Reset()//重置
{
    window.clearInterval(int);
    ms = h = m = s = 0;
    document.getElementById('timetext').innerText = '00:00.00';
}

function start()//开始
{
    int = setInterval(timer, 10);

}

function two_char(n) {
    return n >= 10 ? n : "0" + n;
}

function timer()//计时
{
    ms = ms + 10;
    if (ms >= 1000) {
        ms = 0;
        s = s + 1;
    }
    if (s >= 60) {
        s = 0;
        m = m + 1;
    }
    document.getElementById('timetext').innerText = two_char(m) + ':' + two_char(s) + '.' + two_char(ms / 10);
}


window.onload = function () {
    // if (location.search != "")
    //     var baseUrl = (/[?&]webChannelBaseUrl=([A-Za-z0-9\-:/\.]+)/.exec(location.search)[1]);
    // else
    var baseUrl = "ws://localhost:12345";

    output("Connecting to WebSocket server at " + baseUrl + ".");
    var socket = new WebSocket(baseUrl);

    socket.onclose = function () {
        core.receiveStopStream();    //关闭直播推流
        core.receiveStopRecord();    //关闭录制
        console.error("web channel closed");
    };
    socket.onerror = function (error) {
        console.error("web channel error: " + error);
        //页面关闭时

    };
    socket.onopen = function () {
        output("WebSocket connected, setting up QWebChannel.");
        new QWebChannel(socket, function (channel) {
            // make core object accessible globally
            window.core = channel.objects.core;

            // document.getElementById("send").onclick = function() {
            //     var input = document.getElementById("input");
            //     var text = input.value;
            //     if (!text) {
            //         return;
            //     }
            //
            //     output("Sent message: " + text);
            //     input.value = "";
            //     core.receiveText(text);
            // }
            var isstartliving = false;
            //开启直播
            if (document.getElementById("startliving")) {
                document.getElementById("startliving").onclick = function () {
                    //设置参数
                    if (isstartliving === false) {
                        $.post(commonUrl + 'liveinfo/get/intercalate', {}, function (data) {
                            if (data.success) {
                                var data = data.data;
                                data.livingType = 0;
                                $.post(commonUrl + 'liveinfo/liveControl', {
                                    type: 1
                                }, function (json) {
                                    if(json.success==true){

                                        core.receiveStartStream(JSON.stringify(data));
                                        document.getElementById("startliving").innerHTML = '<i class="layui-icon">&#xe652;</i>结束摄像直播';
                                        // console.log("success:开启直播")
                                        isstartliving = true;
                                    }
                                }, 'json')
                            } else {
                                console.log(data.msg);
                            }
                        }, 'json');
                        // core.receiveStartStream("字符串");
                        // core.receiveStartStream('开启');
                    } else {
                        $.post(commonUrl + 'liveinfo/liveControl', {
                            type: 2
                        }, function (json) {
                            if(json.success==true){
                                isstartliving = false;
                                document.getElementById("startliving").innerHTML = '<i class="layui-icon">&#xe652;</i>开启摄像直播';
                                core.receiveStopStream();
                            }
                        }, 'json')

                    }
                }
            }

            var isstartliving_screen = false;
            //开启屏幕直播
            if (document.getElementById("startscreenliving")) {
                document.getElementById("startscreenliving").onclick = function () {
                    //设置参数
                    if (isstartliving_screen === false) {
                        $.post(commonUrl + 'liveinfo/get/intercalate', {}, function (data) {
                            if (data.success) {
                                var data = data.data;
                                data.livingType = 1;
                                core.receiveStartStream(JSON.stringify(data));
                                document.getElementById("startscreenliving").innerHTML = '<i class="layui-icon">&#xe652;</i>结束屏幕直播';
                                isstartliving_screen = true;
                            } else {
                                console.log(data.msg);
                            }
                        }, 'json');
                    } else {
                        isstartliving_screen = false;
                        document.getElementById("startscreenliving").innerHTML = '<i class="layui-icon">&#xe652;</i>开启屏幕直播';
                        core.receiveStopStream();
                    }
                }
            }

            //截图
            if (document.getElementById("shurtcut")) {
                document.getElementById("shurtcut").onclick = function () {
                    //设置参数
                    var text = {
                        width: $("#player").width(),
                        height: $("#player").height(),
                        top: $("#player").offset().top,
                        left: $("#player").offset().left
                    };
                    core.receiveScreenShot(JSON.stringify(text));
                }
            }

            //切换摄像头
            if (document.getElementById("switchcamera")) {
                document.getElementById("switchcamera").onclick = function () {
                    //设置参数
                    var text = 'switchcamera';
                    core.receiveSwitchCamera(text);
                }
            }
            //开始录制
            var isrecording = false;
            if (document.getElementById("videorecord")) {
                document.getElementById("videorecord").onclick = function () {
                    if (isrecording === false) {
                        var text = "videorecord"
                        core.receiveStartRecord(text);
                        isrecording = true;
                        start();
                        document.getElementById("videorecord").innerHTML = '<i class="layui-icon">&#xe6ed;</i>停止录制';
                    } else {
                        core.receiveStopRecord();
                        isrecording = false;
                        Reset();
                        document.getElementById("videorecord").innerHTML = '<i class="layui-icon">&#xe6ed;</i>开始录制';
                    }
                }
            }
            //开启子窗口
            if (document.getElementById("showmin")) {
                document.getElementById("showmin").onclick = function () {

                    var url = commonUrl + 'weapon/index.html';    //子窗口的URL地址
                    core.receiveSubWindow(url);
                }
            }

            //静音
            var ismute = false;
            if (document.getElementById("mute")) {
                document.getElementById("mute").onclick = function () {
                    if (ismute === false) {
                        ismute = true;

                        document.getElementById("mute").innerHTML = '<i class="layui-icon" style="text-decoration: line-through;">&#xe6fc;</i>麦克风';
                    } else {
                        ismute = false;
                        document.getElementById("mute").innerHTML = '<i class="layui-icon">&#xe6fc;</i>麦克风';
                    }
                    core.receiveSilentCommand();
                }
            }

            core.sendText.connect(function (message) {
                output("Received message: " + message);
            });

            core.receiveText("Client connected, ready to send/receive messages!");
            // core.receiveStartStream("start stream");
            // core.receiveScreenShot("screen shot");
            output("Connected to WebChannel, ready to send/receive messages!");
            output("start stream");
            output("start screen shot");
        });
    }
}