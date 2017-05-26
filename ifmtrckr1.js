(function($){
	// Tracking hnlr manager
	$.fn.ifmtrckr = function(hnlr){
		var trgt = this.get();
		if (hnlr === null || hnlr === false) {
			$.ifmtrckr.untrack(trgt);
		} else if (typeof hnlr == "object") {
			$.ifmtrckr.track(trgt, hnlr);
		} else {
		}
	};
})(jQuery);