import { google } from 'googleapis';
import { type Role } from '@prisma/client';
import { prisma } from './prisma.js';
import { hashPassword } from './auth.js';

type RowMap = Record<string, string>;

const emailAliases = ['email', 'correo', 'correoelectronico', 'mail', 'e-mail'];
const nameAliases = ['name', 'nombre', 'nombres', 'fullname', 'nombrecompleto', 'nombrepersona'];
const passwordAliases = ['password', 'contrasena', 'contraseña', 'clave', 'pass'];
const roleAliases = ['role', 'rol', 'tipo', 'tipo_usuario', 'tipousuario'];
const cedulaAliases = ['numerocedula', 'cedula', 'numerodecedula', 'documento', 'numerodocumento', 'cc', 'dni', 'id'];

export interface SyncStats {
  totalRows: number;
  created: number;
  updated: number;
  unchanged: number;
  skipped: number;
}

function normalizeHeader(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function getFromAliases(row: RowMap, aliases: string[]): string {
  for (const alias of aliases) {
    const normalized = normalizeHeader(alias);
    const match = row[normalized];
    if (match && match.trim().length > 0) {
      return match.trim();
    }
    const partialEntry = Object.entries(row).find(([key, value]) =>
      value.trim().length > 0 && (key.includes(normalized) || normalized.includes(key))
    );
    if (partialEntry) {
      return partialEntry[1].trim();
    }
  }
  return '';
}

function parseRole(value: string): Role {
  const normalized = normalizeHeader(value);
  if (normalized === 'admin' || normalized === 'administrador') return 'ADMIN';
  if (normalized === 'staff' || normalized === 'stafflogistico') return 'STAFF';
  if (normalized === 'speaker' || normalized === 'conferencista' || normalized === 'professor' || normalized === 'profesor' || normalized === 'ponente') return 'SPEAKER';
  if (normalized === 'committee' || normalized === 'comite' || normalized === 'comiteorganizador') return 'COMMITTEE';
  if (normalized === 'sponsor' || normalized === 'patrocinador' || normalized === 'patrocinadoroficial') return 'SPONSOR';
  if (normalized === 'assistantsurgical' || normalized === 'asistentequirurgico' || normalized === 'entrenamientoquirurgico') return 'ASSISTANT_SURGICAL';
  if (normalized === 'assistantvirtual' || normalized === 'asistentevirtual' || normalized === 'virtual') return 'ASSISTANT_VIRTUAL';
  return 'ASSISTANT';
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (!value) return fallback;
  const normalized = value.trim().toLowerCase();
  if (['1', 'true', 'yes', 'si', 'sí'].includes(normalized)) return true;
  if (['0', 'false', 'no'].includes(normalized)) return false;
  return fallback;
}

function parseEmailSet(value: string | undefined): Set<string> {
  if (!value) return new Set<string>();
  return new Set(
    value
      .split(',')
      .map((item) => item.trim().toLowerCase())
      .filter((item) => item.length > 0)
  );
}

function hasServiceAccountConfigured(): boolean {
  const hasJson = Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim());
  const hasPair = Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim() &&
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.trim()
  );
  return hasJson || hasPair;
}

function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') {
      const next = line[index + 1];
      if (inQuotes && next === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }
  result.push(current.trim());
  return result;
}

function mapRowsFromValues(values: string[][]): RowMap[] {
  if (values.length === 0) return [];
  const headers = values[0].map((item) => normalizeHeader(String(item ?? '')));
  const dataRows = values.slice(1);
  return dataRows
    .map((cells) => {
      const row: RowMap = {};
      headers.forEach((header, index) => {
        if (!header) return;
        row[header] = String(cells[index] ?? '').trim();
      });
      return row;
    })
    .filter((row) => Object.values(row).some((value) => value.length > 0));
}

async function fetchSheetRowsPublicCsv(spreadsheetId: string): Promise<RowMap[]> {
  const gid = process.env.GOOGLE_SHEET_GID?.trim() || '0';
  const csvUrl =
    process.env.GOOGLE_SHEET_CSV_URL?.trim() ||
    `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;

  const response = await fetch(csvUrl);
  if (!response.ok) {
    throw new Error(`Public CSV fetch failed (${response.status}) from ${csvUrl}`);
  }

  const text = await response.text();
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const values = lines.map((line) => splitCsvLine(line));
  return mapRowsFromValues(values);
}

function getServiceAccountCredentials() {
  const inlineJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (inlineJson && inlineJson.trim().length > 0) {
    const parsed = JSON.parse(inlineJson);
    if (!parsed.client_email || !parsed.private_key) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON must include client_email and private_key');
    }
    return { clientEmail: String(parsed.client_email), privateKey: String(parsed.private_key) };
  }

  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (!clientEmail || !privateKey) {
    throw new Error(
      'Missing Google credentials: set GOOGLE_SERVICE_ACCOUNT_JSON or GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY'
    );
  }
  return { clientEmail, privateKey };
}

async function fetchSheetRows(): Promise<RowMap[]> {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID?.trim();
  if (!spreadsheetId) throw new Error('Missing GOOGLE_SHEET_ID in environment');

  if (!hasServiceAccountConfigured()) {
    return fetchSheetRowsPublicCsv(spreadsheetId);
  }

  const range = process.env.GOOGLE_SHEET_RANGE?.trim() || 'Registros!A:Z';
  const { clientEmail, privateKey } = getServiceAccountCredentials();
  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
  const values = (response.data.values ?? []).map((cells) =>
    cells.map((cell) => String(cell ?? ''))
  );
  return mapRowsFromValues(values);
}

export async function syncUsersFromSheet(): Promise<SyncStats> {
  const rows = await fetchSheetRows();
  if (rows.length === 0) return { totalRows: 0, created: 0, updated: 0, unchanged: 0, skipped: 0 };

  const defaultPassword = process.env.GOOGLE_SHEET_DEFAULT_PASSWORD?.trim() || '';
  const shouldUpdatePasswords = parseBoolean(process.env.GOOGLE_SHEET_UPDATE_PASSWORDS, true);
  const forcedAdminEmails = parseEmailSet(process.env.GOOGLE_SHEET_FORCE_ADMIN_EMAILS);

  let created = 0;
  let updated = 0;
  let skipped = 0;
  let unchanged = 0;

  for (const row of rows) {
    try {
      const email = getFromAliases(row, emailAliases).toLowerCase();
      if (!email) { skipped += 1; continue; }

      const name = getFromAliases(row, nameAliases) || email.split('@')[0] || 'Usuario';
      const role = forcedAdminEmails.has(email)
        ? 'ADMIN'
        : parseRole(getFromAliases(row, roleAliases));
      const cedula = getFromAliases(row, cedulaAliases) || undefined;
      const incomingPassword = getFromAliases(row, passwordAliases);
      // Use explicit password → cedula → default password (in that order)
      const finalPassword = incomingPassword || cedula || defaultPassword;

      if (!finalPassword) {
        skipped += 1;
        continue;
      }

      const existing = await prisma.user.findUnique({ where: { email } });
      if (!existing) {
        const passwordHash = await hashPassword(finalPassword);
        await prisma.user.create({ data: { name, email, cedula, passwordHash, role } });
        created += 1;
        continue;
      }

      const updateData: { name?: string; role?: Role; passwordHash?: string; cedula?: string } = {};
      if (existing.name !== name) updateData.name = name;
      if (existing.role !== role) updateData.role = role;
      if (cedula && existing.cedula !== cedula) updateData.cedula = cedula;
      if (shouldUpdatePasswords) updateData.passwordHash = await hashPassword(finalPassword);

      if (Object.keys(updateData).length === 0) { unchanged += 1; continue; }

      await prisma.user.update({ where: { email }, data: updateData });
      updated += 1;
    } catch (error) {
      skipped += 1;
      console.error('Row sync failed:', error);
    }
  }

  return { totalRows: rows.length, created, updated, unchanged, skipped };
}
