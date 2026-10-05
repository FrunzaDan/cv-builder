# CV Builder

CV Builder is a browser-based tool for writing a CV and exporting it as a PDF. You fill in a form and see a live preview of the CV, laid out as A4 pages, as you type. Work experience, education, skills and languages can have as many entries as you need, and you can add a photo. Your data auto-saves in the browser, and you can also save it to a JSON file and import it again later. It's deliberately framework-free, with no build step and no backend: only HTML, CSS and vanilla JavaScript.

---

## Key Features

- **Live preview:** The CV preview updates as you type and is split into A4 pages exactly as the PDF will be, with a footer and page number pinned to the bottom of each sheet. What you see on screen is what gets exported.
- **Repeatable sections:** Work experience and education entries can be added and removed freely, each with a title, subtitle, period and description. Skills are entered as tags, languages have a name and level, and you can upload a photo.
- **PDF export:** Exports the CV as a paginated A4 PDF through [html2pdf.js](https://github.com/eKoopmans/html2pdf.js). Page breaks are moved up to the nearest safe point, so an entry is never cut in half between two pages.
- **JSON save and import:** **Save JSON** downloads your data as a file, and **Import** loads a file back into the form. This is handy for keeping several versions of a CV or moving it to another computer.
- **Auto-save:** The form is saved to `localStorage` as you work, so a page reload or closed tab doesn't lose anything. **Clear Saved Data** removes it after asking for confirmation.

---

## Tech Stack

- **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Backend:** N/A
- **Database / Storage:** Browser `localStorage`
- **Tooling & Other:** html2pdf.js 0.14.0, loaded from the cdnjs CDN

---

## Prerequisites

Before running this project, ensure you have the following installed:

- A modern browser (Chrome, Firefox, Safari or Edge)
- An internet connection for PDF export, since `index.html` loads html2pdf.js from a CDN

---

## Local Setup & Running

### 1. Clone the repository

```bash
git clone https://github.com/FrunzaDan/cv-builder.git
cd cv-builder
```

### 2. Configuration

None. There are no environment variables or settings files.

### 3. Installation & Run

There's nothing to install. Open `index.html` in a browser:

```bash
open index.html        # macOS
xdg-open index.html    # Linux
```

If you prefer serving it over HTTP, any static server works, for example `python3 -m http.server 8000`.

---

## API / App Usage

Use **Save JSON** to download your current data and **Import** to load a JSON file back into the form. [`sample-cv-data.json`](sample-cv-data.json) shows the expected shape:

```json
{
  "name": "Your Name",
  "role": "Job Title",
  "email": "your.email@example.com",
  "phone": "+1 234 567 8900",
  "address": "City, Country",
  "linkedin": "linkedin.com/in/yourprofile",
  "website": "your-website.com",
  "dob": "01 Jan 1990",
  "license": "Class B",
  "summary": "Your professional summary here...",
  "misc": "Additional information, certifications, awards, etc.",
  "photo": null,
  "experience": [
    { "title": "Company Name", "sub": "Job Title", "period": "2020 - 2023", "desc": "..." }
  ],
  "education": [
    { "title": "School Name", "sub": "Degree", "period": "2016 - 2020", "desc": "..." }
  ],
  "skills": ["Skill 1", "Skill 2"],
  "languages": [{ "name": "English", "level": "Native" }]
}
```

All fields are optional.

Project files:

- [`index.html`](index.html): form and preview markup
- [`app.js`](app.js): state, rendering, pagination, PDF export, JSON import/export, auto-save
- [`styles.css`](styles.css): styling for the form and the CV preview

---

## License & Notes

Personal project with no license file. Everything runs in the browser; your CV data never leaves your machine except through files you download yourself.
