<template>
  <div style="width: 100%; height: 100%; position: relative">
    
    <div style="width: 100%; height: 100%" id="map"></div>
    <div style="position: absolute; top: 0px; right: 0px; z-index: 999; padding: 5px">
      <el-button @click="distance">距离量算</el-button>
      <el-button @click="area">面积量算</el-button>
      <el-button @click="exportMap">导出地图</el-button> <!-- 新增按钮 -->
      <el-button @click="spatialQuery">空间查询</el-button> <!-- 新增按钮 -->
    </div>
    <el-dialog v-model="resultDialogVisible" title="查询结果">
      <el-table :data="resultTableData">
        <el-table-column prop="名称" label="名称"></el-table-column>
        <!-- <el-table-column prop="区划码" label="区划码"></el-table-column> -->
        <el-table-column prop="县级" label="县级"></el-table-column>
        <el-table-column prop="地级" label="地级"></el-table-column>
        <!-- <el-table-column prop="省级" label="省级"></el-table-column> -->
        <!-- <el-table-column prop="年份" label="年份"></el-table-column> -->
        <!-- <el-table-column prop="质地" label="质地"></el-table-column> -->
        <el-table-column prop="坡度" label="坡度"></el-table-column>
        <el-table-column prop="酸碱度" label="酸碱度"></el-table-column>
        <el-table-column prop="有机质" label="有机质"></el-table-column>
        <el-table-column prop="地力" label="地力"></el-table-column>
        <el-table-column prop="耕地面积" label="耕地面积"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import http from "../utils/http";
import { ElMessageBox, ElMessage } from 'element-plus';

let map = null;
let selecti, source, drawsource, popup, farmlandSource;
const tableData = ref([]);
const resultTableData = ref([]);
const resultDialogVisible = ref(false);

const distance = () => {
  var drawLine = new ol.interaction.Draw({ type: "LineString" });
  map.addInteraction(drawLine);

  // Add a tooltip
  var tooltip = new ol.Overlay.Tooltip();
  map.addOverlay(tooltip);

  // Set feature on drawstart
  drawLine.on("drawstart", tooltip.setFeature.bind(tooltip));
  // Remove feature on finish 并且移除drawLine
  drawLine.on(["change:active", "drawend"], function (e) {
    tooltip.removeFeature(e);
    map.removeInteraction(drawLine);
  });
};

const area = () => {
  var drawPolygon = new ol.interaction.Draw({ type: "Polygon" });
  map.addInteraction(drawPolygon);

  // Add a tooltip
  var tooltip = new ol.Overlay.Tooltip();
  map.addOverlay(tooltip);

  // Set feature on drawstart
  drawPolygon.on("drawstart", tooltip.setFeature.bind(tooltip));
  // Remove feature on finish 并且移除drawPolygon
  drawPolygon.on(["change:active", "drawend"], function (e) {
    tooltip.removeFeature(e);
    map.removeInteraction(drawPolygon);
  });
};

const exportMap = () => {
  map.once('rendercomplete', function () {
    const mapCanvas = document.createElement('canvas');
    const size = map.getSize();
    mapCanvas.width = size[0];
    mapCanvas.height = size[1];
    const mapContext = mapCanvas.getContext('2d');
    Array.prototype.forEach.call(document.querySelectorAll('.ol-layer canvas'), function (canvas) {
      if (canvas.width > 0) {
        const opacity = canvas.parentNode.style.opacity;
        mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
        const transform = canvas.style.transform;
        const matrix = transform.match(/^matrix\(([^\(]*)\)$/)[1].split(',').map(Number);
        CanvasRenderingContext2D.prototype.setTransform.apply(mapContext, matrix);
        mapContext.drawImage(canvas, 0, 0);
      }
    });
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(mapCanvas.msToBlob(), 'map.png');
    } else {
      mapCanvas.toBlob(function (blob) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'map.png';
        link.click();
      });
    }
  });
  map.renderSync();
};

const spatialQuery = () => {
  const drawRectangle = new ol.interaction.Draw({ type: "Circle", geometryFunction: ol.interaction.Draw.createBox() });
  map.addInteraction(drawRectangle);

  drawRectangle.on("drawend", async function (e) {
    const extent = e.feature.getGeometry().getExtent();
    const features = farmlandSource.getFeaturesInExtent(extent);
    console.log(features);
    //fit，extent是一个数组，包含了左下角和右上角的坐标
    if (features.length > 0) {
      map.getView().fit(extent);
    }
    resultTableData.value = features.map(f => ({
      名称: f.get('名称'),
      区划码: f.get('区划码'),
      县级: f.get('县级'),
      地级: f.get('地级'),
      省级: f.get('省级'),
      // 年份: f.get('年份'),
      // 质地: f.get('质地'),
      坡度: f.get('坡度'),
      酸碱度: f.get('酸碱度'),
      有机质: f.get('有机质'),
      地力: f.get('地力'),
      耕地面积: f.get('耕地面积')
    }));
    resultDialogVisible.value = true;
    map.removeInteraction(drawRectangle);
  });
};

onMounted(() => {
  map = new ol.Map({
    target: "map",
    layers: [
      new ol.layer.Tile({
        title: "高德地图",
        //高德地图
        source: new ol.source.XYZ({
          url: "https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
          crossOrigin: 'anonymous', // 添加 crossOrigin 属性
        }),
      }),
      //高度地图标注
      new ol.layer.Tile({
        title: "高德地图标注",
        source: new ol.source.XYZ({
          url: "https://webst01.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}",
          crossOrigin: 'anonymous', // 添加 crossOrigin 属性
        }),
      }),
    ],
    view: new ol.View({
      //广州市中心坐标
      center: ol.proj.fromLonLat([113.2644, 23.1291]),
      zoom: 12,
      maxZoom: 18,
    }),
  });





   farmlandSource = new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    url: "http://localhost:8000/getfarmlands",
    crossOrigin: 'anonymous', // 添加 crossOrigin 属性
  });

  const farmlandLayer = new ol.layer.Vector({
    source: farmlandSource,
    title: '耕地数据',
    style: function (feature) {
      //黄色边框，透明的面
      return new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: "yellow",
          width: 2,
        }),
        fill: new ol.style.Fill({
          color: "rgba(255, 255, 0, 0.1)",
        }),
      });
  
    },
  });

  map.addLayer(farmlandLayer);

  //xyz图层
  var xyzLayer = new ol.layer.Tile({
    title: "DEM",
    visible: false,
    source: new ol.source.XYZ({
      url: "http://localhost:8000/dem/{z}/{x}/{y}.png",
      crossOrigin: 'anonymous', // 添加 crossOrigin 属性
    }),
  });
  map.addLayer(xyzLayer);
  //xyz ndvi
  var ndviLayer = new ol.layer.Tile({
    title: "NDVI",
    visible: false,
    source: new ol.source.XYZ({
      url: "http://localhost:8000/ndvi/{z}/{x}/{y}.png",
      crossOrigin: 'anonymous', // 添加 crossOrigin 属性
    }),
  });
  map.addLayer(ndviLayer);
  //xyz evaluation
  var evaluationLayer = new ol.layer.Tile({
    title: "耕地地力评价",
    visible: false,
    source: new ol.source.XYZ({
      url: "http://localhost:8000/evaluation/{z}/{x}/{y}.png",
      crossOrigin: 'anonymous', // 添加 crossOrigin 属性
    }),
  });
  map.addLayer(evaluationLayer);
  //xyz type
  var typeLayer = new ol.layer.Tile({
    title: "土地利用类型",
    visible: false,
    source: new ol.source.XYZ({
      url: "http://localhost:8000/type/{z}/{x}/{y}.png",
      crossOrigin: 'anonymous', // 添加 crossOrigin 属性
    }),
  });
  map.addLayer(typeLayer);


  //fit 
  farmlandSource.once("change", function (e) {
    if (farmlandSource.getState() === "ready") {
      map.getView().fit(farmlandSource.getExtent());
    }
  });


  map.addControl(new ol.control.LayerPopup());

  // Select  interaction
  selecti = new ol.interaction.Select({
    hitTolerance: 5,
    condition: ol.events.condition.singleClick,
    layers: [farmlandLayer],
  });
  map.addInteraction(selecti);

  // Select control
  popup = new ol.Overlay.PopupFeature({
    popupClass: "default anim",
    select: selecti,
    canFix: false,
  });
  map.addOverlay(popup);

  // Select feature when click on the reference index
  selecti.on("select", function (e) {
    var f = e.selected[0];
    
  });
    // Set the control grid reference
    var search = new ol.control.SearchFeature({
    //target: $(".options").get(0),
    source: farmlandSource,
    property: "名称",
    sort: function (f1, f2) {
      if (search.getSearchString(f1) < search.getSearchString(f2)) return -1;
      if (search.getSearchString(f1) > search.getSearchString(f2)) return 1;
      return 0;
    },
  });
  map.addControl(search);

  // selecti feature when click on the reference index
  search.on("select", function (e) {
    console.log(e);
    selecti.getFeatures().clear();
    selecti.getFeatures().push(e.search);
    var p = e.search.getGeometry().getFirstCoordinate();
    popup.show(p, e.search);
    map.getView().animate({ center: p });
  });
  //<input type="search" class="search" autocomplete="off" placeholder="Search...">
  //修改placeholder为请输入路线名称
  document.getElementsByClassName("search")[0].placeholder = "请输入名称";
});
</script>
