const _bcrypt = require('../../utils/_bcrypt');

exports.seed = async function(knex) {
  await knex.raw('SET FOREIGN_KEY_CHECKS=0');

  // Deletes ALL existing entries in users table
  await knex('users').del()
    .then(async function () {
      const encryptedPassword = await _bcrypt.hash('secret');
      const currentDate = new Date();

      // Inserts users
      return knex('users').insert([
        {
          id: 1,
          email: 'admin@gmail.com',
          password: encryptedPassword,
          verified_at: currentDate,
          permission_id: 1
        },
        {
          id: 2,
          email: 'doctor@gmail.com',
          password: encryptedPassword,
          verified_at: currentDate,
          permission_id: 2
        },
        {
          id: 3,
          email: 'nwakasistephen@gmail.com',
          password: encryptedPassword,
          verified_at: currentDate,
          permission_id: 3
        },
      ]);
    }).then(function () {
      // Deletes ALL existing entries in user_profiles table
      return knex('user_profiles').del()
    }).then(function () {
      // Inserts profiles
      return knex('user_profiles').insert([
        {
          id: 1,
          first_name: 'Super',
          last_name: 'Admin',
          gender: 'male',
          user_id: 1,
        },
        {
          id: 2,
          first_name: 'Doctor',
          last_name: 'Jesus',
          gender: 'male',
          user_id: 2,
        },
        {
          id: 3,
          first_name: 'Nwakasi',
          last_name: 'Stephen',
          gender: 'male',
          user_id: 3,
        },
      ]);
    });

  
  await knex.raw('SET FOREIGN_KEY_CHECKS=1');
};
