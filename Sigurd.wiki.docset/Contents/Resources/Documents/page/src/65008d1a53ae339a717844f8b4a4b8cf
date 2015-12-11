var article_id;
var article_type_id;

var comment_events = {
    bindAll : function(){
        $(".glab-comment .replybt").unbind("click").click(function(){
            $reply_template = $("#reply_comment_template").html();
            if($(this).closest('.comment-right').find('#sub-reply-comment').length > 0){
                $("#sub-reply-comment").remove();
                return false;
            }
            $("#sub-reply-comment").remove();
            var r_obj = { 
                commentid : $(this).closest(".glab-comment").attr("rel-data-id"),
                parentuserid: $(this).closest(".glab-comment").attr("rel-user-id"),
                parentusername:  $(this).closest(".glab-comment").attr("rel-user-name")
            };
            var rendered = Mustache.render($reply_template, r_obj);
            $(this).closest('.comment-right').append(rendered);
            $("#sub-reply-txt").focus();

            $("#sub_comment_bt").unbind('click').click(function(){
                var parentid = $("#sub-reply-id").val();
                var content = $("#sub-reply-txt").val();
                var parentuserid = $("#sub-reply-userid").val();
                var parentusername = $("#sub-reply-username").val();
                var this_layer = $(this).closest('.glab-comment').attr("rel-layer");
                var $commentTopPosition;
                if(this_layer == 1){
                    $commentTopPosition = $(this).closest('.glab-comment').find('.comment-right').first();
                }else{
                    $commentTopPosition = $(this).closest('.glab-comment');
                }
                if(content == ""){
                    alert("请先填写评论内容再提交");
                    return false;
                }
                $("#sub_comment_bt").prop("disabled",true);
                $.ajax({
                    url: "/bbs/comment.php",
                    type: "POST",
                    dataType: "JSON",
                    data: {
                        action: "add",
                        'aid' : article_id,
                        'url' : location.href,
                        parent: parentid,
                        content: content
                    },
                    success: function(data){
                        console.log(data);
                        $("#sub_comment_bt").prop("disabled",false);
                        if(data.ok){
                            $sub_comment_tpl = $("#sub_comment_template").html();
                            Mustache.parse($sub_comment_tpl);
                            var r_data = {
                                comment_id: data.data.insert_id,
                                user_id: comment_events.userId,
                                user_icon_url: comment_events.userHeadImg,
                                user_name: comment_events.userName,
                                parent_user_id: parentuserid,
                                parent: parentusername,
                                create_time: "刚刚",
                                content: content,
                                support: 0,
                                report: 0,
                                has_supported: false,
                                has_reported: false
                            }
                            var o_html = Mustache.render($sub_comment_tpl, r_data);
                            $commentTopPosition.after(o_html);
                            var totle_comment_count = $(".glab-comment-title").find("span").text();
                            $(".glab-comment-title").find("span").text(parseInt(totle_comment_count)+1);
                            $('#artical_comment_cnt').html("<i></i>"+(parseInt(totle_comment_count)+1));
                            $("#sub-reply-comment").remove();
                            comment_events.bindAll();
                            //comment_events.showMsgInfo("评论提交成功，审核通过后才会显示。");							
                        }else{
                            comment_events.showMsgInfo("评论失败，请稍后再试");
                        }
                    }
                });
            });
            //判断用户是否登录，如果已登陆，调用comment_events.showCommentMask();未登陆调用comment_events.hideCommentMask()
            if(comment_events.isLogedIn){
                comment_events.hideCommentMask();
            }else{
                comment_events.showCommentMask();
            }
        });
        $('.comment-buttons .ding .default').unbind('click').click(function(){
            var $that = $(this);
            var commentid = $(this).closest(".glab-comment").attr("rel-data-id");
            $that.fadeOut('fast', function() {
                $that.parent('.ding').find('.actived').show();
            });
            var now_cnt = parseInt($that.parent('.ding').find('.zancnt').text());
            $that.parent('.ding').find('.zancnt').text(now_cnt+1);
            $.ajax({
                url:"/bbs/comment.php",
                type: "POST",
                dataType:"JSON",
                data:{
                    action: "support",
                    'aid' : article_id,
                    comment_id:commentid
                },
                success:function(data){
                    console.log(data);
                }
            });
        });
        $('.comment-buttons .cai .default').unbind('click').click(function(){
            var $that = $(this);
            var commentid = $(this).closest(".glab-comment").attr("rel-data-id");
            $that.fadeOut('fast', function() {
                $that.parent('.cai').find('.actived').show();
            });
            var now_cnt = parseInt($that.parent('.cai').find('.zancnt').text());
            $that.parent('.cai').find('.zancnt').text(now_cnt+1);
            $.ajax({
                url:"/bbs/comment.php",
                type: "POST",
                dataType:"JSON",
                data:{
                    action: "report",
                    'aid' : article_id,
                    comment_id:commentid
                },
                success:function(data){
                    console.log(data);
                }
            });
        });
    },
    hideCommentMask: function(){
        $(".unlogin-mask").hide();
    },
    showCommentMask: function(){
        $(".unlogin-mask").show();
    },
    showMsgInfo:function(msg){
        $("#glab-comment-callback-msg").text(msg).slideDown().delay(3000).slideUp();
    },
    isLogedIn: false,
    userId: 0,
    userHeadImg: '',
    userName: ''
};


$(function(){
    article_id  = $('#article_id').val();
    article_type_id = $('#article_type_id').val();

    if (article_id == '13583' || article_id == '3') {
        //$('#commnet_list_holder').show();
    }

    var $main_template = $("#main_comment_template").html();
    var $btn_more = $("#morecomment");
    var $coment_holder = $("#commentlist");
    Mustache.parse($main_template);
    var page_size = 8;

    $btn_more.bind("click",function(){
        var page = $btn_more.data("page");
        page = page || 0;

        $.ajax({
            dataType: "json",
            url: '/bbs/comment.php',
            type: "POST",
            data: {
                'action'    : 'list',
                'aid'       : article_id,
                'page'      : page
            },
            success: function(data){
                if (data.data && data.data.user.id) { // 已登录
                    comment_events.isLogedIn = true;
                    comment_events.userId = data.data.user.id;
                    comment_events.userHeadImg = data.data.user.face_url;
                    comment_events.userName = data.data.user.username;
                    comment_events.hideCommentMask();
                    $('#user_face_url').attr('src', data.data.user.face_url);
                }

                $btn_more.data('page', page+1);
                $(".glab-comment-title").find("span").text(data.data.total);
                $('#artical_comment_cnt').html("<i></i>"+(data.data.total));
                page_size = data.data.page_size;
                var r_obj = data.data.list;
                $.each(r_obj, function(idx){
                    var one_html = Mustache.render($main_template, this);
                    $coment_holder.append(one_html);
                });

                if (r_obj.length < page_size) {
                    $btn_more.hide();
                }else{
                    $btn_more.show();
                }

                $('#refresh_comment_btn').hide();

                comment_events.bindAll();
            }
        });
    }).trigger("click"); 

    
    //判断用户是否登录，如果已登陆，调用comment_events.showCommentMask();未登陆调用comment_events.hideCommentMask()
    //comment_events.hideCommentMask();

    $("#main_comment_bt").click(function(){
        var content = $("#main_comment_content").val();
        if(content == ""){
            alert("请先填写评论内容再提交");
            return false;
        }
        $("#main_comment_bt").prop("disabled",true);
        $.ajax({
            url: "/bbs/comment.php",
            type: "POST",
            dataType: "JSON",
            data: {
                action: "add",
                'aid' : article_id,
                'url' : location.href,
                parent: 0,
                content: content
            },
            success: function(data){
                console.log(data);
                $("#main_comment_bt").prop("disabled",false);
                if(data.ok){
                    //comment_events.showMsgInfo("评论提交成功，审核通过后才会显示。");
                    //data.data.insert_id
                    var r_data = { 
                        comment_id: data.data.insert_id, 
                        user_id: comment_events.userId, 
                        user_icon_url: comment_events.userHeadImg,
                        user_name: comment_events.userName,
                        create_time: '刚刚',
                        content: content,
                        support: 0,
                        report: 0,
                        has_supported: false,
                        has_reported: false
                    }
                    var one_html = Mustache.render($main_template, r_data);
                    $coment_holder.prepend(one_html);
                    comment_events.bindAll();
                    var totle_comment_count = $(".glab-comment-title").find("span").text();						
                    $(".glab-comment-title").find("span").text(parseInt(totle_comment_count)+1);
                    $('#artical_comment_cnt').html("<i></i>"+(parseInt(totle_comment_count)+1));
                    $("#main_comment_content").val("");
                }else{
                    comment_events.showMsgInfo("评论失败，请稍后再试");
                }
            }
        });
    });

    showRightComments(article_type_id);

    

});

// 右侧评论自动读取数据
function showRightComments(article_type_id) {
    $.ajax({
        url: "/bbs/comment.php",
        type: "POST",
        dataType: "JSON",
        data: {
            action: "search",
            type_id : article_type_id
        },
        success: function(ret){
            console.log(ret);
            if (ret.ok) {
                data_len = ret.data.length;
                html = '';
                if (data_len > 0) {
                    for (i = 0; i < data_len; i++) {
                        last_class = (i == data_len - 1) ? 'noborder-b' : '';
                        html += '<li class="' + last_class + '">';
                        html +=     '<span class="hide_comment">' + ret.data[i]['content'] + '</span><br />';
                        html +=     '<p>';
                        html +=         '<span>' + ret.data[i]['username'] + '</span>';
                        html +=         '<span>评论了</span>';
                        html +=         '<a target="_blank" title="' + ret.data[i]['title'] + '" href="' + ret.data[i]['html_url'] + '">';
                        html +=             '<span>' + ret.data[i]['title_short'] + '</span>';
                        html +=         '</a>';
                        html +=     '</p>';
                        html += '</li>';
                    }
                }

                $('#all_comments_holder').html(html);
            }
        }
    });
}
