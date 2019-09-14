/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
      const ClientContactAddress = sequelize.define('ClientContactAddress', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true
      },
      street: {
        type: DataTypes.STRING,
        allowNull: true
      },
      postCode: {
        type: DataTypes.STRING,
        allowNull: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      latitude: {
        type: DataTypes.DOUBLE,
        allowNull: true
      },
      longitude: {
        type: DataTypes.DOUBLE,
        allowNull: true
      }
    }, {
      tableName: 'client_contact_addresses'
    });
    ClientContactAddress.associate = ({ User/*, Service_Type*/ }) => {
      ClientContactAddress.belongsTo(User, { as: 'User', foreignKey: 'userId', onDelete: 'cascade'});
      // Service.belongsTo(Service_Type, { as: 'service_type', foreignKey: 'service_type_id', onDelete: 'cascade'});
    };
    return ClientContactAddress;
  };
  