//如果别人直接使用index.html打开网页，而不是在登录页进来的
//则本地没有token，需要跳转到登录页面
if (!localStorage.getItem('token')) {
    location.href = '/login.html';
};
//加载用户信息
function getInfo() {
    $.ajax({
        url: "/my/userinfo",
        success: function(res) {
            if (res.status == 0) {
                //获取并设置用户名
                var name = res.data.nickname || res.data.username;
                $('.username').html(name);
                //获取并设置用户头像
                if (res.data.user_pic) {
                    $('.layui-nav-img').attr('src', res.data.user_pic).show();
                } else {
                    var pic = name.substr(0, 1).toUpperCase();
                    $('.avatar').html(pic).show().css('display', 'inline-block');
                }
            }
        }
    })
}
getInfo();

//退出操作
(function() {
    $('#logout').click(function() {
        layer.confirm('您确定要退出吗？', function(index) {
            localStorage.removeItem('token');
            location.href = '/login.html';
            layer.close(index);
        })
    })
})();