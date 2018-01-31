// var commonUrl = 'http://180.76.184.214:9080/jungong/';
var commonUrl = 'http://192.168.1.91:8080/jungong/';
var userid = null;
$(".user-nav").on("mouseover", function () {
    $(".dropdown-menu").toggle()
})
// $(".user-nav").on("click", function () {
//     $(".dropdown-menu").toggle()
// })
// $(".user-nav").on("click", function (e) {
//     e.stopPropagation()
// })
$(document).on("mouseout", function () {
    $(".dropdown-menu").hide()
})

var userId = localStorage.getItem("userId");
if (userId !== null) {
    $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
        // Modify options, control originalOptions, store jqXHR, etc
        jqXHR.setRequestHeader("LoginUserId_", userid)
    });
}

if (window.location.href.indexOf('login') == -1) {
    $.ajax({
        url: commonUrl + 'user/get/info',
        headers: {
            "LoginUserId_": userId
        },
        dataType: 'json',
        type: 'POST',
        success: function (data) {
            if (data.success) {
                var userinfo = data.data;
                $(".user-nav .nickname").text(userinfo.nickname);
                $(".user-data .nickname span").text(userinfo.nickname);
                $(".user-introduction span").text(userinfo.mood);
                $(".user-arm span").text(userinfo.arm);
                $(".avatar img").attr("src", userinfo.headImg);
                var classtype = userinfo.branchName.reverse();
                $('.class-type').html(classtype.join('<i class="layui-icon">&#xe623;</i>'));
                userid = userinfo.id;
            }
            // else if(data.code == 1801){
            //     window.location.href = 'login.html';
            // }
        }
    });
}

function ext(filename) {
    if (filename == null) {
        return false
    }
    var ext = null;
    var name = filename.toLowerCase();
    var i = name.lastIndexOf(".");
    if (i > -1) {
        var ext = name.substring(i);
    }
    return ext;
}

function getRequest() {
    var url = location.search;
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        // var str = url.substr(1);
        var strs = url.substr(1).split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];
        }
    }
    return theRequest;
}

$(document).ajaxComplete(function (event, xhr, settings) {
    var sessionStatus = xhr.getResponseHeader("sessionstatus");
    if (typeof (sessionStatus) !== 'undefined' && sessionStatus != null) {
        if (sessionStatus === "timeout") {
            window.location.href = "login.html";
        }
    }
});

$("#loginout").click(function () {
    $.post(commonUrl + 'signOut', {}, function () {
        window.location.href = 'login.html';
    }, 'json');
});

function SendMsg(roomId, input) {
    layui.use(['layer'], function () {
        var layer = layui.layer
        if ($.trim(input.val()) == '') {
            // layer.msg("发送消息不能为空");
            var discuss_msglist = document.querySelector(".discuss-msglist");
            discuss_msglist.appendChild(sendSysMsg("发送消息不能为空"));
            var msglist = document.querySelectorAll(".msg-item")
            msglist[msglist.length - 1].scrollIntoView()
            return false;
        }
        $.post(commonUrl + 'chat/send', {
            infoId: roomId,
            chatType: 1,
            chatBody: input.val()
        }, function () {
            input.val('');
        }, 'json');
    });
}

function appendMsg(nicknametxt, contentext) {
    var msg_item = document.createElement("div"),
        nickname = document.createElement("span"),
        msg_content = document.createElement("span");
    msg_item.setAttribute("class", 'msg-item');
    nickname.setAttribute("class", 'nickname');
    msg_content.setAttribute("class", 'msg-content');
    nickname.appendChild(document.createTextNode(nicknametxt + "："));
    msg_content.appendChild(document.createTextNode(contentext));
    msg_item.appendChild(nickname);
    msg_item.appendChild(msg_content);
    return msg_item;
}

function sendSysMsg(contentext) {
    var msg_item = document.createElement("div"),
        msg_content = document.createElement("span");
    msg_item.setAttribute("class", 'msg-item msg-sys');
    msg_content.setAttribute("class", 'msg-content');
    msg_content.appendChild(document.createTextNode(contentext));
    msg_item.appendChild(msg_content);
    return msg_item;
}