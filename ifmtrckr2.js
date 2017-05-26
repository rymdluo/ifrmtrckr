(function($){
	// Iframe tracker common object
	$.ifmtrckr = {
		// State
		fcsrtrvr: null,  // Element used for restoring focus on window (element)
		fcsrtrvd: false, // Says if the focus was retrived on the current page (bool)
		hnlrlst: [],      // Store a list of every trakers (created by calling $(selector).ifmtrckr...)
		ie8noldr: false,  // true for Internet Explorer 8 and older
		
		// Init (called once on document ready)
		init: function(){
			// Determine browser version (IE8-) ($.browser.msie is deprecated since jQuery 1.9)
			try {
				if ($.browser.msie == true && $.browser.version < 9) {
					this.ie8noldr = true;
				}
			} catch(ex) {
				try {
					var matches = navigator.userAgent.match(/(msie) ([\w.]+)/i);
					if (matches[2] < 9) {
						this.ie8noldr = true;
					}
				} catch(ex2) {}
			}
			
			// Listening window blur
			$(window).focus();
			$(window).blur(function(e){
				$.ifmtrckr.winlosefcs(e);
			});
			
			// Focus retriever (get the focus back to the page, on mouse move)
			$('body').append('<div style="position:fixed; top:0; left:0; overflow:hidden;"><input style="position:absolute; left:-300px;" type="text" value="" id="fcsrtrvr" readonly="true" /></div>');
			this.fcsrtrvr = $('#fcsrtrvr');
			this.fcsrtrvd = false;
			$(document).mousemove(function(e){
				if (document.activeElement && document.activeElement.tagName == 'IFRAME') {
					$.ifmtrckr.fcsrtrvr.focus();
					$.ifmtrckr.fcsrtrvd = true;
				}
			});
			
			// Special processing to make it work with my old friend IE8 (and older) ;)
			if (this.ie8noldr) {
				// Blur doesn't works correctly on IE8-, so we need to trigger it manually
				this.fcsrtrvr.blur(function(e){
					e.stopPropagation();
					e.preventDefault();
					$.ifmtrckr.winlosefcs(e);
				});
				
				// Keep focus on window (fix bug IE8-, focusable elements)
				$('body').click(function(e){ $(window).focus(); });
				$('form').click(function(e){ e.stopPropagation(); });
				
				// Same thing for "post-DOMready" created forms (issue #6)
				try {
					$('body').on('click', 'form', function(e){ e.stopPropagation(); });
				} catch(ex) {
				}
			}
		},
		
		
		// Add tracker to trgt using hnlr (bind boundary listener + register hnlr)
		// trgt: Array of trgt elements (native DOM elements)
		// hnlr: User hnlr object
		track: function(trgt, hnlr){
			// Adding trgt elements references into hnlr
			hnlr.trgt = trgt;
			
			// Storing the new hnlr into hnlr list
			$.ifmtrckr.hnlrlst.push(hnlr);
			
			// Binding boundary listener
			$(trgt)
				.bind('mouseover', {hnlr: hnlr}, $.ifmtrckr.mseovrlstnr)
				.bind('mouseout',  {hnlr: hnlr}, $.ifmtrckr.mseoutlstnr);
		},
		
		// Remove tracking on trgt elements
		// trgt: Array of trgt elements (native DOM elements)
		untrack: function(trgt){
			if (typeof Array.prototype.filter != "function") {
				return;
			}
			
			// Unbinding boundary listener
			$(trgt).each(function(index){
				$(this)
					.unbind('mouseover', $.ifmtrckr.mseovrlstnr)
					.unbind('mouseout', $.ifmtrckr.mseoutlstnr);
			});
			
			// Handler garbage collector
			var nullFilter = function(value){
				return value === null ? false : true;
			};
			for (var i in this.hnlrlst) {
				// Prune trgt
				for (var j in this.hnlrlst[i].trgt) {
					if ($.inArray(this.hnlrlst[i].trgt[j], trgt) !== -1) {
						this.hnlrlst[i].trgt[j] = null;
					}
				}
				this.hnlrlst[i].trgt = this.hnlrlst[i].trgt.filter(nullFilter);
				
				// Delete hnlr if unused
				if (this.hnlrlst[i].trgt.length == 0) {
					this.hnlrlst[i] = null;
				}
			}
			this.hnlrlst = this.hnlrlst.filter(nullFilter);
		},
		
		// Target mouseover event listener
		mseovrlstnr: function(e){
			e.data.hnlr.over = true;
			try {e.data.hnlr.overCallback(this);} catch(ex) {}
		},
		
		// Target mouseout event listener
		mseoutlstnr: function(e){
			e.data.hnlr.over = false;
			$.ifmtrckr.fcsrtrvr.focus();
			try {e.data.hnlr.outCallback(this);} catch(ex) {}
		},
		
		// Calls blurCallback for every hnlr with over=true on window blur
		winlosefcs: function(event){
			for (var i in this.hnlrlst) {
				if (this.hnlrlst[i].over == true) {
					try {this.hnlrlst[i].blurCallback();} catch(ex) {}
				}
			}
		}
	};
	
})(jQuery);