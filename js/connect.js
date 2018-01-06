function output(message) {
    // var output = document.getElementById("output");
    // output.innerHTML = output.innerHTML + message + "\n";
}

window.onload = function () {
    // if (location.search != "")
    //     var baseUrl = (/[?&]webChannelBaseUrl=([A-Za-z0-9\-:/\.]+)/.exec(location.search)[1]);
    // else
    var baseUrl = "ws://localhost:12345";

    output("Connecting to WebSocket server at " + baseUrl + ".");
    var socket = new WebSocket(baseUrl);

    socket.onclose = function () {
        console.error("web channel closed");
    };
    socket.onerror = function (error) {
        console.error("web channel error: " + error);
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
            //开启直播
            if (document.getElementById("startliving")) {
                document.getElementById("startliving").onclick = function () {
                    //设置参数
                    // var text;
                    // var request = getRequest();
                    $.post(commonUrl + 'liveinfo/get/intercalate', {}, function (data) {
                        if (data.success) {
                            var data = data.data;
                            core.receiveStartStream(JSON.stringify(data));
                            // console.log("success:开启直播")
                        } else {
                            console.log(data.msg);
                        }
                    }, 'json');
                    // core.receiveStartStream("字符串");
                    // core.receiveStartStream('开启');
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
            if(document.getElementById("switchcamera")){
                document.getElementById("switchcamera").onclick = function() {
                    //设置参数
                    var text = 'switchcamera';
                    core.receiveSwitchCamera(text);
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