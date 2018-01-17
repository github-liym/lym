/**
 * Created by 94216 on 2017/12/6.
 */
// 星级评分
var rating = (function () {
	// 策略
	var strategies = {
		entire: function () {
			return 1;
		},
		half: function () {
			return 2;
		},
		quarter: function () {
			return 4;
		}
	};
	var ratingText = ["非常差","差","一般","好","非常好"];
	// 评分
	var Rating = function (el,options) {
		this.$el = $(el);
		this.opts = $.extend({}, Rating.DEFAULTS,options);

		if(this.$el.data('readonly')){
			this.opts.readOnly = true;
		}

		if(!strategies[this.opts.mode]){
			this.opts.mode = 'entire';
		}
		this.ratio = strategies[this.opts.mode]();

		this.opts.total *= this.ratio;
		this.opts.num *= this.ratio;

		this.itemWidth = 24 / this.ratio;
		this.displayWidth = this.opts.num * this.itemWidth;
	};
	// 默认值
	Rating.DEFAULTS = {
		total: 5, // 星星总数
		num: 4, //默认点亮
		readOnly: false, //是否只读
		text: true,// 是否文字描述
		select: function () {}, // 鼠标经过触发
		chosen: function () {} // 选择触发
	};
	Rating.prototype = {
		init: function () {
			this.buildHTML();
			this.setCSS();
			if(!this.opts.readOnly){
				this.bindEvent();
			}
		},
		buildHTML: function () {//创建html
			var html = '';
			html +='<div class="rating-display"></div><ul class="rating-mask">';
			for(var i=0;i<this.opts.total; i++){
				html += '<li class="rating-item"></li>';
			}
			html +='</ul>';
			if (this.opts.text){
				html +='<span class="rating-text">'+ratingText[this.opts.num-1]+'</span>';
			}


			this.$el.html(html);
		},
		setCSS: function () { //设置css样式
			this.$el.width(this.opts.total*this.itemWidth);
			this.$display = this.$el.find('.rating-display');
			if (this.opts.text){
				this.$text = this.$el.find('.rating-text');
			}
			this.$display.width(this.displayWidth);
			this.$el.find(".rating-item").width(this.itemWidth);
		},

		bindEvent: function () {//绑定事件
			var self = this;
			self.$el.on('mouseover','.rating-item',function () {
				var count = $(this).index() + 1;
				self.$display.width(count * self.itemWidth);

				(self.opts.text) && self.$text.html(ratingText[count-1]);

				(typeof self.opts.select === 'function') && self.opts.select.call(this, count, self.opts.total);
				self.$el.trigger('select',[count,self.opts.total]);


			}).on('click','.rating-item',function () {
				var count = $(this).index()+1;
				self.displayWidth = count * self.itemWidth;
				self.opts.num = count;
				(self.opts.text) && self.$text.html(ratingText[count-1]);
				(typeof self.opts.chosen === 'function') && self.opts.chosen.call(this, count, self.opts.total);
				self.$el.trigger('chosen',[count,self.opts.total]);
			}).on('mouseout',function () {
				self.$display.width(self.displayWidth);
				(self.opts.text) && self.$text.html(ratingText[self.opts.num-1]);
			});
		},
		unbindEvent: function () {//解绑事件
			// console.log(this.$el);
			this.$el.off();
		}
	};
	var init = function (el,option) {
		var $el = $(el);
		// console.log("rating-init");
		$el.each(function () {
			var rating = $(this).data('rating');
			if(!rating){
				$(this).data('rating', (rating = new Rating(this, typeof option === 'object' && option)));
				rating.init();
			}
			if (typeof option === 'string') rating[option]();
			// console.log($(this).data('rating'));
		});

	};

	$.fn.extend({
		rating: function (option) {
			return init(this,option);
		}
	});

	return {
		init: init
	};
})();

$(function(){
	// =====星级评分 start=====
	/*rating.init('.rating',{
	 total: 6,
	 num: 3,
	 select: function (count, total) {

	 },
	 chosen: function (count, total) {
	 rating.init(this.closest(".rating"),'unbindEvent');
	 }
	 });*/
	$(".rating").rating({
		select: function (count, total) {

		},
		chosen: function (count, total) {
			// rating.init(this.closest(".rating"),'unbindEvent');
		}
	});
	// =====星级评分 end=====
	// active 切换
	$(".switch-panel").on("click",".switch-item",function () {
		$(this).addClass("active").siblings(".switch-item").removeClass("active");
	});
	$(".dateInput").calendar({
		dateFormat: 'yyyy-mm-dd'
	});
});
