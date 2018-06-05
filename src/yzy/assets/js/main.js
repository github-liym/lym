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


			}).on('touchend','.rating-item',function () {
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
	//页面加载初始化年月
	var mydate = new Date();
	$(".f-year").html( mydate.getFullYear() );
	$(".f-month").html( mydate.getMonth()+1 );
	showDate(mydate.getFullYear(),mydate.getMonth()+1);
	//日历上一月
	$(".calendar-last ").click(function(){
		var mm = parseInt($(".f-month").html());
		var yy = parseInt($(".f-year").html());
		if( mm == 1){//返回12月
			$(".f-year").html(yy-1);
			$(".f-month").html(12);
			showDate(yy-1,12);
		}else{//上一月
			$(".f-month").html(mm-1);
			showDate(yy,mm-1);
		}
	})
	//日历下一月
	$(".calendar-next").click(function(){
		var mm = parseInt($(".f-month").html());
		var yy = parseInt($(".f-year").html());
		if( mm == 12){//返回12月
			$(".f-year").html(yy+1);
			$(".f-month").html(1);
			showDate(yy+1,1);
		}else{//上一月
			$(".f-month").html(mm+1);
			showDate(yy,mm+1);
		}
	})
	//返回本月
	/*$(".f-btn-fhby").click(function(){
		$(".f-year").html( mydate.getFullYear() );
		$(".f-month").html( mydate.getMonth()+1 );
		showDate(mydate.getFullYear(),mydate.getMonth()+1);
	})*/

	//读取年月写入日历  重点算法!!!!!!!!!!!
	function showDate(yyyy,mm){
		var dd = new Date(parseInt(yyyy),parseInt(mm), 0);   //Wed Mar 31 00:00:00 UTC+0800 2010
		var daysCount = dd.getDate();            //本月天数
		var mystr ="";//写入代码
		var icon = "";//图标代码
		var today = new Date().getDate(); //今天几号  21
		var monthstart = new Date(parseInt(yyyy)+"/"+parseInt(mm)+"/1").getDay()//本月1日周几
		var lastMonth; //上一月天数
		var nextMounth//下一月天数
		if(  parseInt(mm) ==1 ){
			lastMonth = new Date(parseInt(yyyy)-1,parseInt(12), 0).getDate();
		}else{
			lastMonth = new Date(parseInt(yyyy),parseInt(mm)-1, 0).getDate();
		}
		if( parseInt(mm) ==12 ){
			nextMounth = new Date(parseInt(yyyy)+1,parseInt(1), 0).getDate();
		}else{
			nextMounth = new Date(parseInt(yyyy),parseInt(mm)+1, 0).getDate();
		}
		//计算上月空格数
		for(j=monthstart;j>0;j--){
			mystr +='<li>' +
				'<a href="javascript:" class="date-item calendar-lastMonth is-disabled">' +
				// '<span class="icon i-star"></span>' +
				'<span class="text">'+(lastMonth-j+1)+'</span>' +
				'</a>' +
				'</li>';
		}

		//本月单元格
		for(i=0;i<daysCount;i++){
			//这里为一个单元格，添加内容在此
			mystr += '<li>' +
				'<a href="javascript:" class="date-item">' +
				'<span class="icon i-star on"></span>' +
				'<span class="text">'+(i+1)+'</span>' +
				'</a>' +
				'</li>';
		}

		//计算下月空格数
		for(k=0; k<42-(daysCount+monthstart);k++ ){//表格保持等高6行42个单元格

			mystr += '<li>' +
				'<a href="javascript:" class="date-item is-disabled">' +
				// '<span class="icon i-star"></span>' +
				'<span class="text">'+(k+1)+'</span>' +
				'</a>' +
				'</li>';
		}



		//写入日历
		$(".calendar-bd .calendar-date").html(mystr);
		//给今日加class
		if( mydate.getFullYear() == yyyy){
			if( (mydate.getMonth()+1 ) == mm){
				var today = mydate.getDate();
				var lastNum = $(".calendar-lastMonth").length;
				$(".calendar-date .date-item").eq(today+lastNum-1).addClass("active");
			}
		}


	}



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


	// 播放视频
	$(".videoBox").on("click",function () {
		var videoUrl = $(this).data("video");
		$("body").prepend('<video id="videoPreview" src="'+videoUrl+'" x5-video-player-type="h5" x5-video-orientation="portrait" x5-video-player-fullscreen="true" onpause="videoClose()"></video>');
		var docElm=document.getElementById("videoPreview");
		docElm.play();
	});
	// 播放视频
});
function videoClose() {
	$("#videoPreview").remove();
};
