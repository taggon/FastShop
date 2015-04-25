// 이미지 슬라이더 플러그인 제작
(function($){
	var defaults = {
		period : 400
	};

	$.fn.carousel = function(options) {
		var opt = $.extend({}, defaults, options);
		var self = this;

		self.find('li').appendTo(self.find('ul'));

		self
			.data('currentIndex', 0)
			.on('move', function(event, step){
				// 애니메이션 도중이면 사용자 입력을 무시한다.
				if (self.find('li:first').is(':animated')) {
					return;
				}

				var currentIndex = self.data('currentIndex');
				currentIndex = currentIndex + step;

				var maxIndex = self.find('li').length - 1;

				if (step < 0 && currentIndex < 0) {
					currentIndex =  maxIndex;
				} else if (step > 0 && currentIndex > maxIndex ) {
					currentIndex = 0;
				}

				self
					.data('currentIndex', currentIndex)
					.find('li:first').animate(
						{'margin-left': -currentIndex*self.width()},
						opt.period,
						function(){ self.trigger('mouseleave'); }
					);
			})
			.on('click', '.prev', function(event){
				event.preventDefault();
				self.trigger('move', [-1]);
			})
			.on('click', '.next', function(event){
				event.preventDefault();
				self.trigger('move', [1]);
			})
			.on('mouseenter', function(event){
				clearTimeout(self.data('timer'));
			})
			.on('mouseleave', function(event){
				var timer = setTimeout(function(){
					self.trigger('move', [1]);
				}, 1000);

				self.data('timer', timer);
			})
			.trigger('mouseleave');
	};
})(window.jQuery);
