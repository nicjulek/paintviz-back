import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('Peca');
  if (!exists) {
    return knex.schema.createTable('Peca', (table) => {
      table.increments('id_peca').primary();
      table.string('nome_peca', 100).notNullable();
      table.string('id_svg', 255).notNullable();
      table.integer('id_cor').unsigned().nullable();
      table.integer('id_pintura').unsigned().notNullable();
      table.integer('id_carroceria').unsigned().notNullable();
      table.foreign('id_cor').references('id_cor').inTable('Cor');
      table.foreign('id_pintura').references('id_pintura').inTable('Pintura');
      table.foreign('id_carroceria').references('id_carroceria').inTable('Carroceria');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('Peca');
}