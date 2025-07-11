import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('Usuario');
  if (!exists) {
    return knex.schema.createTable('Usuario', (table) => {
      table.increments('id_usuario').primary();
      table.string('nome', 255).notNullable();
      table.string('senha', 255).notNullable();
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('Usuario');
}