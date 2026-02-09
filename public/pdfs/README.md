# PDF Files Folder

## Add Your PDF Files Here

Place your PDF books here to make them available in the library.

### Example:
```
public/pdfs/
├── book1.pdf
├── book2.pdf
├── tutorial.pdf
└── README.md (this file)
```

### Usage:

After adding PDF files:

1. Update the library at `src/app/library/page.tsx`
2. Or access directly: `/reader?file=/pdfs/your-file.pdf`

### Recommended PDF Size:
- Under 50MB for best performance
- Compress large PDFs if needed

### File Naming:
- Use lowercase and hyphens: `my-book.pdf`
- Avoid spaces and special characters
- Use descriptive names
