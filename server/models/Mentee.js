const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Mentee = sequelize.define("mentee", {
        email:{
            type: Sequelize.STRING,
            allowNull: false,
        },
        mentee_id:{
            type: Sequelize.INTEGER,
            allowNull:false,
            primaryKey: true,
            autoIncrement: true
        },
        firstname:{
            type: Sequelize.STRING,
            allowNull: false
        },
        lastname:{
            type: Sequelize.STRING,
            allowNull: false
        }
    },
    { 
        underscored: true,
        freezeTableName: true
    });
    return Mentee;
}