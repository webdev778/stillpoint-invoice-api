'use strict';
module.exports = (sequelize, DataTypes) => {
    const Service = sequelize.define('Service', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.TEXT
        },
        quantity: {
            type: DataTypes.INTEGER
        },
        unitPrice: {
            type: DataTypes.INTEGER
        },
        taxCharge: {
            type: DataTypes.BOOLEAN
        }
    });

    Service.associate = ({ Invoice, Service_Types }) => {
        Service.belongsTo(Invoice, { as: 'invoice', foreignKey: 'invoice_id', onDelete: 'cascade'});
        // Services.belongsTo(Service_Types, { as: 'service_types', foreignKey: 'service_type_id', onDelete: 'cascade'});
    };

    return Service;
};

