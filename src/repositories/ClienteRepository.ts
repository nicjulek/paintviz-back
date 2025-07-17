import { injectable } from "tsyringe";
import { dbConnection } from "../config/database";

@injectable()
export class ClienteRepository {
    private db = dbConnection.getConnection();
}