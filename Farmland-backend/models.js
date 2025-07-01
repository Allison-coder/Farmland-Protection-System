const Sequelize = require("sequelize");

// 创建 Sequelize 实例
const sequelize = new Sequelize("farmland", "root", "gysgyq99", {
  dialect: "mysql",
  host: "localhost",
});

// 定义用户表模型
const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  type: {
    type: Sequelize.INTEGER, //0:普通用户 1:管理员
    allowNull: false,
  },
  //性别
  gender: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  //电话
  phone: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  //备注
  remark: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

// 添加耕地表
const Farmland = sequelize.define("farmland", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  areaCode: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  county: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  city: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  province: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  slope: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  ph: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  organicMatter: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  fertility: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  farmlandArea: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  geom: {
    type: Sequelize.GEOMETRY('POLYGON', 4326),
    allowNull: false,
  },
});

// 同步模型到数据库
sequelize
  .sync({
    force: false
  })
  .then(async () => {
    console.log("连接成功");
    let u = await User.findAll();
    if (u.length == 0) {
      User.create({
        username: "admin",
        password: "123123",
        name: "管理员1",
        type: 1,
        gender: "男",
        phone: "12345678901",
        remark: "系统管理员"
      });

      User.create({
        username: "user1",
        password: "password1",
        name: "用户1",
        type: 0,
        gender: "女",
        phone: "12345678902",
        remark: "普通用户"
      });

      User.create({
        username: "user2",
        password: "password2",
        name: "用户2",
        type: 0,
        gender: "男",
        phone: "12345678903",
        remark: "普通用户"
      });

      User.create({
        username: "user3",
        password: "password3",
        name: "用户3",
        type: 0,
        gender: "女",
        phone: "12345678904",
        remark: "普通用户"
      });

      //读取本地geojson
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(__dirname, 'data.json');
      const data = fs.readFileSync(filePath);
      const farmlands = JSON.parse(data);
      for (let i = 0; i < farmlands.features.length; i++) {
        let item = farmlands.features[i];
        await Farmland.create({
          name: item.properties.地名,
          areaCode: item.properties.区划码,
          county: item.properties.县级,
          city: item.properties.地级,
          province: item.properties.省级,
          slope: item.properties.坡度,
          ph: item.properties.ph,
          organicMatter: item.properties.有机质,
          fertility: item.properties.地力,
          farmlandArea: item.properties.耕地面,
          geom: {
            type: 'Polygon',
            coordinates: item.geometry.coordinates
          }
        });
      }
    }
  })
  .catch((error) => {
    console.error("失败：", error);
  });

// 导出用户表模型
module.exports = {
  User,
  Farmland,
  sequelize
}