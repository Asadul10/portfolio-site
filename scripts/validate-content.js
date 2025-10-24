const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const contentDir = path.join(process.cwd(), 'content');
const projectsDir = path.join(contentDir, 'projects');
const postsDir = path.join(contentDir, 'posts');

function validateProject(filePath) {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(fileContents);
  
  const requiredFields = ['title', 'slug', 'category', 'year', 'tags', 'summary', 'cover'];
  const errors = [];
  
  // Check required fields
  for (const field of requiredFields) {
    if (!data[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }
  
  // Validate year
  if (data.year && (typeof data.year !== 'number' || data.year < 2020 || data.year > 2030)) {
    errors.push('Year must be a number between 2020 and 2030');
  }
  
  // Validate tags
  if (data.tags && (!Array.isArray(data.tags) || data.tags.length === 0)) {
    errors.push('Tags must be a non-empty array');
  }
  
  // Validate category
  const validCategories = ['Web Apps', 'Cybersecurity Labs', 'Networking', 'Data/ML', 'Other'];
  if (data.category && !validCategories.includes(data.category)) {
    errors.push(`Category must be one of: ${validCategories.join(', ')}`);
  }
  
  // Check if cover image exists
  if (data.cover) {
    const coverPath = path.join(process.cwd(), 'public', data.cover);
    if (!fs.existsSync(coverPath)) {
      errors.push(`Cover image not found: ${data.cover}`);
    }
  }
  
  // Check if images exist
  if (data.images) {
    for (const image of data.images) {
      const imagePath = path.join(process.cwd(), 'public', image.src);
      if (!fs.existsSync(imagePath)) {
        errors.push(`Image not found: ${image.src}`);
      }
    }
  }
  
  // Check if PDFs exist
  if (data.pdfs) {
    for (const pdf of data.pdfs) {
      const pdfPath = path.join(process.cwd(), 'public', pdf.src);
      if (!fs.existsSync(pdfPath)) {
        errors.push(`PDF not found: ${pdf.src}`);
      }
    }
  }
  
  return errors;
}

function validatePost(filePath) {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(fileContents);
  
  const requiredFields = ['title', 'slug', 'date', 'tags', 'summary'];
  const errors = [];
  
  // Check required fields
  for (const field of requiredFields) {
    if (!data[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }
  
  // Validate date
  if (data.date && isNaN(Date.parse(data.date))) {
    errors.push('Date must be a valid date string');
  }
  
  // Validate tags
  if (data.tags && (!Array.isArray(data.tags) || data.tags.length === 0)) {
    errors.push('Tags must be a non-empty array');
  }
  
  return errors;
}

function validateContent() {
  console.log('🔍 Validating content...\n');
  
  let hasErrors = false;
  
  // Validate projects
  console.log('📁 Validating projects...');
  const projectFiles = fs.readdirSync(projectsDir).filter(file => file.endsWith('.mdx'));
  
  for (const file of projectFiles) {
    const filePath = path.join(projectsDir, file);
    const errors = validateProject(filePath);
    
    if (errors.length > 0) {
      console.error(`❌ ${file}:`);
      errors.forEach(error => console.error(`   - ${error}`));
      hasErrors = true;
    } else {
      console.log(`✅ ${file}`);
    }
  }
  
  // Validate posts
  console.log('\n📝 Validating posts...');
  const postFiles = fs.readdirSync(postsDir).filter(file => file.endsWith('.mdx'));
  
  for (const file of postFiles) {
    const filePath = path.join(postsDir, file);
    const errors = validatePost(filePath);
    
    if (errors.length > 0) {
      console.error(`❌ ${file}:`);
      errors.forEach(error => console.error(`   - ${error}`));
      hasErrors = true;
    } else {
      console.log(`✅ ${file}`);
    }
  }
  
  if (hasErrors) {
    console.log('\n❌ Content validation failed!');
    process.exit(1);
  } else {
    console.log('\n✅ All content is valid!');
  }
}

validateContent();
