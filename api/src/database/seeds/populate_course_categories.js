
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('course_categories').del()
    .then(function () {
      // Inserts seed entries
      return knex('course_categories').insert([
        {id: 1, label: 'women medicine'},
        {id: 2, label: 'maternity', parent_id: 1 },
        {id: 3, label: 'breast feeding', parent_id: 1 },
        {id: 4, label: 'child health'},
      ]);
    });
};
