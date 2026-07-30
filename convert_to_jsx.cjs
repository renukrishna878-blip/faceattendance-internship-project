const fs = require('fs');
const path = require('path');

const htmlDir = path.join(__dirname, 'stitch_html');
const pagesDir = path.join(__dirname, 'frontend', 'src', 'pages');

// Mapping of HTML filenames to React Component names
const fileMapping = {
  'Add_New_Student.html': 'AddNewStudent',
  'Student_Profile_Alex_Thompson.html': 'StudentProfile',
  'Take_Attendance_Selection.html': 'TakeAttendance',
  'Processing_Attendance.html': 'UploadClassroomPhoto',
  'Shader.html': 'AIProcessing',
  'Attendance_Result.html': 'AttendanceResult',
  'Teacher_Verification_Manual_Override.html': 'TeacherVerification',
  'Attendance_Confirmation_Summary.html': 'AttendanceConfirmation',
  'Attendance_Reports_Analytics.html': 'Reports'
};

function convertHtmlToJsx(htmlContent, componentName) {
  // Extract body content
  let bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let bodyContent = bodyMatch ? bodyMatch[1] : htmlContent;

  // Remove <script> tags inside body
  bodyContent = bodyContent.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Convert class= to className=
  bodyContent = bodyContent.replace(/class=/g, 'className=');

  // Convert for= to htmlFor=
  bodyContent = bodyContent.replace(/for=/g, 'htmlFor=');

  // Handle self-closing tags (img, input, hr, br, path) that might not be closed in HTML
  const tagsToClose = ['img', 'input', 'hr', 'br', 'path', 'circle', 'svg'];
  
  // Very basic fix for self closing (often HTML has <img ...> instead of <img .../>)
  bodyContent = bodyContent.replace(/<(img|input|hr|br)([^>]*?)(?<!\/)>/g, '<$1$2 />');
  
  // Fix inline styles: style="color: red; margin-top: 10px;" -> style={{ color: 'red', marginTop: '10px' }}
  // Since parsing inline style strings to objects is complex in regex, we'll try to find common ones or remove them if they break.
  // Actually, Stitch mostly uses Tailwind, so inline styles are rare except for font-variation-settings.
  bodyContent = bodyContent.replace(/style="font-variation-settings: 'FILL' (\d+);?"/g, "style={{ fontVariationSettings: \"'FILL' $1\" }}");
  bodyContent = bodyContent.replace(/style="([^"]*)"/g, (match, styleString) => {
      // If it contains things we already replaced, leave it
      if(styleString.includes('fontVariationSettings')) return match;
      
      // Remove inline styles that are too complex to regex parse, to prevent React crashes.
      // (Stitch files shouldn't have many critical inline styles anyway).
      return ``; 
  });
  
  // Fix HTML comments
  bodyContent = bodyContent.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');

  // Fix SVG attributes (stroke-width -> strokeWidth, etc)
  const svgAttrs = [
    'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit',
    'fill-rule', 'clip-rule', 'color-interpolation-filters', 'font-variation-settings'
  ];
  svgAttrs.forEach(attr => {
    const camelAttr = attr.replace(/-([a-z])/g, g => g[1].toUpperCase());
    const regex = new RegExp(attr + '=', 'g');
    bodyContent = bodyContent.replace(regex, camelAttr + '=');
  });

  // Create standard React component wrapper
  const jsxCode = `import React from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const ${componentName} = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const store = useStore();

  return (
    <>
      ${bodyContent}
    </>
  );
};

export default ${componentName};
`;

  return jsxCode;
}

Object.entries(fileMapping).forEach(([htmlFile, componentName]) => {
  const htmlFilePath = path.join(htmlDir, htmlFile);
  const jsxFilePath = path.join(pagesDir, `${componentName}.jsx`);

  if (fs.existsSync(htmlFilePath)) {
    const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
    const jsxContent = convertHtmlToJsx(htmlContent, componentName);
    fs.writeFileSync(jsxFilePath, jsxContent, 'utf8');
    console.log(`Converted ${htmlFile} to ${componentName}.jsx`);
  } else {
    console.warn(`File not found: ${htmlFilePath}`);
  }
});
