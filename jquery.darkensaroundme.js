/*!
 * JQuery Plugin
 */
(function($) {
	$.fn.darkensAroundMe = function(options) {
	
		var $this;
		if(this.length > 0) {
			//Solo podemos aplicar el efecto a un solo elemento, se le aplicará al primero
			$this = $(this).first();
		}
		else return;

		if($('.darkens-components').is('*')) {
			$('.darkens-components').remove();
		}

		$(document).keyup(function(e) {
			if (e.keyCode == 27) { 
				shutDownDarknes();
			}
		});
		$(window).unbind('scroll',applyChangesToDarkness)
						 .bind('scroll',applyChangesToDarkness)
						 .unbind('resize',applyChangesToDarkness)
						 .bind('resize',applyChangesToDarkness);
		
		var default_opts = {
			colorDarkens: '#000',
			opacity: 0.2,
			addWidth: 20,
			addHeight: 20,
			addETop: 10,
			addELeft: 10,
			scrollTopAnimate: true,
			afterScrollTop: function(element) {},
			scrollTopDistance: 200,
			scrollTopDuration: 500,
			debug: false
		};
		var opts = $.extend({}, default_opts, options);
		var template = {
			Shadow : '<div id="darkens-component-top" style="top:0;left:0;width:100%;height:100px;" class="darkens-components"></div>' +
						 	 '<div id="darkens-component-right" style="top:0;left:0;width:100px;height:100%;" class="darkens-components"></div>' +
						 	 '<div id="darkens-component-bottom" style="top:0;left:0;width:100%;height:100px;" class="darkens-components"></div>' +
						 	 '<div id="darkens-component-left" style="top:0;left:0;width:100px;height:100%;" class="darkens-components"></div>',
			Debug : '<div id="debug-darkensaroundme"></div>'
		}
		$('body').append(template.Shadow);
		setStyleDarkness();
		if(opts.debug) {
			$('body').append(template.Debug);
			setStyleDebug();
			$('#darkens-component-top').css({
				background: '#EF8222'
			});
			$('#darkens-component-right').css({
				background: '#236F7F'
			});
			$('#darkens-component-bottom').css({
				background: '#797923'
			});
			$('#darkens-component-left').css({
				background: '#A73E0F'
			});
		}
		
		$('.darkens-components').fadeIn();
		
		rePosition($this); 
		if(opts.scrollTopAnimate)
			scrollToElement($this);
		function rePosition(element){
			
			var windowWidth = $(window).width();
			var windowHeight = $(window).height();
			var eOffset = element.offset();
			var width = element.outerWidth();
			var height = element.outerHeight();
			var eTop = eOffset.top;
			var eLeft = eOffset.left;
			var valueTop;
			var valueLeft;
			
			width += opts.addWidth;
			height += opts.addHeight;
			
			eTop += - opts.addETop;
			eLeft += - opts.addELeft;
		
			valueTop = eTop  - $(window).scrollTop();
			valueLeft = eLeft - $(window).scrollLeft();
			
			var eBottom = valueTop + height;
			var eRight = valueLeft + width;
			if(valueTop<0)valueTop=0;
			if(eBottom<0)eBottom=0;
			if(valueLeft<0)valueLeft=0;
			if(eRight<0)eRight=0;
			
		 
		  
		  $('#darkens-component-top').css({
		  	height:valueTop,
		  	width:eRight
		  });
		  $('#darkens-component-left').css({
		  	top:valueTop,
		  	width:valueLeft
		  });
		  $('#darkens-component-right').css({
		  	left:eRight,
		  	height:eBottom,
		  	width:windowWidth
		  });
		  $('#darkens-component-bottom').css({
		  	top: eBottom,
		  	left: valueLeft,
		  	height: windowHeight
		  });
		  
		  
		  if(opts.debug) {
		  	debug = '<ul>';
		  	debug += '<li style="color:#EF8222">Component Top';
		  	debug += '<ul>';
		  	debug += '<li>height:' + valueTop + '</li>';
		  	debug += '<li>width:' + eRight + '</li>';
		  	debug += '</ul>';
		  	debug += '</li>';
		  	
		  	debug += '<li style="color:#A73E0F">Component Left';
		  	debug += '<ul>';
		  	debug += '<li>top:' + valueTop + '</li>';
		  	debug += '<li>width:' + valueLeft + '</li>';
		  	debug += '</ul>';
		  	debug += '</li>';
		  	
		  	debug += '<li style="color:#236F7F">Component Right';
		  	debug += '<ul>';
		  	debug += '<li>left:' + eRight + '</li>';
		  	debug += '<li>height:' + eBottom + '</li>';
		  	debug += '<li>width:' + windowWidth + '</li>';
		  	debug += '</ul>';
		  	debug += '</li>';
		  	
		  	debug += '<li style="color:#797923">Component Bottom';
		  	debug += '<ul>';
		  	debug += '<li>top:' + eBottom + '</li>';
		  	debug += '<li>left:' + valueLeft + '</li>';
		  	debug += '<li>height:' + windowHeight + '</li>';
		  	debug += '</ul>';
		  	debug += '</li>';
		  	
		  	debug += '</ul>';
				$('#debug-darkensaroundme').html(debug);
			}
		}
		
		function scrollToElement(element) {
			$('body').stop()
							.animate({
								scrollTop: $(element).offset().top - opts.scrollTopDistance
							}, opts.scrollTopDuration , 'linear', afterScrollTop);
		}
		
		function afterScrollTop() {
			opts.afterScrollTop($this);
		}
		
		function setStyleDebug() {
			$('#debug-darkensaroundme').css({
				position: 'fixed',
				background: '#000',
				right: 0,
				bottom: 0,
				color: '#fff',
				width: 200,
				zIndex: 9999
			});
		}
		
		function shutDownDarknes() {
			$('.darkens-components').fadeOut('fast',function() {
				$(this).remove();
				$('#debug-darkensaroundme').remove();
			});
		}
		
		function applyChangesToDarkness() {
			rePosition($this);
		}
		
		function setStyleDarkness() {
			
			var $opacity = opts.debug?1:opts.opacity;
			$('.darkens-components').css({
				display:'none',
				position:'fixed',
				zIndex:9998,
				background: opts.colorDarkens,
				opacity: $opacity,
				color: '#fff'
			});
		}
		function isScrolledIntoView(elem) {
	    var docViewTop = $(window).scrollTop();
	    var docViewBottom = docViewTop + $(window).height();
	
	    var elemTop = $(elem).offset().top;
	    var elemBottom = elemTop + $(elem).height();
		
			return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
		}
		
		return this;
	};
})(jQuery);
