const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    const Admin = sequelize.define("admin", {
        admin_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        firstname: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        lastname: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        active: {
            type: Sequelize.INTEGER,
            allowNull: false,
        }
    },
    {
        underscored: true
    });

    return Admin;
}