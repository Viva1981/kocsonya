import { google } from "googleapis";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
  runtime: "nodejs", // 🔥 KRITIKUS: ne Edge runtime legyen
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    // ===== 1️⃣ ENV CHECK (ne omoljon némán) =====
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const rawPrivateKey = process.env.GOOGLE_PRIVATE_KEY;
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    if (!clientEmail || !rawPrivateKey || !sheetId || !folderId) {
      throw new Error("Missing Google environment variables");
    }

    if (typeof rawPrivateKey !== "string") {
      throw new Error("GOOGLE_PRIVATE_KEY is not a string");
    }

    // ===== 2️⃣ PRIVATE KEY NORMALIZÁLÁS (MINDEN ESETRE) =====
    let privateKey = rawPrivateKey;

    // ha \n-ekkel van
    if (privateKey.includes("\\n")) {
      privateKey = privateKey.replace(/\\n/g, "\n");
    }

    // ha véletlenül idézőjelek közt lenne
    privateKey = privateKey.trim();

    // ===== 3️⃣ FORM PARSE =====
    const form = formidable({
      multiples: false,
      keepExtensions: true,
    });

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const name = fields.name;
    const address = fields.address;
    const phone = fields.phone;
    const lang = fields.lang || "hu";

    const uploadedFile = Array.isArray(files.file)
      ? files.file[0]
      : files.file;

    if (!name || !address || !phone || !uploadedFile) {
      return res.status(400).json({ ok: false, message: "Missing form data" });
    }

    // ===== 4️⃣ GOOGLE AUTH =====
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/spreadsheets",
      ],
    });

    const drive = google.drive({ version: "v3", auth });
    const sheets = google.sheets({ version: "v4", auth });

    // ===== 5️⃣ FÁJLNÉV =====
    const date = new Date().toISOString().slice(0, 10);
    const safeName = String(name).replace(/\s+/g, "_");
    const fileName = `${date}_${safeName}_${phone}.jpg`;

    // ===== 6️⃣ DRIVE FELTÖLTÉS =====
    const driveResponse = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [folderId],
      },
      media: {
        mimeType: uploadedFile.mimetype,
        body: fs.createReadStream(uploadedFile.filepath),
      },
    });

    const fileId = driveResponse.data.id;
    const driveLink = `https://drive.google.com/file/d/${fileId}/view`;

    // ===== 7️⃣ SHEET SOR BESZÚRÁS =====
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "A:G",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            new Date().toLocaleString("hu-HU"),
            name,
            address,
            phone,
            fileName,
            driveLink,
            lang,
          ],
        ],
      },
    });

    // ===== 8️⃣ OK =====
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return res.status(500).json({
      ok: false,
      message: err?.message || "Internal server error",
    });
  }
}

