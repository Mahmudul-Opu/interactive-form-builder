# FormFlow – Interactive Form Builder with Chatbot Widget

A modern, responsive, full-stack web application that allows users to create interactive forms, publish them, embed chatbot widgets on websites, collect responses, and manage submissions through a dashboard.

Built as a Software Engineer Intern full-stack development project using Next.js, React, TypeScript, Tailwind CSS, and Supabase PostgreSQL.

## 🌐 Live Demo

**Deployed Website:**  
https://interactive-form-builder-opvd.vercel.app/

**GitHub Repository:**  
https://github.com/Mahmudul-Opu/interactive-form-builder

## 📋 Project Information

- **Project Name:** Interactive Form Builder with Chatbot Widget
- **Application Name:** FormFlow
- **Role:** Software Engineer Intern
- **Project Type:** Full-Stack Web Development
- **Frontend:** Next.js, React, TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase PostgreSQL
- **Authentication:** Supabase Auth
- **Deployment:** Vercel
- **Version Control:** Git and GitHub

## ✨ Features

### 1. Responsive Landing Page

- Modern and responsive design
- Navigation bar
- Hero section with headline and CTA buttons
- Features section
- How It Works section
- Live interactive chatbot demonstration
- Footer with navigation and contact links

### 2. User Authentication

- User registration
- Email/password login
- Logout functionality
- Protected dashboard
- Supabase Authentication integration

### 3. User Dashboard

- Total forms statistics
- Total responses statistics
- Published forms statistics
- Create new forms
- Edit existing forms
- Delete forms
- Publish and unpublish forms
- View form status
- View individual submissions
- View submission timestamps

### 4. Interactive Form Builder

Supported question types:

- Text
- Email
- Multiple Choice
- Yes/No

Additional functionality:

- Add new questions
- Edit existing questions
- Delete questions
- Reorder questions
- Configure required fields
- Customize multiple-choice options
- Live chatbot preview
- Customize chatbot colors
- Customize welcome messages
- Customize completion messages

### 5. Conversational Chatbot Widget

- Interactive chat-style interface
- One question displayed at a time
- Text input support
- Email input validation
- Multiple-choice answer buttons
- Yes/No answer buttons
- Required question validation
- Welcome message
- Completion message
- Progress indicator
- Responsive desktop and mobile design

### 6. Publishing and Embedding

- Unique public URL for each form
- Publish and unpublish functionality
- Copy public form links
- JavaScript embedding snippet
- Floating chatbot button
- Embedded chatbot iframe
- External website integration
- Test website for widget demonstration

### 7. Response Management

- PostgreSQL database storage
- Save submitted answers
- View individual submissions
- Display submission timestamps
- Form-specific responses
- Supabase Row Level Security

## 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| Next.js 16 | Web application framework |
| React 19 | Frontend development |
| TypeScript | Type safety |
| Tailwind CSS 4 | Responsive styling |
| Supabase | Authentication and database |
| PostgreSQL | Data storage |
| Lucide React | Icons |
| Git | Version control |
| GitHub | Source code hosting |
| Vercel | Deployment |

## 📁 Project Structure

```text
interactive-form-builder/
│
├── app/
│   ├── dashboard/
│   │   ├── forms/
│   │   │   ├── [id]/
│   │   │   │   ├── edit/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── responses/
│   │   │   │       └── page.tsx
│   │   │   └── page.tsx
│   │   ├── new/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   │
│   ├── embed/
│   │   └── [slug]/
│   │       └── page.tsx
│   │
│   ├── f/
│   │   └── [slug]/
│   │       └── page.tsx
│   │
│   ├── login/
│   │   └── page.tsx
│   │
│   ├── register/
│   │   └── page.tsx
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── AuthGuard.tsx
│   ├── ChatWidget.tsx
│   ├── FormEditor.tsx
│   └── Navbar.tsx
│
├── lib/
│   └── supabase.ts
│
├── public/
│   ├── embed.js
│   └── test-embed.html
│
├── supabase/
│   └── schema.sql
│
├── types/
│   └── index.ts
│
├── .env.example
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

Make sure you have installed:

- Node.js 22 or a compatible supported version
- npm
- Git
- Visual Studio Code

You also need a Supabase account.

### Step 1: Clone the Repository

```bash
git clone https://github.com/Mahmudul-Opu/interactive-form-builder.git
```

Navigate to the project directory:

```bash
cd interactive-form-builder
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Supabase

Visit:

https://supabase.com

Create a new Supabase project.

After creating the project, open its dashboard.

Find your:

- Project URL
- Publishable API key

### Step 4: Configure Environment Variables

Create a `.env.local` file in the project root.

Add:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

Replace both placeholders with your actual Supabase credentials.

**Important:** Never expose Supabase secret or service-role keys.

Do not commit `.env.local` to GitHub.

## 🗄️ Supabase Database Setup

### Step 1: Open SQL Editor

In the Supabase dashboard:

1. Select your project.
2. Navigate to **SQL Editor**.
3. Click **New Query**.

### Step 2: Execute Database Schema

Open:

```text
supabase/schema.sql
```

Copy the entire SQL script.

Paste it into the Supabase SQL Editor.

Click **Run**.

The schema creates the required database tables and access-control policies.

### Step 3: Verify Database Tables

Navigate to:

**Database → Table Editor**

Verify these tables exist:

#### Forms Table

```text
forms
```

Stores:

- Form ID
- User ID
- Title
- Description
- Unique slug
- Questions
- Welcome message
- Completion message
- Primary color
- Published status
- Creation timestamp
- Update timestamp

#### Submissions Table

```text
submissions
```

Stores:

- Submission ID
- Form ID
- Submitted answers
- Submission timestamp

### Step 4: Row Level Security

The database uses Supabase Row Level Security.

Implemented policies restrict:

- Form creation to authenticated users
- Form management to form owners
- Public form access to published forms
- Response viewing to form owners
- Public submissions to published forms

The database schema also includes submission validation.

## 🔐 Supabase Authentication Setup

Open:

**Supabase Dashboard → Authentication → Providers**

Enable the Email provider.

Next, navigate to:

**Authentication → URL Configuration**

Set the production Site URL:

```text
https://interactive-form-builder-opvd.vercel.app
```

Add the following redirect URLs:

```text
http://localhost:3000/**
```

```text
https://interactive-form-builder-opvd.vercel.app/**
```

Save the configuration.

## ▶️ Run the Project Locally

Start the development server:

```bash
npm run dev
```

Open:

http://localhost:3000

The application will run locally.

## 📝 How to Use FormFlow

### Step 1: Register

Visit:

https://interactive-form-builder-opvd.vercel.app/register

Create an account.

### Step 2: Login

Visit:

https://interactive-form-builder-opvd.vercel.app/login

Log in with your registered credentials.

### Step 3: Access Dashboard

Visit:

https://interactive-form-builder-opvd.vercel.app/dashboard

The dashboard displays your forms and response statistics.

### Step 4: Create a Form

Click **Create New Form**.

Enter:

- Form title
- Description

### Step 5: Add Questions

Add supported questions:

- Text
- Email
- Multiple Choice
- Yes/No

Configure which questions are required.

### Step 6: Customize Chatbot

Open the Settings tab in the form editor.

Customize:

- Welcome message
- Completion message
- Primary color

### Step 7: Preview

Preview the chatbot before publishing.

The preview displays questions in a conversational interface.

Preview answers are not saved.

### Step 8: Publish

Save the form.

Return to the dashboard.

Click **Publish**.

### Step 9: Share the Form

Click **Copy Link**.

A unique public URL is generated.

Example:

```text
https://interactive-form-builder-opvd.vercel.app/f/YOUR_FORM_SLUG
```

### Step 10: Submit Responses

Open the public URL.

Answer the chatbot questions.

Complete the form to submit your responses.

### Step 11: View Submissions

Return to the dashboard.

Click **Responses**.

View individual submissions and timestamps.

## 💬 JavaScript Chatbot Embedding

FormFlow supports embedding published chatbot widgets on external websites.

After publishing a form:

1. Open the dashboard.
2. Select a published form.
3. Click **Embed Code**.
4. Copy the generated script.

Example:

```html
<script
  src="https://interactive-form-builder-opvd.vercel.app/embed.js"
  data-form="YOUR_FORM_SLUG"
></script>
```

Replace `YOUR_FORM_SLUG` with the actual published form slug.

Paste the script before the closing `</body>` tag of your website.

The script creates a floating chatbot button.

Clicking the button opens the embedded chatbot.

## 🧪 Test Website

A sample HTML website is included:

```text
public/test-embed.html
```

To test:

1. Create and publish a form.
2. Copy its slug.
3. Open `public/test-embed.html`.
4. Replace `YOUR_FORM_SLUG`.
5. Save the file.

Open the local test page:

```text
http://localhost:3000/test-embed.html
```

Or the deployed test page:

https://interactive-form-builder-opvd.vercel.app/test-embed.html

Click the floating chatbot button.

Complete a submission.

Verify that the response appears in the dashboard.

For full external embedding verification, place the embed script on a separately hosted website.

## 🏗️ Production Build

Run:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

Run ESLint:

```bash
npm run lint
```

The project has successfully completed a local Next.js production build.

## 🚀 Deployment on Vercel

The application is deployed using Vercel.

**Live Application:**

https://interactive-form-builder-opvd.vercel.app/

**GitHub Repository:**

https://github.com/Mahmudul-Opu/interactive-form-builder

### Deployment Steps

1. Upload the project to GitHub.
2. Sign in to https://vercel.com.
3. Import the GitHub repository.
4. Select Next.js as the framework.
5. Configure the Supabase environment variables.
6. Deploy the application.
7. Update Supabase authentication redirect URLs.

Required Vercel environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

## ✅ Assignment Completion Criteria

The application is designed to support the following workflow:

1. Register and log in.
2. Create an interactive form.
3. Add and customize questions.
4. Preview the chatbot.
5. Save and publish the form.
6. Generate a unique public URL.
7. Embed the chatbot on a test website.
8. Collect visitor responses.
9. Store responses in PostgreSQL.
10. View saved submissions in the dashboard.

## 🔒 Security

The application uses:

- Supabase Authentication
- PostgreSQL Row Level Security
- User-specific form ownership
- Protected response visibility
- Required-field validation
- Email validation
- Database-side submission validation

For production use, additional protections such as rate limiting, spam prevention, and monitoring are recommended.

## 🔮 Future Improvements

Potential future features include:

- Drag-and-drop form builder
- Advanced response analytics
- CSV export
- Form templates
- Additional question types
- Spam protection
- Response filtering and searching

## 👨‍💻 Developer

**GitHub:**  
https://github.com/Mahmudul-Opu

**Project Repository:**  
https://github.com/Mahmudul-Opu/interactive-form-builder

**Live Website:**  
https://interactive-form-builder-opvd.vercel.app/

## 📄 License

Developed as a Software Engineer Intern full-stack web development assignment.