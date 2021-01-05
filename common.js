$.ajaxPrefilter(function(obj) {
    obj.url = "http://api-breakingnews-web.itheima.net" + obj.url;

    if (obj.url.indexOf('/my') !== -1) {
        obj.headers = {
            "Authorization": localStorage.getItem('token')
        };
        obj.complete = function(xhr) {
            if (xhr.responseJSON && xhr.responseJSON.status === 1 && xhr.responseJSON.message === '身份认证失败！') {
                localStorage.removeItem('token');
                location.href = '/login.html';
            }
        }
    }
})