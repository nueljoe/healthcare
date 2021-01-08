
exports.seed = async function(knex) {
  await knex.raw('SET FOREIGN_KEY_CHECKS=0');

  // Deletes ALL existing entries
  await knex('product_categories').del()
    .then(function () {
      // Inserts seed entries
      return knex('product_categories').insert([
        {id: 1, label: 'women medicine'},
        {id: 2, label: 'maternity', parent_id: 1 },
        {id: 3, label: 'breast feeding', parent_id: 1 },
        {id: 4, label: 'child health'},
      ]);
    });

  
  await knex.raw('SET FOREIGN_KEY_CHECKS=1');
};
