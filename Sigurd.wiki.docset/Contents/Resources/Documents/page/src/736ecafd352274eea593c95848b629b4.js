$(function () {
    $(".nav-header .nav-user").hover(function () {
        $(this).find('ul').stop(true,true).fadeIn('fast');
    },function () {
        $(this).find('ul').stop(true,true).fadeOut();
    });

    $(".nav-header .nav-search .nav-search-flag").click(function () {
        var opt = $(this).parent().find(".nav-search-form");
        $(this).fadeOut();
        $(".nav-header .nav-list").animate({ width: '350px' });        
        $(opt).fadeIn();
        $(opt).find("input[type=text]").focus();
    });

    $(".nav-header .nav-search input[type=text]").blur(function () {
        $(".nav-header .nav-search .nav-search-form").hide();
        $(".nav-header .nav-list").animate({ width: '480px' });
        $(".nav-header .nav-search .nav-search-flag").fadeIn('fast');
    });

    //专题聚焦
    $(".spec-list .spec-item .spec-item-title").mouseenter(function () {
        var root = $(this).parent();
        $(".spec-list .spec-item .spec-item-title").stop(true, true).show();
        $(".spec-list .spec-item .spec-item-detail").stop(true,true).hide();
        $(root).find(".spec-item-title").stop(true,true).hide();
        $(root).find(".spec-item-detail").stop(true,true).fadeIn();
    });
});