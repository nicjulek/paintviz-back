import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable('OrdemDeServico');
  if (!exists) {
    return knex.schema.createTable('OrdemDeServico', (table) => {
      table.increments('id_ordem_servico').primary();
      table.string('identificacao_veiculo', 100).notNullable();
      table.date('data_emissao').notNullable().defaultTo(knex.fn.now());
      table.date('data_entrega').nullable();
      table.date('data_programada').nullable();
      table.string('modelo_veiculo', 100).notNullable();
      table.string('placa_veiculo', 10).notNullable();
      table.string('numero_box', 20).nullable();
      table.integer('id_cliente').unsigned().notNullable();
      table.integer('id_usuario_responsavel').unsigned().notNullable();
      table.integer('id_status').unsigned().notNullable();
      table.integer('id_pintura').unsigned().nullable();
      table.timestamp('data_ultima_modificacao').nullable();
      table.foreign('id_cliente').references('id_cliente').inTable('Cliente');
      table.foreign('id_usuario_responsavel').references('id_usuario').inTable('Usuario');
      table.foreign('id_status').references('id_status').inTable('Status');
      table.foreign('id_pintura').references('id_pintura').inTable('Pintura');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('OrdemDeServico');
}