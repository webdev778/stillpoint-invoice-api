/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('StripeConnect', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
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
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true
      }
    }, {
      tableName: 'stripe_connects'
    });
  };