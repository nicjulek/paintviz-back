import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('Juridico');
  if (!exists) {
    return knex.schema.createTable('Juridico', (table) => {
      table.integer('id_cliente').unsigned().primary();
      table.string('empresa', 255).notNullable();
      table.string('razao_social', 255).nullable();
      table.string('cnpj', 18).notNullable().unique();
      table.foreign('id_cliente').references('id_cliente').inTable('Cliente').onDelete('CASCADE');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('Juridico');
}