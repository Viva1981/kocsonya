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
    return res.status(405).json({ ok: false });
  }

  try {
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

    // 👉 EZ A KRITIKUS RÉSZ JAVÍTVA
    const uploadedFile = Array.isArray(files.file)
      ? files.file[0]
      : files.file;

    if (!name || !address || !phone || !uploadedFile) {
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

    // 1️⃣ Drive feltöltés
    const driveResponse = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
      },
      media: {
        mimeType: uploadedFile.mimetype,
        body: fs.createReadStream(uploadedFile.filepath),
      },
    });

    const fileId = driveResponse.data.id;
    const driveLink = `https://drive.google.com/file/d/${fileId}/view`;

    // 2️⃣ Sheet sor
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
    console.error("UPLOAD ERROR:", err);
    return res.status(500).json({ ok: false });
  }
}
