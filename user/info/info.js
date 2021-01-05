var form = layui.form;
var layer = layui.layer;
//发出请求，获取用户信息，回填到表单
function getInfo() {
    $.ajax({
        url: "/my/userinfo",
        success: function(res) {
            form.val('user', res.data)
        }
    })
}
getInfo();

//点击确认修改按钮：获取用户输入的昵称和邮箱，上传到服务器
$("form").submit(function(e) {
    e.preventDefault();
    var params = form.val('user');
    $.ajax({
        type: 'post',
        url: "/my/userinfo",
        data: params,
        success: function(res) {
            layer.msg(res.message);
            if (res.status == 0) {
                window.parent.getInfo();
            }
        }
    })
})

//点击重置按钮
$(".reset").click(function(e) {
    e.preventDefault();
    getInfo();
});