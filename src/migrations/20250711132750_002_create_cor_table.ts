import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('Cor');
  if (!exists) {
    return knex.schema.createTable('Cor', (table) => {
      table.increments('id_cor').primary();
      table.string('nome_cor', 100).notNullable();
      table.string('cod_cor', 20).notNullable();
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('Cor');
}