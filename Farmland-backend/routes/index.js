var express = require('express');
var router = express.Router();
var User = require('../models').User;
var Farmland = require('../models').Farmland;
var Sequelize = require('sequelize');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});
//用户登录
router.post('/login', async function (req, res, next) {
  let {
    username,
    password,
  } = req.body;
  let user = await User.findOne({
    where: {
      username,
      password
    }
  });
  if (user) {
    res.json({
      code: 0,
      data: user
    });
  } else {
    res.json({
      code: 1,
      msg: "用户名或密码错误"
    });
  }
});
//新增用户
router.post('/add', async function (req, res, next) {
  let {
    username,
    password,
    name,
    type,
    gender,
    phone,
    remark
  } = req.body;
  let user = await User.findOne({
    where: {
      username
    }
  });
  if (user) {
    res.json({
      code: 1,
      msg: "用户名已存在"
    });
  } else {
    await User.create({
      username,
      password,
      type,
      name,
      gender,
      phone,
      remark
    });
    res.json({
      code: 0,
      msg: "新增成功"
    });
  }
});
//删除用户
router.post('/del', async function (req, res, next) {
  let {
    id
  } = req.body;
  await User.destroy({
    where: {
      id
    }
  });
  res.json({
    code: 0,
    msg: "删除成功"
  });
});
//修改用户
router.post('/edit', async function (req, res, next) {
  let {
    id,
    username,
    password,
    name,
    type,
    gender,
    phone,
    remark
  } = req.body;
  await User.update({
    username,
    password,
    name,
    type,
    gender,
    phone,
    remark
  }, {
    where: {
      id
    }
  });
  res.json({
    code: 0,
    msg: "修改成功"
  });
});
//获取用户列表
router.get('/list', async function (req, res, next) {
  let users = await User.findAll();
  res.json({
    code: 0,
    data: users
  });
});
//查看某个用户根据id
router.get('/getuser', async function (req, res, next) {
  let {
    id
  } = req.query;
  let user = await User.findOne({
    where: {
      id
    }
  });
  res.json(user);
});

// 新增耕地
router.post('/addfarmland', async function (req, res, next) {
  let {
    name,
    areaCode,
    county,
    city,
    province,
    // year,
    // texture,
    slope,
    ph,
    organicMatter,
    fertility,
    farmlandArea,
    geom
  } = req.body;
  await Farmland.create({
    name,
    areaCode,
    county,
    city,
    province,
    // year,
    // texture,
    slope,
    ph,
    organicMatter,
    fertility,
    farmlandArea,
    geom
  });
  res.json({
    code: 0,
    msg: "新增成功"
  });
});

// 删除耕地
router.post('/delfarmland', async function (req, res, next) {
  let { id } = req.body;
  await Farmland.destroy({
    where: {
      id
    }
  });
  res.json({
    code: 0,
    msg: "删除成功"
  });
});

// 修改耕地
router.post('/editfarmland', async function (req, res, next) {
  let {
    id,
    name,
    areaCode,
    county,
    city,
    province,
    // year,
    // texture,
    slope,
    ph,
    organicMatter,
    fertility,
    farmlandArea,
    geom
  } = req.body;
  await Farmland.update({
    name,
    areaCode,
    county,
    city,
    province,
    // year,
    // texture,
    slope,
    ph,
    organicMatter,
    fertility,
    farmlandArea,
    geom
  }, {
    where: {
      id
    }
  });
  res.json({
    code: 0,
    msg: "修改成功"
  });
});

// 获取耕地列表
router.get('/listfarmland', async function (req, res, next) {
  let farmlands = await Farmland.findAll();
  res.json({
    code: 0,
    data: farmlands
  });
});

// 根据name 模糊查询耕地，分页
router.get('/searchfarmland', async function (req, res, next) {
  let {
    name,
    page,
    limit
  } = req.query;
  let where = {};
  if (name) {
    where.name = {
      [Sequelize.Op.like]: `%${name}%`
    }
  }
  let farmlands = await Farmland.findAndCountAll({
    where,
    offset: (page - 1) * limit,
    limit: +limit
  });
  res.json({
    code: 0,
    data: farmlands.rows,
    total: farmlands.count,
    totalPages: Math.ceil(farmlands.count / limit)
  });
});

// 根据id查看某个耕地
router.get('/getfarmland', async function (req, res, next) {
  let { id } = req.query;
  let farmland = await Farmland.findOne({
    where: {
      id
    }
  });
  res.json(farmland);
});

//以geojson的形式返回所有耕地
router.get('/getfarmlands', async function (req, res, next) {
  let farmlands = await Farmland.findAll();
  let features = [];
  for (let i = 0; i < farmlands.length; i++) {
    let item = farmlands[i];
    let feature = {
      type: "Feature",
      properties: {
        名称: item.name,
        区划码: item.areaCode,
        县级: item.county,
        地级: item.city,
        省级: item.province,
        // 年份: item.year,
        // 质地: item.texture,
        坡度: item.slope,
        酸碱度: item.ph,
        有机质: item.organicMatter,
        地力: item.fertility,
        耕地面积: item.farmlandArea
      },
      geometry: item.geom
    };
    features.push(feature);
  }
  let geojson = {
    type: "FeatureCollection",
    features
  };
  res.json(geojson);
});

module.exports = router;