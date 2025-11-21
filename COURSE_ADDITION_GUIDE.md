# Guide: Adding a New Course

This guide explains how to add a new certification course to the site.

## Quick Start

1. **Add Course Configuration**
   - Edit `courses.config.js`
   - Add your course object to the `courses` array

2. **Create Course Directory**
   - Create `docs/courses/YOUR_COURSE_ID/` directory
   - Follow the structure of existing courses

3. **Update Sidebar**
   - Edit `sidebars.js`
   - Add a new sidebar configuration for your course

4. **Create Course Content**
   - Start with `intro.md` in your course directory
   - Add modules following the existing pattern

## Step-by-Step Instructions

### 1. Add Course to Configuration

Edit `courses.config.js` and add your course:

```javascript
{
  id: 'your-course-id',           // Unique identifier (lowercase, hyphens)
  name: 'Full Course Name',        // Display name
  shortName: 'Short Name',         // Abbreviation for navigation
  description: 'Course description',
  icon: '🚀',                      // Emoji icon
  color: '#FF9900',                // Theme color (hex)
  path: 'courses/your-course-id',  // URL path
  examGuideUrl: 'https://...',     // Official exam guide URL
  officialDocsUrl: 'https://...',  // Official documentation URL
  duration: '6-8 weeks',           // Expected duration
  level: 'Associate',              // Certification level
  category: 'Cloud Certification', // Category
},
```

### 2. Create Course Directory Structure

```bash
mkdir -p docs/courses/your-course-id/{00-introduction,01-module-name,02-module-name,...}
```

### 3. Create Course Introduction

Create `docs/courses/your-course-id/intro.md`:

```markdown
# Welcome to [Course Name]

Welcome! This course prepares you for the [Certification Name] exam.

## Course Overview

[Add course details]

## Learning Objectives

[Add learning objectives]

## Course Structure

[Add module breakdown]
```

### 4. Create Course Modules

For each module, create:
- `overview.md` - Module overview and learning objectives
- `topic1.md`, `topic2.md` - Individual topics
- `practice.md` - Practice questions

### 5. Update Sidebar Configuration

Edit `sidebars.js` and add a new sidebar:

```javascript
yourCourseSidebar: [
  {
    type: 'doc',
    id: 'courses/your-course-id/intro',
    label: 'Course Introduction',
  },
  {
    type: 'category',
    label: 'Module 1: Module Name',
    items: [
      'courses/your-course-id/01-module/overview',
      'courses/your-course-id/01-module/topic1',
      'courses/your-course-id/01-module/practice',
    ],
  },
  // Add more modules...
],
```

### 6. Update Navigation (Optional)

The navigation dropdown is automatically generated from `courses.config.js`, so no changes needed unless you want custom navigation items.

## Course Content Structure

Each course should follow this structure:

```
docs/courses/your-course-id/
├── intro.md                    # Course introduction
├── 00-introduction/
│   ├── course-overview.md
│   ├── exam-strategy.md
│   └── learning-path.md
├── 01-module-name/
│   ├── overview.md
│   ├── topic1.md
│   ├── topic2.md
│   └── practice.md
├── 02-module-name/
│   └── ...
└── 10-practice-exams/
    ├── full-length-exam-1.md
    └── exam-1-answers.md
```

## Content Guidelines

### Use Docusaurus Admonitions

```markdown
:::tip Exam Tip
This is an exam tip.
:::

:::warning Common Pitfall
This is a warning.
:::

:::note Remember
This is a note.
:::
```

### Include Code Examples

```bash
# CLI commands
gcloud compute instances list
```

```yaml
# YAML configurations
apiVersion: v1
kind: Pod
```

### Practice Questions Format

```markdown
### Question 1
[Question text]

A. Option A
B. Option B
C. Option C
D. Option D

<details>
<summary>Answer</summary>

**B. Option B**

Explanation of why B is correct and others are wrong.

</details>
```

## Testing Your Course

1. **Local Development**
   ```bash
   npm install
   npm start
   ```

2. **Check Navigation**
   - Verify course appears in "Courses" dropdown
   - Verify course card appears on `/courses` page
   - Verify sidebar navigation works

3. **Check Links**
   - All internal links should work
   - All external links should be valid

## Example: Adding AWS SAA Course

1. **Add to `courses.config.js`:**
```javascript
{
  id: 'aws-saa',
  name: 'AWS Solutions Architect Associate',
  shortName: 'AWS SAA',
  description: 'Complete course for AWS Solutions Architect Associate certification',
  icon: '🚀',
  color: '#FF9900',
  path: 'courses/aws-saa',
  examGuideUrl: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/',
  officialDocsUrl: 'https://docs.aws.amazon.com/',
  duration: '6-8 weeks',
  level: 'Associate',
  category: 'Cloud Certification',
},
```

2. **Create directory:**
```bash
mkdir -p docs/courses/aws-saa/{00-introduction,01-compute,02-storage,...}
```

3. **Add sidebar in `sidebars.js`:**
```javascript
awsSaaSidebar: [
  {
    type: 'doc',
    id: 'courses/aws-saa/intro',
    label: 'Course Introduction',
  },
  // Add modules...
],
```

4. **Create content files following the structure**

## Need Help?

- Check existing course (`docs/courses/gcp-ace/`) as a reference
- Review Docusaurus documentation for markdown features
- Check `sidebars.js` for sidebar configuration examples

Happy course creation! 🎓

