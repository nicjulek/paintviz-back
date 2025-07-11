import knexModule, { Knex } from 'knex'
import dotenv from 'dotenv'

dotenv.config()

const knex = knexModule({
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'paintviz',
    charset: 'utf8mb4'
  }, 
  pool: {
     min: 0,
     max: 7
  },
  migrations: {
    directory: './src/migrations',
    tableName: ''
  },
});

export const db = knex

export class DatabaseConnection {
  private static instance: DatabaseConnection
  private knex: Knex

  private constructor() {
    this.knex = db
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection()
    }
    return DatabaseConnection.instance
  }

  public getConnection(): Knex {
    return this.knex
  }

  public async closeConnection(): Promise<void> {
    try {
      await this.knex.destroy()
      console.log('Conexão com banco fechada')
    } catch (error) {
      console.error('Erro ao fechar conexão:', error)
    }
  }
}

export const dbConnection = DatabaseConnection.getInstance()