var form = layui.form;
// 密码、重复密码长度 6~12 位，且不能出现空格、非空格类字符；  \S
form.verify({
    length: [
        /^\S{6,12}$/,
        "密码长度必须为6~12位,不能有空格"
    ],
    dif: function(val) {
        if (val == $('.oldPwd').val()) {
            return '新密码和旧密码不能一样'
        }
    },
    same: function(val) {
        if (val !== $('.newPwd').val()) {
            return '两次密码不一致';
        }
    }
})

$('form').submit(function(e) {
    e.preventDefault();
    var params = $(this).serialize();
    $.ajax({
        type: 'post',
        url: "/my/updatepwd",
        data: params,
        success: function(res) {
            layer.msg(res.message);
            if (res.status == 0) {
                $('form')[0].reset();
            }
        }
    })
})