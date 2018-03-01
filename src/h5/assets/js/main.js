/**
 * Created by 94216 on 2018/2/26.
 */
function turn() {
	var num1 = document.getElementById("num1");
	num1.className = num2.className = num3.className = "num";
	num1.style.bottom = num2.style.bottom = num3.style.bottom = "-500%";
	var num = [];

	/*随机数获取:[0,0,0]*/
	for(var i=0;i<3;i++){
		num[i] = Math.floor(Math.random()*10);
	}
	console.log(num);
	/*随机数获取 end*/

	setTimeout(function () {
		num1.className = num2.className = num3.className = "num moving"
		num1Top = -((num[0]-1)*100+7000)+'%';
		num2Top = -((num[1]-1)*100+8000)+'%';
		num3Top = -((num[2]-1)*100+10000)+'%';
		num1.style.bottom = num1Top;
		num2.style.bottom = num2Top;
		num3.style.bottom = num3Top;
	},10)

}

