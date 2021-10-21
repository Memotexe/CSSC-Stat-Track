const Sequelize = require('sequelize');

module.exports =  (sequelize, DataTypes) => {
    const Mentors = sequelize.define("mentors", {
        mentor_id:{
            type: Sequelize.INTEGER,
            allowNull:false,
            primaryKey:true,
            autoIncrement: true
        },
        email:{
            type: Sequelize.STRING,
            allowNull:false,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        firstname:{
            type: Sequelize.STRING,
            allowNull:false,
        },
        lastname:{
            type: Sequelize.STRING,
            allowNull:false,
        },
        active:{
            type: Sequelize.INTEGER,
            allowNull:false,
        }

    },
    {
        underscored: true
    });

    return Mentors;
}