//登陆、注册切换
(function() {
    //去注册
    $("#goto-register").click(function() {
        $("#login").hide();
        $("#register").show();
    })

    //去登陆
    $("#goto-login").click(function() {
        $("#login").show();
        $("#register").hide();
    })
})();

//注册功能
(function() {
    //给form表单注册submit事件
    $("#register .layui-form").submit(function(e) {
        e.preventDefault();
        var params = $(this).serialize();
        $.ajax({
            type: 'post',
            url: "http://ajax.frontend.itheima.net/api/reguser",
            data: params,
            success: function(res) {
                layer.msg(res.message);
                if (res.status == 0) {
                    $("#login").show();
                    $("#register").hide();
                    $("#register .layui-form")[0].reset();
                } else {
                    $("#username").val('');
                }
            }
        })
    })
})();

//校验：
(function() {
    var form = layui.form;
    // 密码、重复密码长度 6~12 位，且不能出现空格、非空格类字符；  \S
    form.verify({
        length: [
            /^\S{6,12}$/,
            "密码长度必须为6~12位,不能有空格"
        ],
        same: function(val) {
            var pwd = $('#pwd').val();
            if (pwd !== val) {
                return '两次密码不一致';
            }
        }
    })
})();

//登录功能
(function() {
    $("#login .layui-form").submit(function(e) {
        e.preventDefault();
        var params = $(this).serialize();
        $.ajax({
            type: 'post',
            url: "http://ajax.frontend.itheima.net/api/login",
            data: params,
            success: function(res) {
                layer.msg(res.message);
                if (res.status == 0) {
                    localStorage.setItem('token', res.token);
                    location.href = "../index.html"
                } else {
                    $("#login .layui-form")[0].reset();
                }
            }
        })
    })
})();