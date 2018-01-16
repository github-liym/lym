/**
 * Created by 94216 on 2017/12/6.
 */
$(function(){
	// active 切换
	$(".switch-panel").on("click",".switch-item",function () {
		$(this).addClass("active").siblings(".switch-item").removeClass("active");
	});
	$(".dateInput").calendar({
		dateFormat: 'yyyy-mm-dd'
	});
});
