'use strict';

const db = require('../../models/index.model');
const user = db.User;

const findByEmail = async ({
  email,
  role,
}) => {
  const query = `
    SELECT
      u.id,
      u.email,
      u.password,
      u.is_active
    FROM Users u
    JOIN user_roles us ON us.UserId = u.id
    JOIN roles r ON r.id = us.RoleId
    WHERE u.email = :email
      AND u.is_active = true
      AND r.name = :role;
  `;

  const result = await db.sequelize.query(query, {
    replacements: { email, role },
    type: db.Sequelize.QueryTypes.SELECT,
  });
  return result[0]
};

const findRoleByEmail = async ({ email }) => {
  return user.findOne({
    where: { email: email, is_active: true },
    include: [
      {
        model: db.Roles,
        attributes: ['name'],
        as: 'roles',
      },
    ],
  });
};

module.exports = { findByEmail, findRoleByEmail };
