import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('Paleta_Cor');
  if (!exists) {
    return knex.schema.createTable('Paleta_Cor', (table) => {
      table.integer('id_paleta').unsigned().notNullable();
      table.integer('id_cor').unsigned().notNullable();
      table.primary(['id_paleta', 'id_cor']);
      table.foreign('id_paleta').references('id_paleta').inTable('Paleta').onDelete('CASCADE');
      table.foreign('id_cor').references('id_cor').inTable('Cor').onDelete('CASCADE');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('Paleta_Cor');
}