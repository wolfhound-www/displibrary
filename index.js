layui.$("#update-date").append(updateDate);
layui.$("#update-date").css("color","");

const favicon = document.querySelector('link[type="image/svg+xml"]');
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  thisMode = 'dark';
} else {
  thisMode = 'light';
}
window.matchMedia('(prefers-color-scheme: '+ thisMode + ')').addEventListener('change', e => {
    favicon.setAttribute('href','favicon.svg'+'?'+Date.now());
});

layui.use(['element', 'layer', 'util', 'table'], function(){
	var element = layui.element
	,layer = layui.layer
	,util = layui.util
	,table = layui.table
	,$ = layui.$;
	var search = ""
	,scrollTop = 0
	,itemCounter = 0
	,tagCounter = 0
	,keywordCounter = 0;
	var colsData = [{field:'num', title: '序号', width:60, unresize:true, type:'numbers'}
		,{field:'fileId', title: '文号', width:200, unresize:true}
		,{field:'fileName', title: '名称', unresize:true, templet: '<div><a href="{{d.url}}"  target="_blank">{{d.fileName}}</a></div>'}
		,{field:'fileTag', title: '标签', width:220, unresize:true
			, templet: function(d){
				var tags=d.fileTag.split(" ");
				var fileTagDisplay="";
				if (d.fileTag != ""){
					tags.forEach(function(item){
						fileTagDisplay+="<span class='layui-badge layui-bg-green tag'>"+item+"</span>";
					});
				}
				return fileTagDisplay;
		}}
	]
	//表格渲染事件
	table.render({
		elem: '#fileList'
		,id: 'fileListRender'
		,data: dataCN_CCAR
		,height: 'full-80'
		,limit: 200
		,cols: [colsData]
		,done:function(res){
			var that = this.elem.next();
			this.cols = [];
			res.data.forEach(function (item, index){
				if (search != "") {
					if (item.fileId.search(new RegExp(search, 'i')) == -1 && item.fileName.search(new RegExp(search, 'i')) == -1 && item.fileTag.search(new RegExp(search, 'i')) == -1 && item.fileKeyword.search(new RegExp(search, 'i')) == -1) {
						var tr = that.find(".layui-table-box tbody tr[data-index='" + index + "']");
						tr.css("display", "none");
				}}
			});
			$('.layui-table-body').scrollTop(scrollTop);
			scrollTop = 0;
		}
	});
	//网页加载
	$(function(){
		$("#headnav .layui-hide-xs a").each(function(){
			$("#smLink dl").append("<dd>");
			$("#smLink dl").append($(this).clone());
			$("#smLink dl").append("</dd>");
		});
		$("#menu dd a").each(function(){
			var obj = eval('data'+this.id);
			itemCounter += obj.length;
			$.each(obj, function(){
				if (this.fileTag.trim()){
					this.fileTag.replace(/\S\s+\S/g,function(){tagCounter+=1});
					tagCounter += 1;
				};
				if (this.fileKeyword.trim()){
					this.fileKeyword.replace(/\S\s+\S/g,function(){keywordCounter+=1});
					keywordCounter += 1;
				};
			});
		});
		/*$("#notice").append("<tr><td width=80px>收录资料：</td><td>"+itemCounter+"</td></tr><tr><td>标签：</td><td>"+tagCounter+"</td></tr><tr><td>关键词：</td><td>"+keywordCounter+"</td></tr>");*/
	});
	//数据加载事件
	$(".file-nav-item").click(function(){
		table.reload('fileListRender',{cols: [colsData],data: eval('data'+this.id)});
	});
	//搜索事件
	$("#searchBtn").click(function(){
		search = $("#search").val().trim();
		if (search == "") {
			colsData[2].title = '名称';
		} else {
			colsData[2].title = "名称<span class='layui-badge layui-bg-green keyword'>"+search+"</span>";
		}
		table.reload('fileListRender',{cols: [colsData]});
	});
	//头部事件
	util.event('lay-header-event', {
		//左侧菜单伸缩事件
		menuLeft: function(othis){
			if ($(".layui-side").css("display") == "none") {
				scrollTop = $('.layui-table-body').scrollTop();
				$(".layui-side").css("display","block");
				$(".layui-body").css("left","200px");
				$("#subTitle").html("");
				$(".layui-logo").removeClass("logo-small");
				$("#title").removeClass("title");
				table.reload('fileListRender',{cols: [colsData]});
			} else {
				scrollTop = $('.layui-table-body').scrollTop();
				$(".layui-side").css("display","none");	
				$(".layui-body").css("left","0");
				$(".layui-logo").addClass("logo-small");
				$("#title").addClass("title");
				$("#subTitle").html("<br>—&nbsp;&nbsp;"+$(".layui-this a").attr("name")+"&nbsp;&nbsp;—");		
				table.reload('fileListRender',{cols: [colsData]});
			}
		}
	});
	//监听窗口变化事件
	$(window).resize(function(){
		scrollTop = $('.layui-table-body').scrollTop();
		setTimeout(table.reload('fileListRender',{cols: [colsData]}), 100);
	});
});