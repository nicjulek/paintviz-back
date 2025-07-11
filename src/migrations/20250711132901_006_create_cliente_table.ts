import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('Cliente');
  if (!exists) {
    return knex.schema.createTable('Cliente', (table) => {
      table.increments('id_cliente').primary();
      table.string('celular', 20).notNullable();
      table.string('email', 255).notNullable().unique();
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('Cliente');
}