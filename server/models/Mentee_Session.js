const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Mentee_Session = sequelize.define("mentee_session", {
        mentee_session_id:{
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey:true
        },
        login:{
            type: Sequelize.DATE,
            allowNull: false,
        },
        logout:{
            type: Sequelize.DATE,
            allowNull: false,
        },
        class:{
            type: Sequelize.STRING,
            allowNull: false,
        },
        assigment:{
            type: Sequelize.STRING,
            allowNull: false,
        },
        comment:{
            type: Sequelize.STRING,
            allowNull: false,
        }
    },
    {
        underscored: true,
        freezeTableName: true
    });

    return Mentee_Session;
}