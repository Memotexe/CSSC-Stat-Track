const Sequelize = require('sequelize');

module.exports =  (sequelize, DataTypes) => {
    const Mentor_Session = sequelize.define("mentor_session", {
        mentor_session_id:{
            type: Sequelize.INTEGER,
            allowNull:false,
            primaryKey:true,
            autoIncrement: true
        },
        mentor_login:{
            type: Sequelize.DATE,
            allowNull:false,
        },
        mentor_logout:{
            type: Sequelize.DATE,
            allowNull:false,
        }
    },
    {
        underscored: true,
        freezeTableName: true
    });

    return Mentor_Session;
}