import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('Pintura');
  if (!exists) {
    return knex.schema.createTable('Pintura', (table) => {
      table.increments('id_pintura').primary();
      table.text('pintura_svg_lateral').notNullable();
      table.text('pintura_svg_traseira').notNullable();
      table.text('pintura_svg_diagonal').notNullable();
      table.integer('id_carroceria').unsigned().notNullable();
      table.integer('id_usuario').unsigned().notNullable();
      table.foreign('id_carroceria').references('id_carroceria').inTable('Carroceria');
      table.foreign('id_usuario').references('id_usuario').inTable('Usuario');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('Pintura');
}