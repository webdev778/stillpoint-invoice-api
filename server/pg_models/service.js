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

    Service.associate = ({ Invoice/*, Service_Type*/ }) => {
        Service.belongsTo(Invoice, { as: 'invoice', foreignKey: 'invoice_id', onDelete: 'cascade'});
        // Service.belongsTo(Service_Type, { as: 'service_type', foreignKey: 'service_type_id', onDelete: 'cascade'});
    };

    return Service;
};
