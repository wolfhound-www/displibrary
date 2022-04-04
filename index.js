layui.use(['element', 'layer', 'util', 'table'], function(){
	var element = layui.element
	,layer = layui.layer
	,util = layui.util
	,table = layui.table
	,$ = layui.$;
	var search = ""
	,scrollTop = 0;

	$(".update-date").ready(function(){
		$(".update-date").html("更新日期："+updateDate);
	});
	//头部事件
	util.event('lay-header-event', {
		//左侧菜单伸缩事件
		menuLeft: function(othis){
			if ($(".layui-side").css("display") == "none") {
				scrollTop = $('.layui-table-body').scrollTop();
				$(".layui-side").css("display","block");
				$(".layui-body").css("left","200px");
				table.reload('fileListRender',{cols: [colsData]});
			} else {
				scrollTop = $('.layui-table-body').scrollTop();
				$(".layui-side").css("display","none");	
				$(".layui-body").css("left","0");			
				table.reload('fileListRender',{cols: [colsData]});
			}
		}
	});
	//数据加载事件
	$(".file-nav-item").click(function(){
		table.reload('fileListRender',{cols: [colsData],url: 'json/'+this.id+'.json'});
	});
	//搜索事件
	var colsData = [{field:'num', title: '序号', width:60, unresize:true, type:'numbers'}
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
	]
	$("#searchBtn").click(function(){
		search = $("#search").val().replace(/(^\s*)|(\s*$)/g,"");
		if (search == "") {
			colsData[2].title = '名称';
		} else {
			colsData[2].title = "名称<span class='layui-badge layui-bg-green keyword'>"+search+"</span>";
		}
		table.reload('fileListRender',{cols: [colsData]});
	});
	//表格渲染事件
	table.render({
		elem: '#fileList'
		,id: 'fileListRender'
		,url: "json/CN_CCAR.json"
		,height: 'full-80'
		,cols: [colsData]
		,done:function(res){
			var that = this.elem.next();
			this.cols = [];
			res.data.forEach(function (item, index) {
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
	//监听窗口变化事件
	$(window).resize(function(){
		scrollTop = $('.layui-table-body').scrollTop();
		table.reload('fileListRender',{cols: [colsData]});
	});
});