const Sequelize = require('sequelize');
const Mentors = require("./Mentors");

module.exports =  (sequelize, DataTypes) => {
    const Mentor_Sessions = sequelize.define("mentor_sessions", {
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
        }//,
        // mentor_id:{
        //     type: Sequelize.INTEGER,
        //     // allowNull:false,   
        //     // foreignKey: true
        //     references: {
        //         model: Mentors,
        //         key: "id"
        //     }
        // }
    
    },
    {
        underscored: true
    });

    // Mentor_Sessions.associate = (models) => {
    //     Mentor_Sessions.belongsTo(models.mentors);
    // }

    return Mentor_Sessions;
}