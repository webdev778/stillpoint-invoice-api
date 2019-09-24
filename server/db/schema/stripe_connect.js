/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    const StripeConnect = sequelize.define('StripeConnect', {
      id: {
        type: DataTypes.BIGINT,
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

    StripeConnect.associate = ({
      User,
      Counselor
    }) => {
      StripeConnect.belongsTo(Counselor);
    };

    return StripeConnect;
  };