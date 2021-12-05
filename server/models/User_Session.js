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
        /*
        .########....###....########..##.......########....####.##....##.########..#######.
        ....##......##.##...##.....##.##.......##...........##..###...##.##.......##.....##
        ....##.....##...##..##.....##.##.......##...........##..####..##.##.......##.....##
        ....##....##.....##.########..##.......######.......##..##.##.##.######...##.....##
        ....##....#########.##.....##.##.......##...........##..##..####.##.......##.....##
        ....##....##.....##.##.....##.##.......##...........##..##...###.##.......##.....##
        ....##....##.....##.########..########.########....####.##....##.##........#######.
        
        This table one association that goes along with it:

        user_user_id - the ID to the associated user who hosted this user session.

        */
    },
    {
        underscored: true,
        freezeTableName: true
    });

    return User_Session;
}