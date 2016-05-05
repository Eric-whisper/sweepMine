//document.write("<script language='javascript' src='jquery.js'></script>");
/*document.oncontextmenu = function ()
{
	return false                        //**********
}*/
var level=levelModel();
var mineTable=new Array();
var sweepStep=0;                         //���׵ĸ���
var flagStep=0;                       //����׵�λ����ȷ�ĸ���
var inGame=0;           //0Ϊ��Ϸû��ʼ��2Ϊ��Ϸ�Ѿ���ʼ����ɵ��û���δ���1Ϊ��Ϸ�Ѿ���ʼ
var flagNum=0;           //�ѱ�ǵ��׵ĸ���������ͳ��ʣ�µ��׵ĸ���
var startTime;
window.onload=function(){
	startGame();
}
function changeLevel(elem)           //�ı���Ϸ���ѵȼ�
{
	levelnum=elem.getAttribute("value");
		switch(levelnum)
	{
		case "1":
		   level.row=9;
		   level.col=9;
		   level.mine=10;
		   break;
		case "2":
		   level.row=16;
		   level.col=16;
		   level.mine=40;
		   break;
		case "3":
		   level.row=16;
		   level.col=30;
		   level.mine=99;
		   break;
		default:
		   alert("ϵͳ���ִ���");
		   break;
    }
	startGame();
}
function levelModel(){                 //��Ϸ�Ѷ�ģ��
       var  model = new Object();  
       model.row=9;  
       model.col=9;
       model.mine=10;	   
       return model;  
};
function startGame()              //��ʼ����Ϸ
{   
   //console.log(level);
    mineTable=initTable(level);  
    mineTable=layMine(mineTable,level);
	mineTable=valueJudge(mineTable,level);
	console.log(mineTable);
	showGraph(mineTable,level); 
    inGame=2;
	sweepStep=0;
    flagStep=0;                      
    flagNum=0; 
	restMine();
}
function initTable(level)   //��ʼ��table
{
	var table=new Array();
	for(var i=0;i<level.row;i++)                 
	{	
        table[i]=new Array();           //****
        for(var j=0;j<level.col;j++)
		{
			table[i][j]=mineStatus();     //*****
		}
	}
	return table;
}
function mineStatus(){                 //����ģ��
       var  cel = new Object();  
       cel.status=0;  
       cel.value=0;  
       return cel;  
};
function layMine(table,level)             //����
{
	var i=0;
	var currentMine;
   var rowNum,cloumnNum;
	while(i<level.mine)
	{
		currentMine=Math.ceil(Math.random()*level.row*level.col);
		if( table[Math.ceil(currentMine/level.col)-1][currentMine%level.col].value!=-1)
	  	{
		  table[Math.ceil(currentMine/level.col)-1][currentMine%level.col].value=-1;         //-1��������
		   i++;
    	}
	}
	return table;
}
function showGraph(table,level)                 //��ʼ����Ϸ����
{
	 $("#mine").empty();
	 var str;
	 for(var i=0;i<level.row;i++)
    {
		str="<tr>";
		for(var j=0;j<level.col;j++)		
        {
	    	str+="<td class='tg' xrow="+i+" xcol="+j+" onmousedown='change(this)'></td>";
	    }	
		str+="</tr>";
		$("#mine").append(str);
	}
}
function valueJudge(table,level)
{
	var num=0;
	for(var i=0;i<level.row;i++)
	{	
        for(var j=0;j<level.col;j++)
		{
			num=0;
			if(table[i][j].value!=-1)     //�ж������Ƿ�����
			{
				if(i-1>=0&&j-1>=0&&table[i-1][j-1].value==-1)           num++;//�ж�����
			    if(j-1>=0&&table[i][j-1].value==-1)                     num++;//�ж�����
				if(i+1<level.row&&j-1>=0&&table[i+1][j-1].value==-1)          num++;//�ж�����
				if(i-1>=0&&table[i-1][j].value==-1)                     num++;//�ж�����
				if(i+1<level.row&&table[i+1][j].value==-1)                    num++;//�ж�����
				if(i-1>=0&&j+1<level.col&&table[i-1][j+1].value==-1)       num++;//�ж�����
				if(j+1<level.col&&table[i][j+1].value==-1)                 num++;//�ж�����
				if(i+1<level.row&&j+1<level.col&&table[i+1][j+1].value==-1)      num++;//�ж�����
				table[i][j].value=num;
			}
		}
	}
	return table;
}
function change(elem)
{  
    if(inGame==2)
	{
	inGame=1;
	var now = new Date();  
    startTime = now.getTime(); 	
	timer();
	}
   	var row=$(elem).attr("xrow");
	var col=$(elem).attr("xcol");
	var btnNum=window.event.button;
	var flag=mineTable[row][col].status;
	if(btnNum==0)      //�ж��������¼�
	{
		if(mineTable[row][col].value==-1)     //�ڵ�����
		{
			mineTable[row][col].status=1;
			$(elem).removeClass("tg");
			$(elem).addClass("tg4");
			gameover(-1);
		}
		else 
		{
            if(mineTable[row][col].value==0)
			{
				//var b= parseInt(row)+1;
				//console.log("ww"+b+"qqq");
			 	judgeZero(row,col);
			}
			else{
			mineTable[row][col].status=1;
			$(elem).removeClass("tg");
			$(elem).addClass("tg1 num"+mineTable[row][col].value);
			$(elem).html(mineTable[row][col].value);
			sweepStep++;
			}
		}
	}
	else if(btnNum==2)      //�ж�����һ��¼�
	{
		if(flag==0)   //ԭ��Ϊδ����
		{
           mineTable[row][col].status=2;
		   $(elem).removeClass("tg");
	       $(elem).addClass("tg2");
		   if(mineTable[row][col].value==-1)
		   flagStep++;
		   flagNum++;
		   restMine();
		}
		if(flag==2)    //ԭ��Ϊ���
		{
           mineTable[row][col].status=0;
		   $(elem).removeClass("tg2");
	       $(elem).addClass("tg");
		  if(mineTable[row][col].value==-1)
		   flagStep--;
	      flagNum--;
		  restMine();
		}
	}
	isvictory(level);
}
function judgeZero(row,col)
{
	//var a=row+1;
	//var b=col+1;
	console.log(row+"xxx"+level.row+"dd");
    if(row>=0&&row<level.row&&col>=0&&col<level.col&&mineTable[row][col].status==0)
	{
		if(mineTable[row][col].value==0)
		{
			mineTable[row][col].status=1;
			$("#mine tr:eq("+row+") td:eq("+col+")").removeClass("tg");
		    $("#mine tr:eq("+row+") td:eq("+col+")").addClass("tg1");       //����valueֵΪ0��ʱ���״̬
		    sweepStep++;
			judgeZero(parseInt(row)+1,parseInt(col)+1);
			judgeZero(row,parseInt(col)+1);
			judgeZero(parseInt(row)-1,parseInt(col)+1);
			judgeZero(parseInt(row)-1,parseInt(col)-1);
			judgeZero(row,col-1);
			judgeZero(parseInt(row)+1,parseInt(col)-1);
			judgeZero(parseInt(row)-1,col);
			judgeZero(parseInt(row)+1,col);
		}
		else
		{
		  mineTable[row][col].status=1;
		  $("#mine tr:eq("+row+") td:eq("+col+")").removeClass("tg");
		  $("#mine tr:eq("+row+") td:eq("+col+")").addClass("tg1 num"+mineTable[row][col].value);
		  $("#mine tr:eq("+row+") td:eq("+col+")").html(mineTable[row][col].value);
		  sweepStep++;
		}
	}	
	console.log(row+"s"+col)
}
function gameover(status)
{
	inGame=0;
	if(status==-1)
	{
	  showMine();           //ȱһ�ε���ȫ������ʾ�Ĵ���
      var r=confirm("��Ϸ������!Ҫ����һ����");
      if (r==true)
     {
       startGame();
     }
     else
     {
      alert("�����ߵ��Ѷ�ѡ��������¿�ʼ��");    
     }
	}
	else if(status==0)
	{
		 var r=confirm("��ϲ��ʤ���ˣ�Ҫ����һ����");
      if (r==true)
       startGame();
      else
     alert("�����ߵ��Ѷ�ѡ��������¿�ʼ��");    
	}
}
function isvictory(level)
{
	if(sweepStep==level.row*level.col-level.mine&&flagStep==level.mine)
	gameover(0);
	console.log(sweepStep+"s"+flagStep);
}
function timer(){  
    if(inGame == 1) {  //ֻ����Ϸ�����м�ʱ  
        var now = new Date(),  
            ms = now.getTime();  
        $('#time').text(Math.ceil((ms - startTime) / 1000));  
        if(inGame == 1) setTimeout(function() { timer(); }, 500);  
    } else if(inGame == 2) {  
        $('#time').text('0');  
    }  
} 
function restMine(){
	var num=level.mine-flagNum;
	 $('#restMine').text(num);  
}		
function showMine()
{   
    var row=level.row;
	var col=level.col;
	console.log(row+"aa"+col);
	for(var i=0;i<row;i++)
	{
		for(var j=0;j<col;j++)
		{
			if((mineTable[i][j].status==0)&&(mineTable[i][j].value==-1))   //������δ��ǵĵ�����ʾ����
			{
				mineTable[i][j].status=1;
			    $("#mine tr:eq("+i+") td:eq("+j+")").removeClass("tg");
		        $("#mine tr:eq("+i+") td:eq("+j+")").addClass("tg3"); 
			}
			       //ȱ��һ����ʾ�����ǵ��׵Ĵ���
		}
	}	
}							 
										 