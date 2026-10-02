# CV Builder

A static CV/resume builder: fill in a form, watch a live preview and export the result as an A4 PDF. I built it as a no-framework project with no build step and no backend, only HTML, CSS and vanilla JavaScript.

---

## 🚀 Key Features

- **Live preview:** The CV preview updates as you type, laid out as A4 pages.
- **Repeatable sections:** Add and remove entries for work experience, education, skills (as tags) and languages, plus a photo upload.
- **PDF export:** Exports a paginated A4 PDF through [html2pdf.js](https://github.com/eKoopmans/html2pdf.js). Page breaks are moved so an entry isn't cut in half.
- **JSON save and import:** Download your data as a JSON file and load it back later.
- **Auto-save:** The form is saved to `localStorage`, so a page reload doesn't lose your work. A "clear saved data" action asks for confirmation first.

---

## 🛠 Tech Stack

- **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Backend:** N/A
- **Database / Storage:** Browser `localStorage`
- **Tooling & Other:** html2pdf.js 0.10.1, loaded from the cdnjs CDN

---

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

- A modern browser (Chrome, Firefox, Safari or Edge)
- An internet connection for PDF export, since `index.html` loads html2pdf.js from a CDN

---

## ⚙️ Local Setup & Running

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

## 🔌 API / App Usage

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

## 📝 License & Notes

Personal project with no license file. Everything runs in the browser; your CV data never leaves your machine except through files you download yourself.
