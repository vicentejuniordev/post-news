import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database.js";
async function migrations(request, response) {

  const allowMethods = ['GET','POST'];

  if(!allowMethods.includes(request.method)){
    return response.status(405).end({
      message: 'Method not allowed'
    });
  }

  const dbClient = await database.getNewClient();

  const migrationsOptions = {
    dbClient: dbClient,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  if (request.method === "POST") {
    const migratedMigrations = await migrationRunner({
      ...migrationsOptions,
      dryRun: false,
    });

    dbClient.end();

    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations);
    }

    return response.status(200).json(migratedMigrations);
  }

  if (request.method === "GET") {
    const pendingMigrations = await migrationRunner(migrationsOptions);

    dbClient.end();

    return response.status(200).json(pendingMigrations);
  }

  
}

export default migrations;
