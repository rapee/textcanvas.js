

;(function($) {

$.fn.textCanvas = function(options) {

	var getCharsFit = function(context, text, startlength) {
		var i = startlength || 100, w=Infinity, cw=context.canvas.width;
		while (i>=0 && w > cw) {
			var metric = context.measureText(text.slice(0, i));
			w = metric.width;
			i--;
		}
		return i;
	};

	options = $.extend({}, $.textCanvas.defaults, options);

	this.each(function() {
		var canvas, $this=$(this), txt=$this.text(),w=$this.width(), h=$this.height();
		canvas = $('<canvas width="'+w+'" height="'+h+'"/>');
		var context = canvas[0].getContext('2d');
  		if (context) {
  			var 
  			line,
  			lineH=0,
  			fstyle=[
  				$this.css('font-weight'),
  				$this.css('font-size'),
  				$this.css('font-family')
  			],
  			fontsize = parseInt($this.css('font-size').slice(0, -2)),
  			lineheight = parseInt($this.css('line-height').slice(0, -2));
  			// Set font style
			context.font         = fstyle.join(' ');
			context.textBaseline = 'alphabetic';
			// Create gradient
			var metric = context.measureText(txt);
			metric.height = context.measureText('M').width; // Fake height from 'M'
			// Draw each line
			while (txt.length > 0) {
				// Calculate fit width
				var len = getCharsFit(context, txt, Math.ceil(w/fontsize)*2);
				line = txt.slice(0, len);
				txt = txt.slice(len)
				// *** 
				var gradient = context.createLinearGradient(0, lineH + (lineheight-metric.height)/2, 0, lineH + (lineheight-metric.height)/2+metric.height),
				g_pos=0,
				g_step=1.0/options.colorStops.length;
				for (var i=0; i<options.colorStops.length; i++) {
					gradient.addColorStop(g_pos, options.colorStops[i]);
					g_pos += g_step;
				}
				// ***
	  			context.fillStyle    = gradient; //'#111';
				context.fillText  (line, 0, lineH + (lineheight-metric.height)/2+metric.height);
				lineH += lineheight;
			}
  		}
  		/*
  		if (($contents = $this.contents()) && $contents.length == 1 && $contents.is('a')) {
  			canvas = $contents.clone().empty().wrapInner(canvas);
  		}
  		*/
  		canvas.addClass('texttc');
		$this.before(canvas).css({
			'margin-top': -$this.outerHeight(true)+'px',
			'width': $this.width()+'px',
		}).addClass('texttc-hidden');
	});
};

$.textCanvas = {
	defaults: {
		colorStops: ['red', 'blue'],
		direction: 'vertical'
	}
};

})(jQuery);

$(document).ready(function() {
	$('h1').textCanvas({
		colorStops: ['#fff', '#fff', '#fff', '#ccc']
	});
	$('.paper h2').textCanvas({
		colorStops: ['#aaa', '#000']
	});
});