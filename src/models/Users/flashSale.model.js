module.exports = (sequelize, Sequelize) => {
    const FlashSale = sequelize.define(
        'FlashSale',
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            amount: {
                type: Sequelize.INTEGER,
                allowNull: false,
                validate: {
                    min: 0,
                },
            },
            coupon_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'coupons',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            product_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Products',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
        },
        {
            timestamps: true,
            tableName: 'flash_sales',
        }
    );

    // Associations nên tách riêng trong method associate
    FlashSale.associate = (db) => {
        FlashSale.belongsTo(db.Coupons, {
            as: 'Coupons',
            foreignKey: 'coupon_id',
        });

        FlashSale.belongsTo(db.Products, {
            as: 'Products',
            foreignKey: 'product_id',
        });
    };

    return FlashSale;
};
