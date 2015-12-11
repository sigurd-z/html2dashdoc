var Tracker = {
	trackVcrImpressions : true,
	trackForgotPasswordSteps : true,
	trackContentBookmarking : true,
	trackAdActions : true,
	trackVcrRightbarImpressions : true,

	doTrackVcrImpressions : function() {
		
		if(!Tracker.trackVcrImpressions) {
			return;
		}
		$(".f_vcrbottom").each(
			function doTrack(index) {
				var vcr = jQuery.parseJSON($(this).attr("jsh"));
				_gaq.push(["_trackEvent", (device !== undefined && device == 'mobile') ? "VCRImpressionMobile-"+vcr.id : "VCRImpression-"+vcr.id, $(location).attr("href"), "bottom"]);
			}
		);
		$(".f_vcrembed").each(
			function doTrack(index) {
				var vcr = jQuery.parseJSON($(this).attr("jsh"));
				_gaq.push(["_trackEvent", (device !== undefined && device == 'mobile') ? "VCRImpressionMobile-"+vcr.id : "VCRImpression-"+vcr.id, $(location).attr("href"), "embedded"]);
			}
		);
	},
	
	doTrackVcrRightbarImpressions : function(trackingClass) {
		//trackingClass possible values :f_vcrrightbar_optional, f_vcrrightbar_sponsorship (used to differentiate, sponsorship class available at document reday, optional class only when we know about the banner add, after document ready)
		if(!Tracker.trackVcrRightbarImpressions) {
			return;
		}
		$("."+trackingClass).each(
				function doTrack(index) {
					// // tvi = tracked vcr id, tvl = tracked vcr label	
					var tvi = $(this).attr("tvi");
					var tvl = $(this).attr("tvl");
					_gaq.push(["_trackEvent", "VCRImpression-"+tvi, $(location).attr("href"), tvl]);
				}
			);
		
	},
	
	doTrackContentBookmark : function(action, label) {		
		if(!Tracker.trackContentBookmarking) {
			return;
		}		
		_gaq.push(['_trackEvent', 'Bookmarks', action, label]);
		
	},
	
	doTrackForgotPasswordSteps : function(step) {
		if(!Tracker.trackForgotPasswordSteps) {
			return;
		}
		_gaq.push(["_trackEvent", "Forgot password", step, ""]);
	},
	
	doTrackAdAction : function(category, label, action) {		
		if(!Tracker.trackAdActions) {
			return;
		}
		_gaq.push(['_trackEvent', 'ADACTION~' + category , action, label]);
		
	},
	
	safeExec: function(f) {
		try {
			f();
		}
		catch(ex) {
			if(window.console && window.console.log) {
				window.console.log(ex);
			}
		}
	}
};