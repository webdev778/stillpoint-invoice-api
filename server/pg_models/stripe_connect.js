/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('StripeConnect', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      counselorId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      accessToken: {
        type: DataTypes.STRING,
        allowNull: true
      },
      refreshToken: {
        type: DataTypes.STRING,
        allowNull: true
      },
      stripePublishableKey: {
        type: DataTypes.STRING,
        allowNull: true
      },
      stripeUserId: {
        type: DataTypes.STRING,
        allowNull: true
      },
      scope: {
        type: DataTypes.STRING,
        allowNull: true
      },
      revoked: {
        type: DataTypes.BOOLEAN
      }
    }, {
      tableName: 'stripe_connects'
    });
  };