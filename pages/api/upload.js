import { google } from "googleapis";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    const form = formidable({ multiples: false });

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const { name, address, phone, lang } = fields;
    const file = files.file;

    if (!name || !address || !phone || !file) {
      return res.status(400).json({ ok: false, message: "Missing data" });
    }

    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/spreadsheets",
      ],
    });

    const drive = google.drive({ version: "v3", auth });
    const sheets = google.sheets({ version: "v4", auth });

    const date = new Date().toISOString().slice(0, 10);
    const safeName = name.replace(/\s+/g, "_");
    const fileName = `${date}_${safeName}_${phone}.jpg`;

    // 1️⃣ Feltöltés Drive-ba
    const driveResponse = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
      },
      media: {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.filepath),
      },
    });

    const fileId = driveResponse.data.id;
    const driveLink = `https://drive.google.com/file/d/${fileId}/view`;

    // 2️⃣ Sor beszúrás Google Sheetbe
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
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

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Upload failed" });
  }
}

