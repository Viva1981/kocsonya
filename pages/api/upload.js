import { google } from "googleapis";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
  runtime: "nodejs", // ⚠️ KÖTELEZŐ: ne Edge runtime
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    // ===== 1️⃣ ENV VÁLTOZÓK =====
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    const privateKeyBase64 = process.env.GOOGLE_PRIVATE_KEY_BASE64;

    if (!clientEmail || !sheetId || !folderId || !privateKeyBase64) {
      throw new Error("Missing Google environment variables");
    }

    // ===== 2️⃣ PRIVATE KEY BASE64 → STRING =====
    const privateKey = Buffer.from(
      privateKeyBase64,
      "base64"
    ).toString("utf8");

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
      return res.status(400).json({
        ok: false,
        message: "Missing form data",
      });
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

    // ===== 7️⃣ GOOGLE SHEET SOR =====
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

    // ===== 8️⃣ KÉSZ =====
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return res.status(500).json({
      ok: false,
      message: err?.message || "Internal server error",
    });
  }
}

