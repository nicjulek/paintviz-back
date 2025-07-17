import { injectable } from "tsyringe";
import { dbConnection } from "../config/database";

@injectable()
export class PecaRepository {
    private db = dbConnection.getConnection();
}