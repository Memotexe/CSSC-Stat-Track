const Mentor_Sessions = require("./Mentor_Sessions");
const Mentees = require("./Mentees");
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Mentee_Sessions = sequelize.define("mentee_sessions", {
        mentee_session_id:{
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey:true
        },
        // mentor_session_id:{
        //     type: Sequelize.INTEGER,
        //     references: {
        //         model: Mentor_Sessions,
        //         key: "session_id"
        //     }
        //     // allowNull: false,
        //     // foreignKey: true
        // },
        login:{
            type: Sequelize.DATE,
            allowNull: false,
        },
        logout:{
            type: Sequelize.DATE,
            allowNull: false,
        },
        // mentee_id:{
        //     type: Sequelize.INTEGER,
        //     references: {
        //         model: Mentees,
        //         key: "id"
        //     }
        //     // allowNull: false,
        //     // foreignKey: true
        // },
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
        underscored: true
    });

    // Mentee_Sessions.associate = (models) => {
    //     Mentee_Sessions.belongsTo(models.mentor_sessions);
    //     Mentee_Sessions.belongsTo(models.mentees);
    // }


    return Mentee_Sessions;
}