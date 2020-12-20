
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('permissions').del()
    .then(function () {
      // Inserts seed entries
      return knex('permissions').insert([
        {id: 1, label: 'admin'},
        {id: 2, label: 'doctor'},
        {id: 3, label: 'member'},
      ]);
    });
};
