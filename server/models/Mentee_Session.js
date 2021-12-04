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
            allowNull: true,
        },
        course:{
            type: Sequelize.STRING,
            allowNull: false,
        },
        assignment:{
            type: Sequelize.STRING,
            allowNull: false,
        },
        comment:{
            type: Sequelize.STRING,
            allowNull: true,
        }
        /*
        .########....###....########..##.......########....####.##....##.########..#######.
        ....##......##.##...##.....##.##.......##...........##..###...##.##.......##.....##
        ....##.....##...##..##.....##.##.......##...........##..####..##.##.......##.....##
        ....##....##.....##.########..##.......######.......##..##.##.##.######...##.....##
        ....##....#########.##.....##.##.......##...........##..##..####.##.......##.....##
        ....##....##.....##.##.....##.##.......##...........##..##...###.##.......##.....##
        ....##....##.....##.########..########.########....####.##....##.##........#######.
        
        This table has a few associations that go along with it:

        user_session_user_session_id - the ID to the associated user session who hosted this mentee session.

        mentee_mentee_id - the ID to the associated mentee who had this session.

        */
    },
    {
        underscored: true,
        freezeTableName: true
    });

    return Mentee_Session;
}
