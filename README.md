# CV Builder

A simple, static CV/resume builder. Fill in a form, see a live preview, export to PDF. No build step, no framework, no backend — just HTML, CSS, and vanilla JS.

## Usage

Open [index.html](index.html) in a browser. That's it.

## Features

- Live preview that updates as you type
- Photo upload
- Add/remove entries for work experience, education, skills, and languages
- Export the CV as a paginated PDF (via [html2pdf.js](https://github.com/eKoopmans/html2pdf.js))
- Save/import your data as a JSON file
- Auto-saves to `localStorage` so a page reload doesn't lose your data

## Project structure

- [index.html](index.html) — form + preview markup
- [app.js](app.js) — all the logic (state, rendering, PDF export, pagination)
- [styles.css](styles.css) — styling for both the form and the CV preview
- [sample-cv-data.json](sample-cv-data.json) — example file for the JSON import feature

## JSON import/export

Use the **Save JSON** button to download your current data, and **Import** to load a JSON file back into the form. See [sample-cv-data.json](sample-cv-data.json) for the expected shape:

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
