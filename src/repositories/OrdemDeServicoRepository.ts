import { injectable } from "tsyringe";
import { dbConnection } from "../config/database";

@injectable()
export class OrdemDeServicoRepository {
    private db = dbConnection.getConnection();
}