export class DBConnectionError extends Error {
  constructor() {
    super("Impossible de se connecter à la base de données");
    this.name = "DBConnectionError";
  }
}
