
exports.seed = async function(knex) {
  await knex.raw('SET FOREIGN_KEY_CHECKS=0');

  // Deletes ALL existing entries
  await knex('permissions').del()
    .then(function () {
      // Inserts seed entries
      return knex('permissions').insert([
        {id: 1, label: 'admin'},
        {id: 2, label: 'doctor'},
        {id: 3, label: 'member'},
      ]);
    });

  await knex.raw('SET FOREIGN_KEY_CHECKS=1');
};
