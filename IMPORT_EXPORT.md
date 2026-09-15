# CV Builder - Import/Export Feature

## Overview

The CV Builder now supports importing and exporting CV data as JSON files. This allows you to:

- **Save your CV data** to JSON format for easy backup and reuse
- **Import prefilled data** to quickly populate your CV with existing information
- **Share CV data** with others who can import it into their own CV builder

## How to Use

### Exporting Your CV Data

1. Click the **"💾 Save JSON"** button in the header
2. A JSON file with your CV data will be downloaded (e.g., `Jane_Doe_data.json`)
3. You can use this file to import your CV data later or share it with others

### Importing CV Data

1. Click the **"📂 Import"** button in the header
2. Select a JSON file that contains CV data
3. The form will automatically populate with the data from the file
4. Click "OK" on the confirmation message to complete the import

## JSON Data Format

The JSON file should follow this structure:

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
    {
      "title": "Company Name",
      "sub": "Job Title",
      "period": "2020 - 2023",
      "desc": "Description of your responsibilities and achievements"
    }
  ],
  "education": [
    {
      "title": "School/University Name",
      "sub": "Degree/Program",
      "period": "2016 - 2020",
      "desc": "Additional information like GPA, honors, relevant coursework"
    }
  ],
  "skills": ["Skill 1", "Skill 2", "Skill 3"],
  "languages": [
    {
      "name": "English",
      "level": "Native"
    },
    {
      "name": "French",
      "level": "Fluent"
    }
  ]
}
```

## Field Descriptions

| Field        | Description                         | Required |
| ------------ | ----------------------------------- | -------- |
| `name`       | Your full name                      | No       |
| `role`       | Your job title/role                 | No       |
| `email`      | Your email address                  | No       |
| `phone`      | Your phone number                   | No       |
| `address`    | Your location/address               | No       |
| `linkedin`   | Your LinkedIn profile URL           | No       |
| `website`    | Your website or GitHub URL          | No       |
| `dob`        | Your date of birth                  | No       |
| `license`    | Your driver's license type          | No       |
| `summary`    | Professional summary/bio            | No       |
| `misc`       | Miscellaneous information           | No       |
| `photo`      | Base64 encoded photo (or null)      | No       |
| `experience` | Array of work experiences           | No       |
| `education`  | Array of educational background     | No       |
| `skills`     | Array of skills                     | No       |
| `languages`  | Array of languages with proficiency | No       |

## Example Files

A sample CV data file (`sample-cv-data.json`) is included in the project for reference. You can use it as a template to create your own CV data file.

## Tips

- **Backup your data**: Export your CV data regularly as a backup
- **Share with others**: Export your CV data and share the JSON file with others who can import it
- **Customize**: Edit the JSON file in a text editor to customize the data before importing
- **Photo import**: Currently, photos must be included as base64-encoded strings in the JSON file (leave as `null` if you don't have a photo encoded)

## Troubleshooting

If you encounter errors when importing:

1. **Invalid JSON**: Make sure the file is valid JSON format. You can validate it using [jsonlint.com](https://www.jsonlint.com)
2. **Missing fields**: Not all fields are required. You can include only the fields you need.
3. **Field names**: Make sure field names match exactly (they are case-sensitive)

## Future Enhancements

- Support for CSV import/export
- Built-in photo upload with automatic base64 encoding
- Multiple template support
- Cloud sync for automatic backup
