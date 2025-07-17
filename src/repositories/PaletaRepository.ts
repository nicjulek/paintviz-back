import { injectable } from "tsyringe";
import { dbConnection } from "../config/database";

@injectable()
export class PaletaRepository {
    private db = dbConnection.getConnection();
}