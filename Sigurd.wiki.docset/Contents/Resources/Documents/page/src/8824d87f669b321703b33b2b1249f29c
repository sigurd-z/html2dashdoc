$(function() {
	var _invitelist = "";
	var _tempul = $("<ul>");
	$("#invitelist a").each(function() {
		_tempul.append($("<li>").html($(this)));
	})
	$("#invitelist").html(_tempul.html());
	var arr=[];
	var arrBlur=[];
	//文章标签:
	if($("#tagBox").length>0)
	{ 
		  var str='';
		  var n=0;
		  
		  //空格键删除：
	  	   function tagKeydown(ev) {
			var code = (ev ? ev.which : event.keyCode);
		
			if (code == 15 || code == 8) {
			//如果是退格键
			var ss = $('#tagName span');

			if (ss.length > 0&& $("#tagBox input[type=text]").val()=="") {
				n--;
				ss.eq(ss.length - 1).remove();
				arr.splice(n,ss.length-n);
				setVal();
				txtWidth();
				$("#tagBox input[type=text]").attr("placeholder","");
			}
			else
			{
				$("#tagBox input[type=text]").attr("placeholder","填写标签，让更多人看到你的文章");
			}
		}
		
	}
		  //文本框获取焦点
		  $("#tagBox input[type=text]").click(function(){
			  $(".tagBox").show();
			  txtWidth();
			  return false;
		  });
		  $("#tagBox input[type=text]").keydown(tagKeydown);
		  $("#tagBox input[type=text]").blur(function(){
			  var regSymbol1=/,/;
			  var regSymbol2=/\s/;
			  if($("#tagBox input[type=text]").val()=="")
			  {
				$("#tagBox input[type=text]").attr("placeholder","填写标签，让更多人看到你的文章");   
			  }
			  else if(regSymbol1.test($("#tagBox input[type=text]").val())||regSymbol2.test($("#tagBox input[type=text]").val()))
			  {
			  	//如果用户输入了空格或者是逗号：
				if(regSymbol1.test($("#tagBox input[type=text]").val()))
				{
					var arrSpan=$("#tagBox input[type=text]").val().split(',');
				}
				else if(regSymbol2.test($("#tagBox input[type=text]").val()))
				{
					var arrSpan=$("#tagBox input[type=text]").val().split(' ');
				}
				for(var i=0;i<arrSpan.length;i++)
				{
					if(arrSpan[i].replace(/^\s+/).length!=0)
					{
						addSpan(arrSpan[i]);
						if(arr.length>5) return false;
						setVal();
					}
				}
			  }
			  else
			  {
				addSpan($(this).val()); 
				setVal();
			  }
		  });
		  
		  //点击标签
		  $("#tagBox .related a").on('click',function(){
			 addSpan($(this).html());
			 setVal();
			 return false;
		  })
		  $(".tagBox").click(function(){
			return false;
		  })
		  $("body").click(function(){
			 $(".tagBox").hide();
		  });
		  function setContent(str) {
			str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
			str = str.replace(/\"|\'/g,''); //去除HTML tag
			//str.value = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
			//str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
			return str;
		 }
		  //添加span：
		  function addSpan(str)
		  {
			$("#tagBox input[type=text]").val("");  
			n++;
			if(n>5)
			{
				n=5;
				return false;
			}  
			var oTagName=$("#tagName");
			str=setContent(str);
			var oSpan="<span>"+str.substring(0,8)+' '+"</span>";
			 oTagName.append(oSpan);
			 $("#tagBox input[type=text]").attr("placeholder","");
			 $("#tagVal").val(arr);
		  }
		  
		  //去除相同的：
		  function findSame(arr,n)
		  {
		  	for(var i=0;i<arr.length;i++)
			{
				if(arr[i]==n)
				{
					return false;
				}
			}
			return true;
		  }
		  //文章标签的文本框的value值：
		  function setVal()
		  {
			if($("#tagName span").length>5)
			{
				return false;
			} 
		  	for(var i=0;i<$("#tagName span").length;i++)
			{
				var oVal=$("#tagName span").eq(i).html().replace(/\s+$/g,'');
				if(findSame(arr,oVal))
				{
					
					arr.push(oVal);
				}
			}
			//$("#tagBox input[type=text]").val(arr.join(';'));
			$("#tagVal").val(arr.join(','));
		  }
		
		//计算文本框的宽度
		function txtWidth()
		{
			var oL=$("#tagName").width();
			$("#tagBox input[type=text]").css({"padding-left":10+oL+'px',"width":530-oL+'px'});
		}
	  
	}
	
	//右侧固定：
	if($("#fixbox").length>0)
	{
		var reTop = $("#fixbox").offset().top;
			function relatesFix()
			{
				if($(window).scrollTop() >= reTop)
				{
					$("#fixbox").css({"position":"fixed","top":"0px"});
				}
				
				if($(window).scrollTop() >= $(".footer").offset().top - $("#fixbox").height() - 30)
				{
					$("#fixbox").css({"position":"absolute","top":$(".footer").offset().top-$("#fixbox").height()-30+'px'});
				}
				
				if($(window).scrollTop() < reTop)
				{
					$("#fixbox").css({"position":"static","top":""});
				}

			}
		
		$(window).scroll(relatesFix);
		$(window).resize(relatesFix);
	}
	
	//内容页的滚动：
	if($(".adsbox").length>0)
	{
		function toPrev()
		{
		  if(!$("#invitelist").is(":animated"))
		  {
			  $("#invitelist li").last().prependTo($("#invitelist"));
			  $("#invitelist").css("margin-top","-26px");
			  $("#invitelist").stop().animate({marginTop:"0"},500);
		  }
		}
		function toNext()
		{
		  if(!$("#invitelist").is(":animated"))
		  {
			  $("#invitelist").stop().animate({marginTop:"-26px"},500,function(){
				  $("#invitelist").css("margin-top",'0')
				 $("#invitelist li").first().appendTo($("#invitelist"));
			  })
		  }
		}
		$(".next").click(function(){
		   clearInterval(timer);
		   toNext();
		})
		$(".prev").click(function(){
		  clearInterval(timer);
		  toPrev();
		})
		var timer=null;
		timer=setInterval(function(){
			   toPrev();
		},3000)
		$(".adsbox a").hover(function(){
				clearInterval(timer);
			},function(){
				timer=setInterval(function(){
				toPrev();
			},3000)
		})
		
	}

	//面包屑下面的图片经过：
	$(".piclist li").hover(function(){
		   var oP=$(this).find("p");
		   var oA=$(this).find(".picdes");
		   var h="35px";
		   oP.css("height",h);
		   oA.css({"line-height":h,"height":h});
		},function(){
		  var oP=$(this).find("p");
		  var oA=$(this).find(".picdes");
		  var h="30px";
		   oP.css("height",h);
		   oA.css({"line-height":h,"height":h});
	});


	$("#topshow").html(_html);
	
	//回到顶部
	$(window).scroll(function(){
		var t=$(".footer").offset().top;
		if($(window).scrollTop()>=t- $(window).height()) {
			$("#backtop").show().css({"position":"absolute","top":t-$("#backtop").height()-15+'px',"bottom":""});
		}
		else if($(window).scrollTop()==0) {
			$("#backtop").hide();
		}
		else {
			$("#backtop").show().css({"position":"fixed","bottom":"15px","top":""});
		}
	});
	$("#backtop").click(function(){
		$("body,html").animate({scrollTop:0},500);
	})
	
	
	var now_url = window.location.href;
	var num = 0;
	if(now_url.search(/newbie/i)!=-1){
		num=1;
	}
	if (num){
		$("#nav-lv0 li a").removeClass("cur");
		$("#nav-lv0 li").eq(num).find("a").addClass("cur");
		$("#nav-box0 ul").hide();
		$("#nav-box0 ul").eq(num).show();
	}
	
	// 阅读器
	$("#read").click(function() {
		var _con = '';
		var _h = parseInt($(window).height());
		var _h = _h - 60;
		
		_con = '<div class="tags"><a href="javascript:ts(\'article1\',1)" class="font f1"></a><a href="javascript:ts(\'article1\',-1)" class="font f2"></a></div>';
		_con += '<h2 class="arcd-ttl" style="padding:20px 20px 0">'+ $(".arcd-ttl").html() +'</h2>';
		//_con += $(".detail").html();
		_con += '<div id="article1" style="padding:20px;line-height:2">'+ $("#article").html()+ '</div>';
		
		$.colorbox({html:_con, height:_h+"px", width: "640px", fixed: 'true'})
		
		//$.colorbox({inline:true, href:".detail", height:_h+"px", width: "750px"});
	});
	
	
	// 内容页的大图点击弹窗
	$("#article img").each(function() {
		if($(this).parent().is("a") && $(this).parent().attr("target") == "_blank") {
			return true;
		}
		var _this = $(this);
		var _src = _this.attr('src');
		_this.attr('onclick','');
		_this.click(function() {$.colorbox({href:_src,opacity:0.7,speed:50 }); return false;})
		
	});
	
	mouseHover("mla-nav1", "mla-nav2");
	mouseHover("nav-lv0", "nav-box0");
	mouseHover("nav-lv1", "nav-lv2");
	mouseHover("mra-nav1", "mra-box1");
	mouseHover("mra-nav2", "mra-box2");
	mouseHover("mlm-nav1", "mlm-box1");
	
	$("#mrpo-nav li a").hover(function() {
		if($(this).parent().hasClass("first")) {
			$("#mrpo-nav").removeClass("sec");
			$("#mrpo-box ul").eq(0).show();
			$("#mrpo-box ul").eq(1).hide();
		}
		else {
			$("#mrpo-nav").addClass("sec");
			$("#mrpo-box ul").eq(1).show();
			$("#mrpo-box ul").eq(0).hide();
		}
	});
	
	// 轮播
	bannerRotate.bannerInit();
	bannerRotatec.bannerInit();
	
	// 频道文字超出处理
	$(".cha-list li .col1 p").hover(function() {
		$(this).css({height:'auto', background:'#fff', boxShadow:'2px 2px 2px #ddd', padding:'5px'});
	}, function() {
		$(this).css({height:'40px', background:'none', boxShadow:'', padding:'0'});
	});
	
	// 专题文字超出处理
	$(".topics_centercontent p").hover(function() {
		$(this).css({height:'auto', background:'#f9f9f9', boxShadow:'2px 2px 2px #ddd',padding:'5px',width:'200px'});
	}, function() {
		$(this).css({height:'60px', background:'none', boxShadow:'', padding:0,width:'210px'});
	})
});


function mouseHover(navId, boxId) {
	var _nav = $("#"+navId);
	var _box = $("#"+boxId);
	if(!_nav || !_box) {return;}
	_nav.find("li a").bind('mouseover',function() {
		var _i = $(this).parent().index();
		if(_i == 2 && navId == "mla-nav1") {return;}
		if(navId == "nav-lv0") {
			_nav.find("li a").removeClass("cur");
			_nav.find("li").eq(_i).find("a").addClass("cur");
		}
		else {
			_nav.find("li").removeClass("cur");
			_nav.find("li").eq(_i).addClass("cur");
		}
		
		_box.find("ul").hide();
		if(_box.find("ul").eq(_i)) {
			_box.find("ul").eq(_i).show();
		}
	});
}

// banner rotating
var bannerRotate = {
	_time: 3000,
	_fade: 200,
	_i: 0,
	_interval: null,
	_navId: "#mb-inav",
	_navBox: "#mb-ibox",
	_navTxt: "#mb-itxt",
	bannerShow: function() {
		$(this._navId).find("li a").removeClass("cur");
		$(this._navId).find("li:eq("+this._i+")").find("a").addClass("cur");
		
		$(this._navBox).find("a").fadeOut(this._fade);
		$(this._navBox).find("a:eq("+this._i+")").fadeIn(this._fade);
		
		$(this._navTxt).find("div").hide();
		$(this._navTxt).find("div:eq("+this._i+")").fadeIn(this._fade);
	},
	bannerStart:function() {
		var _this = this;
		_this._interval = setInterval(function() {
			if(_this._i >= 2) {
				_this._i = 0;
			}
			else {
				_this._i++;
			}
			_this.bannerShow();
		}, _this._time);
	},
	bannerInit: function() {
		var _this = this;
		_this.bannerStart();
		
		$(_this._navId).find("li a").bind("mouseover", function() {
			clearInterval(_this._interval);
			_this._i = $(this).parent().index();
			_this.bannerShow();
			_this.bannerStart();
		});
	}
};

// banner rotating
var bannerRotatec = {
	_time: 3000,
	_fade: 200,
	_i: 0,
	_interval: null,
	_navId: "#f-id",
	_navBox: "#f-box",
	bannerShow: function() {
		$(this._navId).find("li a").removeClass("cur");
		$(this._navId).find("li:eq("+this._i+")").find("a").addClass("cur");
		
		$(this._navBox).find(".cf-txt").hide();
		$(this._navBox).find(".cf-txt:eq("+this._i+")").show();
	},
	bannerStart:function() {
		var _this = this;
		_this._interval = setInterval(function() {
			if(_this._i >= 3) {
				_this._i = 0;
			}
			else {
				_this._i++;
			}
			_this.bannerShow();
		}, _this._time);
	},
	bannerInit: function() {
		var _this = this;
		_this.bannerStart();
		
		$(_this._navId).find("li a").bind("mouseover", function() {
			clearInterval(_this._interval);
			_this._i = $(this).parent().index();
			_this.bannerShow();
			_this.bannerStart();
		});
	}
}

function add_favors(tid,subject){ 
		//CheckLogin();
		var news_url = window.location.href;
  		var url = "/bbs/pw_ajax.php?action=add_news";
 		$.post(url,{'tid':tid,'subject':subject,'news_url':news_url},accept_callback);
 		return false;
}
function accept_callback(response){
	if(response == 'repeat'){
		$("#coco-store h3").html('已经收藏本篇文章');
		$("#coco-store p.p1").show();
		$("#coco-store p.p2").hide();
		$.colorbox({html: $("#coco-store").html(), opacity: 0.7, speed:50});
	}else if(response == 'ok'){
	 	$("#coco-store h3").html('收藏成功');
		$("#coco-store p.p1").show();
		$("#coco-store p.p2").hide();
		$.colorbox({html: $("#coco-store").html(), opacity: 0.7, speed:50});
	}else{
		$("#coco-store h3").html('收藏失败，您未登录或网络不好');
		$("#coco-store p.p2").show();
		$("#coco-store p.p1").hide();
		$.colorbox({html: $("#coco-store").html(), opacity: 0.7, speed:50});
	}
}


var tgs = new Array( 'div','td','tr','p');
var szs = new Array( 'xx-small','x-small','small','medium','large','x-large','xx-large' );
var startSz = 2;

function ts( trgt,inc ) {
if (!document.getElementById) return
var d = document,cEl = null,sz = startSz,i,j,cTags;
sz += inc;
if ( sz < 0 ) sz = 0;
if ( sz > 6 ) sz = 6;
startSz = sz;
if ( !( cEl = d.getElementById( trgt ) ) ) cEl = d.getElementsByTagName( trgt )[ 0 ];
	cEl.style.fontSize = szs[ sz ];
	for ( i = 0 ; i < tgs.length ; i++ ) {
		cTags = cEl.getElementsByTagName( tgs[ i ] );
		for ( j = 0 ; j < cTags.length ; j++ ) cTags[ j ].style.fontSize = szs[ sz ];
	}
}

// 谷歌统计
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-16940817-2']);
_gaq.push(['_trackPageview']);

(function() {
var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
