/*globals $,ReplyBoxHandler,OverlayHandler,EditCommentBoxHandler*/
/* takes care of the hovers for the tree comments, leave a comment link, Reply links in the flat comments, tree
 * and flat comments contents */
var CommentsHandler = {

    referenceCommentId : -1, // the id of the comment that is about to become a parent of the new comment
    subjectTouched: false,
    bodyTouched: false,

    activate : function () {
        'use strict';
        // take care of the relative times in the flat comments as well as the tree comments
        this.populateAgoTimes();
        this.activateReplyLinks();
        this.activateEditLinks();
        this.activateTreeCommentsHover();
        this.activateRootPost();
    },

    showNotificationInput : function () {
        if (CommentsHandler.bodyTouched
                && CommentsHandler.subjectTouched
                && $.trim($('#subject').val()).length !== 0
                && $.trim($('#body').val()).length !== 0) {
            $('.comment_here input').attr('checked', forumNotificationDefault);
            $('.comment_here input[name=emailMe], .comment_here span.tocheck').fadeIn(3000);
        }
    },

    populateAgoTimes : function () {
        'use strict';
        var that = this;
        $('div[id^=ans]').each(function () {
            that.populateAgoTime(this);
            // obtain the corresponding timestamp
        });
    },

    populateAgoTime : function (flatCommentNode) {
        'use strict';
        var commentId,
            agoTime = this.getRelativeTime($('input[name=tmstmp]', flatCommentNode).attr('value'));
        // populate the flat comment relative time
        $('span.bodyRelativeTime', flatCommentNode).text(agoTime);
        // populate the tree comment relative time
        commentId = $(flatCommentNode).attr('id').substring(3);
        commentId = parseInt(commentId);
        $('div#com' + commentId + ' span.treeRelativeTime').text(agoTime);
    },

    activateReplyLinks : function () {
        'use strict';
        var that = this;
        $('a.reply_flat').click(function () {
            that.referenceCommentId = $(this).parents('.answers').first().attr('id').substring(3);
            that.referenceCommentBody = "";
            if($(this).parents('.answers').first().children(".flat_comment_body").length) {
            	that.referenceCommentBody = $(this).parents('.answers').first().children(".flat_comment_body").html();
            }
            that.activateReplyLink($(this).parents('.answers')[0]);
            OverlayHandler.hideCommentOverlay();
        });
    },

    activateReplyLink : function (anchor, postProcCallback) {
        'use strict';
        ReplyBoxHandler.replyBoxAnchor = anchor;
        if (!loggedIn) {
            UserActions_Login.showLoginWidgetRightSide(anchor, 'commentsLogin');
        } else {
            ReplyBoxHandler.showReplyBox(postProcCallback);
        }
    },

    activateRootPost : function () {
        $('.comment_here')
                .hover(function () {
                    if (!loggedIn) {
                        $('#postFormDeck').css('display', 'block');
                    }
                },
                function () {
                    $('#postFormDeck').hide();
                });
        $('#subject').val(JSi18n.enter_subject);
        $('#body').val(JSi18n.enter_message);
        $('#subButton').click(function () {
            if (!loggedIn) {
                UserActions_Login.showLoginWidget(this, 'rootCommentLogin');
            } else {
                CommentsPoster.postRootComment();
            }
        });

        $('#subject,#body').keyup(CommentsHandler.showNotificationInput);
        $('#subject').
                focusin(function() {
                    if (!loggedIn) {
                        $('#postFormDeck').css('display', 'block');
                        return;
                    }
                    if (CommentsHandler.subjectTouched) {
                        return;
                    }
                    CommentsHandler.subjectTouched = true;
                    $(this).val('');
                    $(this).css('color', 'black');
                    $(this).css('font-family', 'Verdana,Geneva,sans-serif');
                    $(this).css('font-size', '13px');
                    $(this).css('font-weight', 'normal');
        });
        $('#body')
                .focusin(function() {
                    if (!loggedIn) {
                        $('#postFormDeck').css('display', 'block');
                        return;
                    }
                    if (CommentsHandler.bodyTouched) {
                        return;
                    } 
                    CommentsHandler.bodyTouched = true;
                    $(this).val('');
                    $(this).css('color', 'black');
                    $(this).css('font-family', 'Verdana,Geneva,sans-serif');
                    $(this).css('font-size', '13px');
                    $(this).css('font-weight', 'normal');
                    $('#body').autosize(); // call this after the font is updated, it only reads font related style properties once
                }).focusin( function() {
                    $('.comment_here p.allowed').fadeIn(3000);
                });
        $('#body').focusout(function() {
            $('.comment_here p.allowed').fadeOut(300);
        });
        $('#postFormDeck a.login').click(function () {
            $('#postFormDeck').css('display', 'block');
            $('div.comment_here').unbind('hover');
            UserActions_Login.showLoginWidget(this, 'postFormDeck');
        });
    },

    deactivateReplyLinks : function () {
        'use strict';
        $('a.reply_flat').unbind('click');
    },

    activateEditLinks : function () {
        'use strict';
        $('div[id^=ans]').each(function () {
            CommentsHandler.activateEditLink(this);
        });
    },

    activateEditLink : function (flatComment) {
        'use strict';
        var that = this,
            editLink = $('ul.help_links>li>a.edit_comment', flatComment)[0];
        // do nothing if the edit link is not available
        if (!editLink) {
            return;
        }
        that.updateCountdownLink(editLink);
        if (editLink) { //might have been deleted as part of the previous method call
            $(editLink).click(function () {
                // the tree comment will need the reference id
                that.referenceCommentId = $(this).parents('.answers').first().attr('id').substring(3);
                EditCommentBoxHandler.clearEditCommentBox();
                EditCommentBoxHandler.prepopulateSubjectAndBody();
                EditCommentBoxHandler.showEditCommentBox($(this).parents('.answers').first());
            });
        }
    },

    updateCountdownLink : function (linkNode) {
        'use strict';
        var parent = $(linkNode).parents('.answers')[0],
            msDelta = new Date().getTime() - parseInt($('input[name=tmstmp]', parent).val()),
            minutesRemaining = commentEditPeriod - Math.floor(msDelta / (1000 * 60));
        if (minutesRemaining <= 0) {
            // remove the edit link from the node
            $(linkNode).parent().remove();
        } else {
            if (minutesRemaining === 1) {
                minutesRemaining = '< 1';
            }
            $(linkNode).text(JSi18n.editLinkFormat.replace(/\$m/, minutesRemaining));
            setTimeout(function () {
                CommentsHandler.updateCountdownLink(linkNode);
            }, 10 * 1000); // 10 seconds error allowed
        }
    },

    deactivateEditLinks : function () {
        'use strict';
        $('ul.help_links>li>a.edit_comment').off('click');
    },

    activateTreeCommentsHover : function () {
        'use strict';
        // register the hovers for all the tree comment elements
        $('div[id^=com]').hoverIntent({
            sensitivity: 1,
            interval: 150,
            over: function () {
                //unfortunately the id of the text box is also starting with 'com' so we check if the id is there
                if (isNaN(parseInt(this.id.substring(3)))) return;
                // extract the comment id (also known as message id)
                CommentsHandler.referenceCommentId = $(this).attr('id').substring(3);
                // if rehovered, do nothing
                if (this !== OverlayHandler.lastHovered) {
                    ReplyBoxHandler.hideReplyBox();
                    UserActions_Login.hideLoginWidget();
                    OverlayHandler.lastHovered = this;
                    OverlayHandler.showCommentOverlay();
                }
            },
            out: function () {}
        });
    },

    deactivateTreeCommentsHover : function () {
        'use strict';
        $('div[id^=com]').hoverIntent({
            over: function () {},
            out: function () {}
        });
    },

    getRelativeTime : function (timeInMilliseconds) {
        'use strict';
        // create a new date with the browser locale
        var date = new Date();
        // set the milliseconds to this localized date
        date.setTime(timeInMilliseconds);
        // get the relative time
        moment.lang(InfoQConstants.language);
        var momentDate = moment(date);
        var momentNow = moment();
       
        if(momentNow.diff(momentDate,"days")>=3){
	      	// moment.js needs upper case for date format to work as we have for content.
	      	return momentDate.format(JSi18n.content_datetime_format.toUpperCase()+" hh:mm");
        }else{
        	return momentDate.fromNow();
        }        
    },

    clearRootPostBox : function () {
        $('#subject').val('');
        $('#body').val('');
        $('.comment_here input[name=emailMe], .comment_here span.tocheck').hide();
        CommentsHandler.bodyTouched = false;
        CommentsHandler.subjectTouched = false;
    },
    
    quoteOriginalMessage : function() {
    	if(this.referenceCommentBody && this.referenceCommentBody != "") {
    		$('textarea.commentsReply').val($('textarea.commentsReply').val() + "<blockquote>" + $.trim(this.referenceCommentBody) + "</blockquote>");
    	}
    	
    }
};

$(function () {
    'use strict';
    CommentsHandler.activate();
    // activate number of comments
    $('span.author_general').append($('#noOfComments'));
    $('#noOfComments').show();
});/*globals $,ReplyBoxHandler,OverlayHandler,CommentsHandler,PageNotifier*/

/* takes care of the comments posting functionality: form validation, result processing*/
var CommentsPoster = {
    postComment : function () {
        'use strict';
        // protect against multiple submits        
        CommentsPoster.disableForumPost("submit-reply", "replyPopup"); 
        
        var replyBox = $('#replyPopup'),
            subject = $('.subject', replyBox).val(), // new comment subject
            body = Parser.fixTags($('textarea.commentsReply', replyBox).val()), // new comment body
            notification = $('.emailMe', replyBox).is(':checked'); // email me checkbox
            //keep the setting for this session in case the user unchecks the default
            forumNotificationDefault = notification;

        // make sure valid data is submitted, do nothing otherwise
        if ($.trim(subject).length === 0) {
            PageNotifier.showNotificationPopup(JSi18n.errorSubject, CommentsPoster.redrawOverlayAndReplyBox);
            this.enableForumPost("submit-reply", "replyPopup");
            return;
        }
        if ($.trim(body).length === 0) {
			PageNotifier.showNotificationPopup(JSi18n.errorBody, CommentsPoster.redrawOverlayAndReplyBox);
			CommentsPoster.enableForumPost("submit-reply", "replyPopup");
			return;
        }
        // NOTE: the callback with params is possible becaus ethe function beeing called here returns another function that does the desired effect
        UserActions_Profile.forceUpdateProfile(CommentsPoster.sendRequest(postAddress, subject, body, notification, CommentsHandler.referenceCommentId, CommentsPoster.handleResponse));        
    },

    postRootComment : function () {
    	// protect against multiple submits
    	CommentsPoster.disableForumPost("subButton", "comment_here");
    	
        var notification = $('#emailMe').is(':checked'),
            subject = $('#subject').val(),
            body = $('#body').val();

        // validation
        if (!CommentsHandler.subjectTouched || $.trim(subject).length === 0) {
            PageNotifier.showNotificationPopup(JSi18n.errorSubject);
            CommentsPoster.enableForumPost("subButton", "comment_here");
            return;
        }
        if (!CommentsHandler.bodyTouched || $.trim(body).length === 0) {
			PageNotifier.showNotificationPopup(JSi18n.errorBody);
			CommentsPoster.enableForumPost("subButton", "comment_here");
			return;
        }
        // NOTE: the callback with params is possible becaus ethe function beeing called here returns another function that does the desired effect
        UserActions_Profile.forceUpdateProfile(CommentsPoster.sendRequest(postAddress, subject, body, notification, -1, CommentsPoster.handleResponse));        
    },

    repostComment : function () {
        'use strict';
        // protect against multiple submits
        CommentsPoster.disableForumPost("resubmit-reply", "editCommentPopup");
        
        var editCommentBox = $('#editCommentPopup'),
            subject = $('.subject', editCommentBox).val(), // comment subject
            body = Parser.fixTags($('textarea.commentsReply', editCommentBox).val()), // comment body
            notification = $('.emailMe', editCommentBox).is(':checked'); // email me checkbox

        // make sure valid data is submitted, do nothing otherwise
        if ($.trim(subject).length === 0) {
            PageNotifier.showNotificationPopup(JSi18n.errorSubject, CommentsPoster.redrawEditBox);
            CommentsPoster.enableForumPost("resubmit-reply", "editCommentPopup");
            return;
        }
        if ($.trim(body).length === 0) {
			PageNotifier.showNotificationPopup(JSi18n.errorBody, CommentsPoster.redrawEditBox);
			CommentsPoster.enableForumPost("resubmit-reply", "editCommentPopup");
			return;
        }
        // NOTE: the callback with params is possible becaus ethe function beeing called here returns another function that does the desired effect
        UserActions_Profile.forceUpdateProfile(CommentsPoster.sendRequest(repostAddress, subject, body, notification, CommentsHandler.referenceCommentId, CommentsPoster.handleRepostResponse));
    },

    sendRequest : function (address, subject, body, notification, parentMessageId, responseCallback) {
        var sendAjaxRequest = function(){
	    	$.ajax({
                        url: address,
                        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                        type: 'POST',
	            data: {
	                'reply' : 'true',
	                'forumID' : forumID,
	                'threadID' : threadID,
	                'messageID' : parentMessageId,
	                'subject' : subject,
	                'noti