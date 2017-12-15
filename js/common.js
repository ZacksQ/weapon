var commonUrl = 'http://123.206.221.228:8080/jungong/'

$(".dropdown-caret").on("click", function () {
    $(".dropdown-menu").toggle()
})
$(".dropdown-caret").on("click", function (e) {
    e.stopPropagation()
})
$(document).on("click", function () {
    $(".dropdown-menu").hide()
})

$.post(commonUrl + 'user/get/info', {}, function (data) {
    if (data.success) {
        var userinfo = data.data;
        $(".user-nav .nickname").text(userinfo.nickname);
        $(".user-data .nickname span").text(userinfo.nickname);
        $(".user-introduction").text(userinfo.mood);
        $(".avatar").attr("src", userinfo.headImg);
        var classtype = userinfo.branchName.reverse();
        $('.class-type').html(classtype.join('<i class="layui-icon">&#xe623;</i>'));
    }
}, 'json');

function ext(filename){
    if(filename == null){ return false }
    var ext = null;
    var name = filename.toLowerCase();
    var i = name.lastIndexOf(".");
    if(i > -1){
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