'use server';

import { neon } from '@neondatabase/serverless';

// Need transaction here
export async function createShipwreck(formData: FormData) {
    const sql = neon(`${process.env.STORAGE_DATABASE_URL}`);

    const ship_name = formData.get('ship_name');
    const aka = formData.get('aka');
    const owner = formData.get('owner');
    const vessel_type = formData.get('vessel_type');
    const year_built = formData.get('year_built');
    const build_location = formData.get('build_location');
    const date_lost = formData.get('date_lost');
    const year_lost = formData.get('year_lost');
    const month_lost = formData.get('month_lost');
    const day_lost = formData.get('day_lost');
    const location_lost = formData.get('location_lost');
    const latitude_lost = formData.get('latitude_lost');
    const longitude_lost = formData.get('longitude_lost');
    const cause_of_loss = formData.get('cause_of_loss');
    const construction = formData.get('construction');
    const flag = formData.get('flag');
    const length = formData.get('length');
    const beam = formData.get('beam');
    const draft = formData.get('draft');
    const gross_tonnage = formData.get('gross_tonnage');
    const net_tonnage = formData.get('net_tonnage');
    const home_port = formData.get('home_port');
    const departure_port = formData.get('departure_port');
    const destination_port = formData.get('destination_port');
    const master = formData.get('master');
    const num_crew = formData.get('num_crew');
    const num_pass = formData.get('num_pass');
    const lives_lost = formData.get('lives_lost');
    const ship_value = formData.get('ship_value');
    const cargo_value = formData.get('cargo_value');
    const nature_of_cargo = formData.get('nature_of_cargo');
    const uslss_station_name = formData.get('uslss_station_name');

    const toNull = (input: FormDataEntryValue | null) =>
        input === '' ? null : input;

    await sql`
    INSERT INTO shipwrecks (
        ship_name, aka, owner, vessel_type, year_built, build_location,
        date_lost, year_lost, month_lost, day_lost, location_lost,
        latitude_lost, longitude_lost, cause_of_loss, construction, flag,
        length, beam, draft, gross_tonnage, net_tonnage,
        home_port, departure_port, destination_port, master,
        num_crew, num_pass, lives_lost,
        ship_value, cargo_value, nature_of_cargo, uslss_station_name
    )

    VALUES (
      ${toNull(ship_name)}, ${toNull(aka)}, ${toNull(owner)}, ${toNull(vessel_type)},
      ${toNull(year_built)}, ${toNull(build_location)},
      ${toNull(date_lost)}, ${toNull(year_lost)}, ${toNull(month_lost)}, ${toNull(day_lost)},
      ${toNull(location_lost)}, ${toNull(latitude_lost)}, ${toNull(longitude_lost)},
      ${toNull(cause_of_loss)}, ${toNull(construction)}, ${toNull(flag)},
      ${toNull(length)}, ${toNull(beam)}, ${toNull(draft)},
      ${toNull(gross_tonnage)}, ${toNull(net_tonnage)},
      ${toNull(home_port)}, ${toNull(departure_port)}, ${toNull(destination_port)},
      ${toNull(master)}, ${toNull(num_crew)}, ${toNull(num_pass)}, ${toNull(lives_lost)},
      ${toNull(ship_value)}, ${toNull(cargo_value)}, ${toNull(nature_of_cargo)},
      ${toNull(uslss_station_name)}
    )
  `;
}

export async function getShipwrecks() {
    const sql = neon(`${process.env.STORAGE_DATABASE_URL}`);

    const result = await sql.query(`
        SELECT * FROM shipwrecks 
    `);

    return result;
}

export async function getShipwreck(id: number) {
    const sql = neon(`${process.env.STORAGE_DATABASE_URL}`);

    const result = await sql.query(`
        SELECT * FROM shipwrecks 
        WHERE id = $1
    `, [id]);

    return result;
}

type FilterBy = [field: string, min: number, max: number];

export async function getSortedShipwrecks(sortBy: string) {
    const sql = neon(`${process.env.STORAGE_DATABASE_URL}`);
    const validatedSortBy = sortBy || "ship_name";

    const result = await sql.query(`
        SELECT * FROM shipwrecks 
        WHERE ${validatedSortBy} IS NOT NULL
        ORDER BY ${validatedSortBy}
    `, []);

    return result;
}

// Benefits from Indexes
export async function getFilteredShipwrecks(name?: string, year_start?: number, year_end?: number) {
    const sql = neon(`${process.env.STORAGE_DATABASE_URL}`);

    const whereClauses: string[] = [];
    const values: (string | number)[] = [];
    let i = 1;

    // ILIKE so it's not case sensitive and accepts a subset of the name
    if (name !== undefined) {
        whereClauses.push(`ship_name ILIKE $${i++}`);
        values.push(`%${name}%`);
    }
    if (year_start !== undefined) {
        whereClauses.push(`year_built >= $${i++}`);
        values.push(year_start);
    }
    if (year_end !== undefined) {
        whereClauses.push(`year_built <= $${i++}`);
        values.push(year_end);
    }

    const where = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const result = await sql.query(`
        SELECT * FROM shipwrecks ${where}
    `, values);

    return result;
}

export async function deleteShipwreck(id: number) {
    const sql = neon(`${process.env.STORAGE_DATABASE_URL}`);

    const result = await sql.query(`
        DELETE FROM shipwrecks 
        WHERE id = $1
    `, [id]);

    return result;
}

export async function editShipwreck(id: number, formData: FormData) {
    const sql = neon(`${process.env.STORAGE_DATABASE_URL}`);

    const ship_name = formData.get('ship_name');
    const aka = formData.get('aka');
    const owner = formData.get('owner');
    const vessel_type = formData.get('vessel_type');
    const year_built = formData.get('year_built');
    const build_location = formData.get('build_location');
    const date_lost = formData.get('date_lost');
    const year_lost = formData.get('year_lost');
    const month_lost = formData.get('month_lost');
    const day_lost = formData.get('day_lost');
    const location_lost = formData.get('location_lost');
    const latitude_lost = formData.get('latitude_lost');
    const longitude_lost = formData.get('longitude_lost');
    const cause_of_loss = formData.get('cause_of_loss');
    const construction = formData.get('construction');
    const flag = formData.get('flag');
    const length = formData.get('length');
    const beam = formData.get('beam');
    const draft = formData.get('draft');
    const gross_tonnage = formData.get('gross_tonnage');
    const net_tonnage = formData.get('net_tonnage');
    const home_port = formData.get('home_port');
    const departure_port = formData.get('departure_port');
    const destination_port = formData.get('destination_port');
    const master = formData.get('master');
    const num_crew = formData.get('num_crew');
    const num_pass = formData.get('num_pass');
    const lives_lost = formData.get('lives_lost');
    const ship_value = formData.get('ship_value');
    const cargo_value = formData.get('cargo_value');
    const nature_of_cargo = formData.get('nature_of_cargo');
    const uslss_station_name = formData.get('uslss_station_name');

    const toNull = (input: FormDataEntryValue | null) =>
        input === '' ? null : input;

    const result = await sql.query(`
        UPDATE shipwrecks SET
            ship_name = $1, aka = $2, owner = $3, vessel_type = $4,
            year_built = $5, build_location = $6,
            date_lost = $7, year_lost = $8, month_lost = $9, day_lost = $10,
            location_lost = $11, latitude_lost = $12, longitude_lost = $13,
            cause_of_loss = $14, construction = $15, flag = $16,
            length = $17, beam = $18, draft = $19,
            gross_tonnage = $20, net_tonnage = $21,
            home_port = $22, departure_port = $23, destination_port = $24,
            master = $25, num_crew = $26, num_pass = $27, lives_lost = $28,
            ship_value = $29, cargo_value = $30, nature_of_cargo = $31,
            uslss_station_name = $32
        WHERE id = $33
    `, [
        toNull(ship_name), toNull(aka), toNull(owner), toNull(vessel_type),
        toNull(year_built), toNull(build_location),
        toNull(date_lost), toNull(year_lost), toNull(month_lost), toNull(day_lost),
        toNull(location_lost), toNull(latitude_lost), toNull(longitude_lost),
        toNull(cause_of_loss), toNull(construction), toNull(flag),
        toNull(length), toNull(beam), toNull(draft),
        toNull(gross_tonnage), toNull(net_tonnage),
        toNull(home_port), toNull(departure_port), toNull(destination_port),
        toNull(master), toNull(num_crew), toNull(num_pass), toNull(lives_lost),
        toNull(ship_value), toNull(cargo_value), toNull(nature_of_cargo),
        toNull(uslss_station_name),
        id
    ]);
}