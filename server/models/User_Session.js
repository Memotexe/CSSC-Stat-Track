const Sequelize = require('sequelize');

module.exports =  (sequelize, DataTypes) => {
    const User_Session = sequelize.define("user_session", {
        user_session_id:{
            type: Sequelize.INTEGER,
            allowNull:false,
            primaryKey:true,
            autoIncrement: true
        },
        user_login:{
            type: Sequelize.DATE,
            allowNull:false,
        },
        user_logout:{
            type: Sequelize.DATE,
            allowNull:true,
        }
    },
    {
        underscored: true,
        freezeTableName: true
    });

    return User_Session;
}