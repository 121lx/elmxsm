// 记录是否复制中
var is_btn = false;

// 复制成功之后 还原所有复制按钮的样式
function fadeOut(){
    $(".icopy").removeAttr("style");
    $(".icopy").html("一键复制");
    // 记录复制完毕
    is_btn = false;
};

// 获取cookie
function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
};

// 复制链接
$(function(){
    // 点击复制按钮
    $(".icopy").click(function(){
        // 如果正在复制 不执行
        if(is_btn){
            return;
        }
        // 记录正在复制
        is_btn = true;
        // 自身 添加 id属性为btn
        $(this).prop({"id":"btn"});
        // 内容标签 添加 id属性为dd
        $(this).prev().children().find('._content').prop({"id":"dd"});

        const range = document.createRange();
        range.selectNode(document.getElementById('dd'));

        const selection = window.getSelection();
        if(selection.rangeCount > 0) selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand('copy');

        // 更改当前复制按钮的样式
        $("#btn").prop("style","width:40%; background:#78bd33;");
        $("#btn").html("已复制到剪切板");

        // 发起ajax请求
        var params = {
            "index": $(this).attr("index"),
            "middle_info": $("#info").val(),
            "middle_type": "INTEGRATE",
        };
        $.ajax({
            type: "post",
            contentType: "application/json",
            headers:{
                "X-CSRFToken":getCookie("csrftoken")
            },
            data: JSON.stringify(params),
            success: function(resp){
            }
        })
        // 如果计时器还没停止 那么就删除掉
        if(window.t) clearTimeout(window.t);
        window.t = setTimeout("fadeOut()", 1000);

        // 删除自身的 id属性   删除内容标签的id属性
        $(this).removeAttr("id").prev().children().find('._content').removeAttr("id")
        return false;
    });

    // 点击自定义按钮
    $(".custom_btn").click(function(){
        var custom_btn_click_event = $(this).attr("custom_btn_click_event")
        var cmd = $(this).attr("cmd")

        if(custom_btn_click_event == "JUMP"){
            window.open(cmd)
        }
        else{
            // 如果正在复制 不执行
            if(is_btn){
                return;
            }
            // 记录正在复制
            is_btn = true;

            // 自身 添加 id属性为btn
            $(this).prop({"id":"btn"});
            // 内容标签 添加 id属性为dd 赋值
            $(this).next().prop({"id":"dd"}).val(cmd);

            const range = document.createRange();
            range.selectNode(document.getElementById('dd'));

            const selection = window.getSelection();
            if(selection.rangeCount > 0) selection.removeAllRanges();
            selection.addRange(range);
            document.execCommand('copy');

            layer.open({
                content: '已复制到剪切板',
                style: 'background-color:rgba(0,0,0,.7);color:#fff;border:none;width:auto;',
                shade: false,
                time: 1.5,
            })
        }

        // 发起ajax请求
        var params = {
            "index": $(this).attr("index"),
            "middle_info": $("#info").val(),
            "middle_type": "CUSTOM_BTN",
        };
        $.ajax({
            type: "post",
            contentType: "application/json",
            headers:{
                "X-CSRFToken":getCookie("csrftoken")
            },
            data: JSON.stringify(params),
            success: function(resp){
            }
        })

        // 如果计时器还没停止 那么就删除掉
        if(window.t) clearTimeout(window.t);
        window.t = setTimeout("fadeOut()", 1000);

        // 删除自身的 id属性   删除内容标签的id属性
        $(this).removeAttr("id").next().removeAttr("id")
        return false;
    });

    window.alert = function alertw(name) {
        var iframe = document.createElement("IFRAME");  
        iframe.style.display = "none";  
        iframe.setAttribute("src", 'data:text/plain,');  
        document.documentElement.appendChild(iframe);  
        window.frames[0].window.alert(name);  
        iframe.parentNode.removeChild(iframe);  
    };

    var title = $("#_title").html()
    if(title && title.length > 12){
        title = title.substr(0,12);
        $("#_title").html(title+"...")
    };
});
