import { Pool } from "pg";

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function toSnake(key: string): string {
  return key.replace(/([A-Z])/g, (m) => `_${m.toLowerCase()}`);
}

function toCamel(key: string): string {
  return key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function rowToDoc(row: Record<string, any>): any {
  const doc: Record<string, any> = {};
  for (const [k, v] of Object.entries(row)) {
    doc[toCamel(k)] = v;
  }
  doc.id = String(doc.id);
  doc.toJSON = function () {
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(this)) {
      if (k !== "toJSON") out[k] = v;
    }
    return out;
  };
  return doc;
}

function buildWhere(filter: Record<string, any>): { clause: string; values: any[] } {
  const conds: string[] = [];
  const vals: any[] = [];
  for (const [key, val] of Object.entries(filter)) {
    if (val === undefined) continue;
    const col = toSnake(key);
    if (val === null) {
      conds.push(`"${col}" IS NULL`);
    } else if (typeof val === "object" && val !== null && "$ne" in val) {
      const neVal = col === "id" ? Number(val.$ne) || 0 : val.$ne;
      vals.push(neVal);
      conds.push(`"${col}" != $${vals.length}`);
    } else {
      const v = col === "id" ? Number(val) || 0 : val;
      vals.push(v);
      conds.push(`"${col}" = $${vals.length}`);
    }
  }
  return { clause: conds.length ? `WHERE ${conds.join(" AND ")}` : "", values: vals };
}

function buildOrderBy(sort: Record<string, 1 | -1> | null): string {
  if (!sort) return "";
  const parts = Object.entries(sort).map(([key, dir]) => {
    const col = toSnake(key);
    return `"${col}" ${dir === 1 ? "ASC" : "DESC"}`;
  });
  return parts.length ? `ORDER BY ${parts.join(", ")}` : "";
}

class FindQuery<T> implements PromiseLike<T[]> {
  private _sort: Record<string, 1 | -1> | null = null;
  constructor(private table: string, private filter: Record<string, any>) {}
  sort(spec: Record<string, 1 | -1>): this {
    this._sort = spec;
    return this;
  }
  private run(): Promise<T[]> {
    const { clause, values } = buildWhere(this.filter);
    const orderBy = buildOrderBy(this._sort);
    const sql = `SELECT * FROM "${this.table}" ${clause} ${orderBy}`.trim();
    return pool.query(sql, values).then((r) => r.rows.map(rowToDoc) as T[]);
  }
  then<R1 = T[], R2 = never>(
    res?: ((v: T[]) => R1 | PromiseLike<R1>) | null,
    rej?: ((e: any) => R2 | PromiseLike<R2>) | null
  ): Promise<R1 | R2> {
    return this.run().then(res as any, rej as any);
  }
}

class FindOneQuery<T> implements PromiseLike<T | null> {
  private _cols: string = "*";
  constructor(private table: string, private filter: Record<string, any>) {}
  select(fields: string): this {
    const cols = fields
      .trim()
      .split(/\s+/)
      .map((f) => `"${toSnake(f)}"`);
    if (!cols.includes('"id"')) cols.unshift('"id"');
    this._cols = cols.join(", ");
    return this;
  }
  run(): Promise<T | null> {
    const { clause, values } = buildWhere(this.filter);
    const sql = `SELECT ${this._cols} FROM "${this.table}" ${clause} LIMIT 1`.trim();
    return pool
      .query(sql, values)
      .then((r) => (r.rows.length ? (rowToDoc(r.rows[0]) as T) : null));
  }
  then<R1 = T | null, R2 = never>(
    res?: ((v: T | null) => R1 | PromiseLike<R1>) | null,
    rej?: ((e: any) => R2 | PromiseLike<R2>) | null
  ): Promise<R1 | R2> {
    return this.run().then(res as any, rej as any);
  }
}

function makeModel<T>(table: string) {
  return {
    find(filter: Record<string, any> = {}): FindQuery<T> {
      return new FindQuery<T>(table, filter);
    },
    findOne(filter: Record<string, any>): FindOneQuery<T> {
      return new FindOneQuery<T>(table, filter);
    },
    findById(id: string | number): FindOneQuery<T> {
      return new FindOneQuery<T>(table, { id: String(id) });
    },
    async create(data: Record<string, any>): Promise<T> {
      const sd: Record<string, any> = {};
      for (const [k, v] of Object.entries(data)) {
        if (v === undefined) continue;
        sd[toSnake(k)] = v;
      }
      delete sd.id;
      const now = new Date();
      if (!("created_at" in sd)) sd.created_at = now;
      if (!("updated_at" in sd)) sd.updated_at = now;
      const keys = Object.keys(sd).map((k) => `"${k}"`);
      const placeholders = keys.map((_, i) => `$${i + 1}`);
      const values = Object.values(sd);
      const sql = `INSERT INTO "${table}" (${keys.join(", ")}) VALUES (${placeholders.join(", ")}) RETURNING *`;
      try {
        const r = await pool.query(sql, values);
        return rowToDoc(r.rows[0]) as T;
      } catch (e: any) {
        if (e.code === "23505") {
          const d: any = new Error("Duplicate key");
          d.code = 11000;
          throw d;
        }
        throw e;
      }
    },
    async findByIdAndUpdate(
      id: string | number,
      updates: Record<string, any>,
      _opts?: any
    ): Promise<T | null> {
      const numId = Number(id);
      const sd: Record<string, any> = { updated_at: new Date() };
      for (const [k, v] of Object.entries(updates)) {
        if (v === undefined) continue;
        sd[toSnake(k)] = v;
      }
      const keys = Object.keys(sd);
      const sets = keys.map((k, i) => `"${k}" = $${i + 1}`);
      const values: any[] = [...Object.values(sd), numId];
      const sql = `UPDATE "${table}" SET ${sets.join(", ")} WHERE id = $${values.length} RETURNING *`;
      const r = await pool.query(sql, values);
      return r.rows.length ? (rowToDoc(r.rows[0]) as T) : null;
    },
    async findByIdAndDelete(id: string | number): Promise<void> {
      await pool.query(`DELETE FROM "${table}" WHERE id = $1`, [Number(id)]);
    },
    async findOneAndUpdate(
      filter: Record<string, any>,
      updates: Record<string, any>,
      opts?: any
    ): Promise<T | null> {
      const existing = await new FindOneQuery<any>(table, filter).run();
      if (!existing) {
        if (opts?.upsert) return this.create({ ...filter, ...updates });
        return null;
      }
      return this.findByIdAndUpdate(existing.id, updates);
    },
  };
}

export const User = makeModel<any>("users");
export const Category = makeModel<any>("categories");
export const Product = makeModel<any>("products");
export const Blog = makeModel<any>("blogs");
export const Setting = makeModel<any>("settings");
export const Enquiry = makeModel<any>("enquiries");
export const HeroSlide = makeModel<any>("hero_slides");
export const VideoItem = makeModel<any>("video_items");
