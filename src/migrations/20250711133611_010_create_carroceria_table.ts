import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('Carroceria');
  if (!exists) {
    return knex.schema.createTable('Carroceria', (table) => {
      table.increments('id_carroceria').primary();
      table.string('nome_modelo', 100).notNullable();
      table.text('lateral_svg').nullable();
      table.text('traseira_svg').nullable();
      table.text('diagonal_svg').nullable();
      table.timestamp('data_criacao').defaultTo(knex.fn.now());
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('Carroceria');
}