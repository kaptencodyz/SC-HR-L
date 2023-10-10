import { connect } from "@planetscale/database";
import { config } from "@/db/config";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { job_types, jobs, landing_zones, servers, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function getAllJobs(): Promise<Jobs[]> {
    const connection = connect(config);
    const db = drizzle(connection);

    const results: Jobs[] = await db.select({
        /* job type, description, location, server, start time, creator */
        jobType: job_types.name,
        description: jobs.description,
        landingzone: landing_zones.name,
        server: servers.name,
        startTime: jobs.start_time,
        creator: users.handle
    })
        .from(jobs)
        .innerJoin(job_types, eq(jobs.job_type, job_types.id))
        .innerJoin(landing_zones, eq(jobs.landing_zone, landing_zones.id))
        .innerJoin(servers, eq(jobs.server_id, servers.id))
        .innerJoin(users, eq(jobs.creater_id, users.id))

        return results;
}