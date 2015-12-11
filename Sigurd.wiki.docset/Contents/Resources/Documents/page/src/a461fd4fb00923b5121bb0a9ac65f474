// JavaScript Document
$(function(){	 
    //当点击回到页面顶部位置
    $(".returntop").click(function(){
    	$('body,html').animate({scrollTop:0},300);
    	return false;
    });
    
    $(".feedback").hover(function(){$(".r-bar img.weixin").show();},function(){$(".r-bar img.weixin").hide();});

	var timer;
    $(function(){
        $(window).scroll(function(){
            clearInterval(timer);
            var _scrollTop=$(window).scrollTop();
            var topDiv="218";
            
		    if(_scrollTop > 200) {
				$(".returntop").fadeIn(200);
			} else {
				$(".returntop").fadeOut(200);
			}

			if(_scrollTop >= $(".footer").offset().top - $(window).height() - 10) {
				$(".r-bar").css({position:"absolute", top: $(".footer").offset().top-247+"px", bottom: "inherit"});
			} else {
				$(".r-bar").css({position:"fixed", top: "inherit", bottom: "10px"});
			}       
        })
    })

	
	
	/**Cocos引擎专区 选项卡**/
	$('.tab-h>a').mouseover(function(){	
		$(this).addClass('current').siblings("a").removeClass();	
		$('.tab-main>li').eq($(this).index()).addClass('current').siblings().removeClass();
		
	});

	/**首页轮播**/
	$("#slide_list").each(function(){
		// 获取有关参数
			icoArr = $("#slide_click").children();
			activeID = parseInt($($("#slide_click").children(".current")[0]).attr("rel")),  // 当前图片ID
			nextID = 0,  // 下张图片ID
			setIntervalID='',  // setInterval() 函数ID
			intervalTime = 4000;  // 间隔时间
		// 设置 图片容器 的宽度
		
		// 图片轮换函数
		var rotate=function(clickID){
			if(clickID){ nextID = clickID; }
			else{ nextID=activeID<5 ? activeID+1 : 1; }
			// 交换图标
			$(icoArr[activeID-1]).removeClass("current");
			$(icoArr[nextID-1]).addClass("current");
			// 交换标题
			
			// 交换图片
			$('#slide_list li').fadeOut();
			
			$('#slide_list li:eq('+(nextID-1)+')').fadeIn();
			 
			activeID = nextID;
		}
		setIntervalID=setInterval(rotate,intervalTime);
		$("#slide_list li").hover(
			function(){ clearInterval(setIntervalID); },
			function(){ setIntervalID=setInterval(rotate,intervalTime); }
		);	
		$("#slide_click a").hover(
			function(){clearInterval(setIntervalID);
			var clickID = parseInt($(this).attr("rel"));
			rotate(clickID);},
			function(){	
			setIntervalID=setInterval(rotate,intervalTime);
			}
		);
	});
	
	$(".forum-c ul li:first").css("border","none")


})