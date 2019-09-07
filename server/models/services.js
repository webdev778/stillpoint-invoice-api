'use strict';
module.exports = (sequelize, DataTypes) => {
    const Services = sequelize.define('Services', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        description: {
            type: DataTypes.TEXT,
            defaultValue: ''
        },
        quantity: {
            type: DataTypes.INTEGER,
            defaultValue: ''
        },
        unit_price: {
            type: DataTypes.INTEGER,
            defaultValue: ''
        },
        text_charge: {
            type: DataTypes.BOOLEAN,
            defaultValue: ''
        }
    });

    Services.associate = ({ Invoice, Service_Types }) => {
        Services.belongsTo(Invoice, { as: 'invoice', foreignKey: 'invoice_id', onDelete: 'cascade'});
        Services.belongsTo(Service_Types, { as: 'service_types', foreignKey: 'service_type_id', onDelete: 'cascade'});
    };

    return Services;
};

