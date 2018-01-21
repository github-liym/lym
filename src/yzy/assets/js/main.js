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
		num: 0, //默认点亮
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

var calendar = (function () {
	var Calendar = function (el,options) {
		this.$el = $(el);
		console.log(el)
		this.opts = $.extend({}, Calendar.DEFAULTS,options);
	};
	Calendar.DEFAULTS = {
		template: '<a>ddd</a>'
	};
	Calendar.prototype = {
		/*初始化*/
		init: function () {
			this.buildHTML();
			// this.maxDayOfDate();
			// console.log(this.dateOfWeek('2018,1'));
		},
		/*创建html*/
		buildHTML: function () {
			var html = '';
			var dateHd = '<div class="calendar-hd"> <a href="javascript:" class="calendar-arrow"> <i class="iconfont icon-angle__left"></i> </a> <a href="javascript:" class="calendar-month"> 12月 </a> <a href="javascript:" class="calendar-arrow"> <i class="iconfont icon-angle__right"></i> </a> </div>';
			var dataBd = '';
			var myDate = new Date("2018/02/19");
			var year = myDate.getFullYear();
			var month = myDate.getMonth()+1;
			console.log(month)
			dataBd += '<div class="calendar-bd">' +
				'<ul class="calendar-week clearfix"> <li>周日</li> <li>周一</li> <li>周二</li> <li>周三</li> <li>周四</li> <li>周五</li> <li>周六</li> </ul>' +
				'<ul class="calendar-date clearfix">';

			console.log(this.dateOfWeek(year+'/'+(month)));
			/*上个月*/
			for (var i=1;i<=this.dateOfWeek(year+'/'+(month))-1;i++) {
				dataBd+= '<li>' +
						'<a href="javascript:" class="date-item">' +
							'<span class="icon i-star on"></span>' +
							'<span class="text">'+i+'</span>' +
						'</a>' +
					'</li>'
			}
			/*本月*/
			for (var i=1;i<=this.maxDayOfDate(year,month);i++) {
				dataBd+= '<li>' +
						'<a href="javascript:" class="date-item">' +
							'<span class="icon i-star on"></span>' +
							'<span class="text">'+i+'</span>' +
						'</a>' +
					'</li>'
			}
			dataBd += '</ul></div>';
			html += dateHd;
			html += dataBd;
			this.$el.html(html);
		},
		/*判断日期是星期几*/
		dateOfWeek: function (data) {
			return new Date(data).getDay()
		},
		/*取日期所在月的最大天数*/
		maxDayOfDate: function (year,month) {
			var initDate = new Date(year,month,0);
			return initDate.getDate()
		},
		/*把日期分割成数组*/
		toArray: function (data) {
			var myArray = Array();
			myArray[0] = data.getFullYear();
			myArray[1] = data.getMonth();
			myArray[2] = data.getDate();
			myArray[3] = data.getHours();
			myArray[4] = data.getMinutes();
			myArray[5] = data.getSeconds();
			return myArray;
		},
		/*日期计算*/
		DateAdd: function () {

		},
		/*判断闰年 */
		isLeapYear: function () {

		},
		/*日期格式化*/
		Format: function () {

		},
		/*比较日期差*/
		DateDiff: function () {

		},
		/*日期转字符串*/
		toString: function () {

		},
		/*取日期的部分信息*/
		DatePart: function () {

		},
		/*判断日期所在年的第几周*/
		WeekNumOfYear: function () {

		},
		/*字符串转日期型  */
		StringToDate: function () {

		},
		/*验证日期有效性*/
		IsValidDate: function () {

		},
		/*完整日期时间检查*/
		CheckDateTime: function () {

		},
		/*日期天数差*/
		daysBetween: function () {

		}
	};
	var init = function (el,option) {
		var $el = $(el);
		$el.each(function () {
			var calendar = $(this).data('calendar');
			if(!calendar){
				$(this).data('calendar', (calendar = new Calendar(this, typeof option === 'object' && option)));
				calendar.init();
			}
			if (typeof option === 'string') calendar[option]();
			// console.log($(this).data('rating'));
		});

	};
	return {
		init: init
	}
})();

$(function(){
	calendar.init('.calendar',{

	});
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
		text: false,
		select: function (count, total) {

		},
		chosen: function (count, total) {
			// rating.init(this.closest(".rating"),'unbindEvent');
		}
	});
	// =====星级评分 end=====

	$("#inline-calendar").calendar({
		container: "#inline-calendar",
		input: "#date3"
	});

	// active 切换
	$(".switch-panel").on("click",".switch-item",function () {
		$(this).addClass("active").siblings(".switch-item").removeClass("active");
	});
	$(".dateInput").calendar({
		dateFormat: 'yyyy-mm-dd'
	});
});
