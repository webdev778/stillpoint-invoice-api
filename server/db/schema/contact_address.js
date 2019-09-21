/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    const ContactAddress = sequelize.define('ContactAddress', {
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
    counselorId: {
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
    tableName: 'contact_addresses'
  });
  ContactAddress.associate = ({ Counselor }) => {
    ContactAddress.belongsTo(Counselor);
  };
  return ContactAddress;
};
