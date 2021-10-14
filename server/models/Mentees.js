module.exports = (sequelize, DataTypes) => {
    const Mentees = sequelize.define("mentees", {
        email:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        mentee_id:{
            type: DataTypes.INTEGER,
            allowNull:false,
            primaryKey: true,
            autoIncrement: true
        },
        firstname:{
            type: DataTypes.STRING,
            allowNull: false
        },
        lastname:{
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    { 
        underscored: true
    });
    return Mentees;
}