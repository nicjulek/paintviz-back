import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('Administrador');
  if (!exists) {
    return knex.schema.createTable('Administrador', (table) => {
      table.integer('id_usuario').unsigned().primary();
      table.foreign('id_usuario').references('id_usuario').inTable('Usuario').onDelete('CASCADE');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('Administrador');
}