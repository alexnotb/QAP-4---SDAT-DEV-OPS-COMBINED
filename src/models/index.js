const sequelize = require('../config/database');
const Member = require('./Member');
const Tournament = require('./Tournament');

// Define many-to-many relationship between Members and Tournaments
const TournamentMember = sequelize.define('TournamentMember', {
  id: {
    type: sequelize.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
}, {
  tableName: 'tournament_members',
  timestamps: true
});

// Set up associations
Member.belongsToMany(Tournament, { 
  through: TournamentMember, 
  foreignKey: 'memberId',
  as: 'tournaments'
});

Tournament.belongsToMany(Member, { 
  through: TournamentMember, 
  foreignKey: 'tournamentId',
  as: 'members'
});

module.exports = {
  sequelize,
  Member,
  Tournament,
  TournamentMember
};
