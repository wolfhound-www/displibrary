layui.use(['element', 'layer', 'util', 'table'], function(){
	var element = layui.element
	,layer = layui.layer
	,util = layui.util
	,table = layui.table
	,$ = layui.$
	//头部事件
	util.event('lay-header-event', {
		//左侧菜单事件
		menuLeft: function(othis){
			if ($(".layui-side").css("display") == "none") {
				$(".layui-side").css("display","block");
				$(".layui-logo").css("display","block");
				$(".layui-layout-left").css("left","200px");
				$(".layui-body").css("left","200px");
			} else {
				$(".layui-side").css("display","none");
				$(".layui-logo").css("display","none");
				$(".layui-layout-left").css("left","0");	
				$(".layui-body").css("left","0");			
			}
		}
	});
	//搜索事件
	var search = "";
	$("#searchBtn").click(function(){
		search = $("#search").val().replace(/(^\s*)|(\s*$)/g,"");
		if (search != "") {
			$("#searchTips").html("<span class='layui-badge keyword' style='background-color: transparent;'>当前搜索关键词：</span><span class='layui-badge layui-bg-green keyword'>"+search+"</span>");
		} else {
			$("#searchTips").html("");
		}
		table.reload('fileListRender');
	});
	//数据加载事件
	$(".file-nav-item").click(function(){
		table.reload('fileListRender',{url: 'json/'+this.id+'.json'});
	});
	//表格渲染事件
	table.render({
		elem: '#fileList'
		,id: 'fileListRender'
		,url: "json/CN_CCAR.json"
		,height: 'full-80'
		,cols: [[
			{field:'num', title: '序号', width:60, unresize:true, type:'numbers'}
			,{field:'fileId', title: '文号', sort:true, width:200, unresize:true}
			,{field:'fileName', title: '名称', sort:true, unresize:true, templet: '<div><a href="{{d.url}}"  target="_blank">{{d.fileName}}</a></div>'}
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
		]]
		,done:function(res){
			var that = this.elem.next();
			res.data.forEach(function (item, index) {
				if (search != "") {
					if (item.fileId.search(new RegExp(search, 'i')) == -1 && item.fileName.search(new RegExp(search, 'i')) == -1 && item.fileTag.search(new RegExp(search, 'i')) == -1 && item.fileKeyword.search(new RegExp(search, 'i')) == -1) {
						var tr = that.find(".layui-table-box tbody tr[data-index='" + index + "']");
						tr.css("display", "none");
				}}
			});
		}
	});
});