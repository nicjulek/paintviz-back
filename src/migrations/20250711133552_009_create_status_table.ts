import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('Status');
  if (!exists) {
    return knex.schema.createTable('Status', (table) => {
      table.increments('id_status').primary();
      table.string('descricao', 255).notNullable();
      table.timestamp('data_definicao_status').notNullable();
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('Status');
}