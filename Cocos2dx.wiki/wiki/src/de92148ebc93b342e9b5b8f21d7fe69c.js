/***** index *****/
function indexPage(){
	 $(".pageturingAll").html($("#gamePage").find("ul").length);
	window.indexPageWrap = new IndexPageWrap({});
	goTop();
	returnTop();
	gamePop();
	popCeil();
	window.gamePageWrap=new gamePageWrap({});
}
function page(){
	popCeil();
	goTop();
	returnTop();
  }
function downloadPage(){
	popCeil();
	goTop();
	returnTop();
	download();
	}
function downloadNewPage(){
	popCeil();
	goTop();
	returnTop();
	var sign=getCookie("historyVersion");
	if(sign){
	
	  $.each($(".current_alert"),function(i,obj){
           obj=$(obj);
           obj.hide();
		});
       $("."+sign).children(".current_alert").show();
       $.each($(".download_detail_content"),function(i,obj){
           obj=$(obj);
           obj.hide();
		});
       $("#"+sign).show();
        unsetCookie("historyVersion","/download");
   }
	$(".download_href_detail").find("a").off("click").on("click",function(){
		$.each($(".current_alert"),function(i,obj){
           obj=$(obj);
           obj.hide();
		});
		var id=$(this).attr("class")
       $(this).children(".current_alert").show();
       $.each($(".download_detail_content"),function(i,obj){
           obj=$(obj);
           obj.hide();
		});
       $("#"+id).show();
	});
	//判断操作系统
	  var os=determineOS();
	  $("select").change(function(){
	  	 var id=$(this).attr("id");
	  	 var current= $(this).val();
	  	 var index=$(this).selectedIndex;
	  	 var link_href=$("#"+id+" option:selected").attr("data-href");
	  	$("#"+id).siblings(".download_num").attr("href",link_href);
	    
	  });
	  $.each($("select"),function(i,obj){
	   obj=$(obj);
	   var arr=obj[0].options;
	   var href;
	   $.each(arr,function(j,obj1){
	   	if(obj1.text==os){
	   		obj.val(os); 
	   		href=obj1.getAttribute("data-href");
	   		obj.siblings(".download_num").attr("href",href);
	   	 }
	   	 else if(obj1.text=="Windows" && ( os=="Win32" || os=="Win64"))
	   	  {
             obj.val("Windows");
             href=obj1.getAttribute("data-href");
	   		 obj.siblings(".download_num").attr("href",href);
	   	  }

	   });
	  });	
}
function determineOS(){
	var os=navigator.userAgent.toLowerCase();
	if(os.indexOf("window")>0){
		if(os.indexOf("win64")>=0||os.indexOf("wow64")>=0){
			return "Win64";
		}
		else return "Win32"
	}
    else if(os.indexOf("mac os x")>0){
    	return "Mac";
    }
    else return "Win64";
}
function allVerPage(){
	popCeil();
	goTop();
	returnTop();
	$("#allHistoryListBox").find("li:last-child").addClass("lastli_lrhc");
	}
function gamePageWrap(){
	this.gameImg = $("#gamePage"); //banner slider
	this.gameLeft = $("#arrowLeft");
	this.gameRight = $("#arrowRight");
	this.len=this.gameImg.find("ul").length;
	this.flag = true;
	this.n = 0;
	this.t = null;
	this.init();
}

gamePageWrap.prototype = {
	init:function(){
		//$(".pageturingAll").html(this.Len);
		this.gameDefineFun();
		this.resizeWinFun();
	}, 
	 resizeWinFun:function(){
		var that = this;
		$(window).resize(function(){
			that.gameImg.find("ul").width(1000 * that.Len);
			clearInterval(that.t);
		 	that.gameAnimateFun();
		 	that.gametabChangeFun();
		});
	},
	gameDefineFun:function(){
		var that = this;
		that.gameImg.find("ul").width(1000 * that.Len);
		that.gametabChangeFun();
		that.gameClickLeftFun();
		that.gameClickRightFun();
		$(".gameWrap").hover(function(){clearInterval(that.t)},function(){
              that.gametabChangeFun();
        });  
		
	},
	gametabChangeFun:function(){
		var that = this;
		var $li = that.gameImg.find("ul"),
			$li_first = that.gameImg.find('ul:first'),
			liWid = parseInt($li.width()),
			liLen = $li.length;
		that.t = setInterval(function(){
			that.n++;
			if(that.n == liLen){ 
				$li_first.css({position:'relative',left:that.n*liWid});
				that.flag=false;
			}
			that.gameCurFun();
			that.gameAnimateFun();
		},5000);
		
	},
	gameAnimateFun:function(){
		var that = this;
		var $li = that.gameImg.find("ul"),
			$li_first = that.gameImg.find('ul:first'),
			liWid = -parseInt($li.width()),
			liLen = $li.length;
		var Sum = parseInt(liWid * that.n);
		that.gameImg.stop().animate({"left":Sum},500,function(){
			if(!that.flag){
				that.gameImg.css('left',0);
				$li_first.css({position:'static',left:0});
				that.n = 0;
				that.flag = true;
			}
		});
	},
	   gameCurFun:function(){
		var that = this;
		var index = that.n;
		if(index == that.len){index = 0; }
		if(index==(that.len-1))   
		{     this.gameRight.attr("disabled",true);
			  this.gameRight.css("background","url(statics/images/cocos/gray.png) no-repeat -30px 0"); 
			  this.gameLeft.removeAttr("disabled");
		     this.gameLeft.css("background","url(statics/images/cocos/mr.png) no-repeat 0 0");  
		}
		else if(index==0) {
			 this.gameRight.removeAttr("disabled");
		     this.gameRight.css("background","url(statics/images/cocos/mr.png) no-repeat -30px 0");
			this.gameLeft.attr("disabled",true);
		    this.gameLeft.css("background","url(statics/images/cocos/gray.png) no-repeat 0 0"); 
		}
	   else {
			 this.gameRight.removeAttr("disabled");
		     this.gameRight.css("background","url(statics/images/cocos/mr.png) no-repeat -30px 0");
			 this.gameLeft.removeAttr("disabled");
		     this.gameLeft.css("background","url(statics/images/cocos/mr.png) no-repeat 0 0");
		}
		$(".pageturingCur").html(index+1);
		
	},
	gameClickLeftFun:function(){
		var that = this;
		var $left = that.gameLeft;
		$left.unbind("click");
		$left.bind("click",function(){
		var count=$(".pageturingCur").html();
		    if(count>=2 && count<=that.len){
		     that.n=count-2;
		    }
			clearInterval(that.t);
			that.gameCurFun();
			that.gameAnimateFun();
			that.gametabChangeFun();
		});
	},
	gameClickRightFun:function(){
		var that = this;
		var $right = that.gameRight;
		$right.unbind("click");
		$right.bind("click",function(){
			var count=$(".pageturingCur").html();
             if(count!=that.len){
                 that.n=parseInt(count);
				 clearInterval(that.t);
			     that.gameCurFun();
			     that.gameAnimateFun();
			     that.gametabChangeFun();
				}
			else if(count==that.len){
			    that.n=0;
		        $right.attr("disabled",true);
				$right.css("background","url(statics/images/cocos/gray.png) no-repeat -30px 0");
			}
		});
	}
}
function IndexPageWrap(){
	this.bannerImg = $("#bannerImgBox"); //banner slider
	this.bannerCut = $(".dot");
	this.flag = true;
	this.n = 0;
	this.t = null;
	this.init();
}

IndexPageWrap.prototype = {
	init:function(){
		this.bannerDefineFun();	 //banner slider
		this.resizeWinFun();
	}, 
	/***** banner slider*****/ 
	resizeWinFun:function(){
		var that = this;
		$(window).resize(function(){
			var $li = that.bannerImg.find("li"),
				liLen = $li.length,
				winWid = $(window).width(),
				clientWid = (winWid < 1100) ? 1100 : winWid;
			that.bannerImg.width(clientWid * 4);
			$li.width(clientWid);
			clearInterval(that.t);
		 	//window.location.href=window.location.href;
		 	that.bannerAnimateFun();
		 	that.tabChangeFun();
		});
	},
	bannerDefineFun:function(){
		var that = this;
		var $li = that.bannerImg.find("li"),
			liLen = $li.length,
			winWid = $(window).width(),
			clientWid = (winWid < 1100) ? 1100 : winWid;
		that.bannerImg.width(clientWid * 4);
		$li.width(clientWid);
		that.tabChangeFun();
		that.bannerClickFun();
	},
	tabChangeFun:function(){
		var that = this;
		var $li = that.bannerImg.find("li"),
			$li_first = that.bannerImg.find('li:first'),
			liWid = parseInt($li.width()),
			liLen = $li.length;
		that.t = setInterval(function(){
			that.n++;
			if(that.n == liLen){ 
				$li_first.css({position:'relative',left:that.n*liWid});
				that.flag=false;
			}
			that.bannerCurFun();
			that.bannerAnimateFun();
		},5000);
	},
	bannerAnimateFun:function(){
		var that = this;
		var $li = that.bannerImg.find("li"),
			$li_first = that.bannerImg.find('li:first'),
			liWid = -parseInt($li.width()),
			liLen = $li.length;

		var Sum = parseInt(liWid * that.n);
		that.bannerImg.stop().animate({"left":Sum},500,function(){
			if(!that.flag){
				that.bannerImg.css('left',0);
				$li_first.css({position:'static',left:0});
				that.n = 0;
				that.flag = true;
			}
		});
	},
	bannerCurFun:function(){
		var that = this;
		var index = that.n;
		if(index == 4){index = 0;}
		that.bannerCut.find("li").removeClass("active");
		that.bannerCut.find("li:eq("+index+")").addClass("active");
	},
	bannerClickFun:function(){
		var that = this;
		var $sec_li = that.bannerCut.find("li");

		$sec_li.unbind("click");
		$sec_li.bind("click",function(){
			var _this = $(this);
			that.n = _this.index();

			clearInterval(that.t);
			that.bannerCurFun();
			that.bannerAnimateFun();
			that.tabChangeFun();
		});
	}
}
//返回顶部
function goTop(){
	var scroll_top = $(document).scrollTop();
	if(scroll_top >= 200){
		$(".rebottom").fadeIn();
	}else{
		$(".rebottom").fadeOut();
	}

	var footer_height = $(".footer")[0].clientHeight;
	var scroll_height = $(document).height() - $(window).height() - footer_height;

	if(scroll_top > scroll_height){
		$(".returns").css("bottom",footer_height+"px");
	}else{
		$(".returns").css("bottom","10px");
	}
}
//return top
function returnTop(){
	$('#gotop').click(function(){
        $("html,body").animate({scrollTop:0},500);
    });
	var t=$(document).scrollTop();
	if(t>0){
		$(".rebottom").show();	
	}
	else{
		$(".rebottom").hide();	
	}

}
//游戏弹出层
function gamePop(){
	var imgObj=$(".gamelist li p a");
    var topPx;
	var leftPx;
	$("#arrowLeft").mouseover(function(){
		 if($("#arrowLeft").attr("disabled")!="disabled")
		 {
		  $("#arrowLeft").css("background","url(statics/images/cocos/hg.png) no-repeat");
		 }
		});
	$("#arrowLeft").mouseout(function(){
		 if($("#arrowLeft").attr("disabled")!="disabled")
		 {
		  $("#arrowLeft").css("background","url(statics/images/cocos/mr.png) no-repeat");
		 }
		});
	 $("#arrowRight").mouseover(function(){
		 if($("#arrowRight").attr("disabled")!="disabled"){
		   $("#arrowRight").css("background","url(statics/images/cocos/hg.png) no-repeat -30px 0");
		 }
		});
	 $("#arrowRight").mouseout(function(){
		 if($("#arrowRight").attr("disabled")!="disabled"){
		   $("#arrowRight").css("background","url(statics/images/cocos/mr.png) no-repeat -30px 0");
		 }
		});
	imgObj.mouseover(function(){
		 var index=$(this).parents("li").index();
		 var name;
		 if($(this).parents("li").parents(".gamePage1").length>0){
			 name="gametip"+index;
		 }
		 if($(this).parents("li").parents(".gamePage2").length>0){
			 name="gametip"+(index+27);
		  }
		 else if($(this).parents("li").parents(".gamePage3").length>0){
			 name="gametip"+(index+54);
		}
		 if(index>=0 && index <=6){
			$("."+name).css("background","url(statics/images/cocos/gametip.png) no-repeat");
	        topPx= 83;
	        leftPx=index*41+index*75;     
		  }
		 else  if(index>=7&& index <=8){
		    $("."+name).css("background","url(statics/images/cocos/gametip1.png) no-repeat");
	        topPx= 83;
	        leftPx=(index-7)*41+index*75+30;
		   }
		else  if(index>=9 && index <=15){
			$("."+name).css("background","url(statics/images/cocos/gametip.png) no-repeat");
			topPx= 198;
		    var leftPx=(index-9)*41+(index-9)*75;  
		  }
		else if(index>=16 && index <=17){
			 $("."+name).css("background","url(statics/images/cocos/gametip1.png) no-repeat");
	          topPx= 198;
	          leftPx=(index-16)*41+(index-9)*75+30;
			}
		else  if(index>=18 && index <=24){
			$("."+name).css("background","url(statics/images/cocos/gametip.png) no-repeat");
			topPx= 315;
		    leftPx=(index-18)*41+(index-18)*75;  
		  }
		else  if(index>=25 && index <=26){
			$("."+name).css("background","url(statics/images/cocos/gametip1.png) no-repeat");
			topPx= 315;
            leftPx=(index-25)*41+(index-18)*75+30;  
		  }
		  if($(this).parents("li").parents(".gamePage1").length>0){
			$("."+name).css({"left":leftPx+"px","top":topPx+"px"});
		 }
		 if($(this).parents("li").parents(".gamePage2").length>0){
			 $("."+name).css({"left":(1000+leftPx)+"px","top":topPx+"px"});
		  }
		 else if($(this).parents("li").parents(".gamePage3").length>0){
			$("."+name).css({"left":(2000+leftPx)+"px","top":topPx+"px"});
		}
		 $("."+name).show().siblings(".gametip").hide();
		   
	});
	imgObj.mouseout(function(){
		 var index=$(this).parents("li").index();
		 var name;
		  if($(this).parents("li").parents(".gamePage1").length>0){
			 name="gametip"+index;
		 }
		 if($(this).parents("li").parents(".gamePage2").length>0){
			 name="gametip"+(index+27);
		  }
		 else if($(this).parents("li").parents(".gamePage3").length>0){
			 name="gametip"+(index+54);
		}
		 $("."+name).hide();
	});
}
//弹出层
function popCeil(){
	$(".weixin").mouseover(function(){
		$(".wxpop").show();
		});
	$(".weixin").mouseout(function(){
		$(".wxpop").hide();
		});
	$(".qq").mouseover(function(){
			$(".qqpop").show();
		});
	$(".qq").mouseout(function(){
			$(".qqpop").hide();
		});	
	$(".top2").mouseover(function(){
	    $(".returnsl").show();
	  });
    $(".top2").mouseout(function(){
	    $(".returnsl").hide();
	  });
	
}
//查看版本
function download(){
   var $liItem=$("#versionCutBox").find("li")
	    $liItem.click(function(){
		var _this = $(this);
		$liItem.removeClass("current_trhc");
		_this.addClass("current_trhc");
		if(_this.index() == 0){
				$("#windowVerBox").show();
				$("#macVerBox").hide();				
			}else{
			    $("#windowVerBox").hide();
				$("#macVerBox").show();			
		}
		
   });
   $("#windowVerBox").find("li:last-child").addClass("lastli_lrhc");
   $("#macVerBox").find("li:last-child").addClass("lastli_lrhc");
}
function returnDownload(){
  unsetCookie("historyVersion","/download");
  var sign=window.location.href.split("/")[4];
  setCookie("historyVersion",sign,'/download');
  window.location.href='/download';
}


//创建cookie
function setCookie(name, value, path, domain, secure, expires) {
    var cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    if (expires instanceof Date) {
    cookieText += '; expires=' + expires;
    }
    if (path) {
    cookieText += '; path=' + path;
    }
    if (domain) {
    cookieText += '; domain=' + domain;
    }
    if (secure) {
    cookieText += '; secure';
    }
    document.cookie = cookieText;
}
//获取cookie
function getCookie(name) {
    var cookieName = encodeURIComponent(name) + '=';
    var cookieStart = document.cookie.indexOf(cookieName);
    var cookieValue = null;
    if (cookieStart > -1) {
      var cookieEnd = document.cookie.indexOf(';', cookieStart);
    if (cookieEnd == -1) {
    cookieEnd = document.cookie.length;
    }
    cookieValue = decodeURIComponent(
    document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
    }
    return cookieValue;
}
//删除cookie
function unsetCookie(name,path) {
 
//document.cookie = name + "= ; expires=" + new Date(0);

  document.cookie = name + "=; expires=" + new Date(0)+"; path="+path; 

}
//失效天数，直接传一个天数即可
function setCookieDate(day) {
if (typeof day == 'number' && day > 0) {
var date = new Date();
date.setDate(date.getDate() + day);
} else {
throw new Error('传递的day 必须是一个天数，必须比0 大');
}
return date;
}
function baiDuStatisticsFun(id,source,keyword2){
	var keyword1;
	if($(id).siblings("select").length>0){
         keyword1=$(id).siblings("select").val();
	}
	else{
		keyword1="Windows";
	}
	_hmt.push(['_trackEvent', source, keyword1, keyword2]);
	if($("#user").length<=0){
		$("#modalDialog").show();
		 $("html,body").animate({scrollTop:0},500);
		return false;
	}
	else{
		$("#modalDialog").hide();
		return true;
	}
}
function baiDuStatisticsFunDetail(id,keyword1,keyword2){
	_hmt.push(['_trackEvent', 'download', keyword1, keyword2]);
	if($("#user").length<=0){
		$("#modalDialog").show();
		$("html,body").animate({scrollTop:0},500);
		return false;
	}
	else{
		$("#modalDialog").hide();
		return true;
	}
}