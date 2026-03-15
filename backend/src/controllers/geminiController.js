const fs = require("fs");
const path = require("path");
const mime = require("mime-types");
const { GoogleGenAI } = require("@google/genai");
const Report = require("../models/Report");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

exports.analyzeReportWithGemini = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findByPk(id);
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    if (!report.image_url) {
      return res.status(400).json({ error: "This report has no image" });
    }

    // نفترض أن image_url عندكم مثل:
    // /uploads/reports/filename.jpg
    const relativePath = report.image_url.replace(/^\/+/, "");
    const absolutePath = path.join(process.cwd(), relativePath);

    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ error: "Image file not found on server" });
    }

    const imageBuffer = fs.readFileSync(absolutePath);
    const mimeType = mime.lookup(absolutePath) || "image/jpeg";
    const base64Image = imageBuffer.toString("base64");

    const prompt = `
You are analyzing a road image for a graduation-project demo called Phoenix Eye.

Task:
Determine whether the image likely contains a DEAD animal (roadkill) or NOT.

Return ONLY valid JSON in this exact format:
{
  "is_dead_animal": true,
  "confidence": 0.91,
  "animal_detected": true,
  "label": "dead animal",
  "explanation": "short explanation"
}

Rules:
- confidence must be between 0 and 1
- if you are unsure, set lower confidence
- do not include markdown
- do not include extra text
- focus only on whether the visible animal appears dead on the road
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType,
                data: base64Image,
              },
            },
            { text: prompt },
          ],
        },
      ],
    });

    let text = response.text || "";

    // تنظيف احتياطي لو رجع fenced JSON
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (parseError) {
      return res.status(500).json({
        error: "Gemini returned non-JSON response",
        raw: text,
      });
    }

    return res.json({
      message: "Gemini analysis completed",
      report_id: report.id,
      result: parsed,
    });
  } catch (error) {
    console.error("Gemini analysis error:", error);
    return res.status(500).json({ error: "Gemini analysis failed" });
  }
};