import { injectable } from "tsyringe";
import { dbConnection } from "../config/database";

@injectable()
export class CarroceriaRepository {
    private db = dbConnection.getConnection();
}