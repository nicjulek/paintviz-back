import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('Fisico');
  if (!exists) {
    return knex.schema.createTable('Fisico', (table) => {
      table.integer('id_cliente').unsigned().primary();
      table.string('nome', 255).notNullable();
      table.string('cpf', 14).notNullable().unique();
      table.foreign('id_cliente').references('id_cliente').inTable('Cliente').onDelete('CASCADE');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('Fisico');
}