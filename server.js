import express from "express";
import puppeteer from "puppeteer";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("✅ PDF Service is running. Use /pdf?url=https://example.com");
});

// 📝 Generate PDF from a given URL
app.get("/pdf", async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: "Missing ?url=https://..." });
  }

  try {
    console.log(`📄 Generating PDF for ${url}`);
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--single-process", // helps in constrained environments
        "--disable-gpu"
      ]
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });

    const pdf = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="quote.pdf"`
    );
    res.send(pdf);
  } catch (err) {
    console.error("❌ PDF generation failed:", err);
    res.status(500).json({ error: "Failed to generate PDF", details: err.message });
  }
});

// 🐞 Debug route to see what Puppeteer sees
app.get("/debug", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    await page.goto("https://example.com", { waitUntil: "networkidle0", timeout: 60000 });
    const html = await page.content();
    await browser.close();
    res.setHeader("Content-Type", "text/html");
    res.send(html);
  } catch (err) {
    console.error("❌ Debug failed:", err);
    res.status(500).json({ error: "Debug failed", details: err.message });
  }
});

app.listen(PORT, () =>
  console.log(`✅ PDF Service running on port ${PORT}`)
);
