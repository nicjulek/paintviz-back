import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('Paleta');
  if (!exists) {
    return knex.schema.createTable('Paleta', (table) => {
      table.increments('id_paleta').primary();
      table.string('nome_paleta', 100).notNullable();
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('Paleta');
}