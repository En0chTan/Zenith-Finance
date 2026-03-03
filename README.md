# MyDOIT

MyDOIT is a full-stack, AI-powered personal finance management application built to help users seamlessly track, visualize, and analyze their financial health.

## Features

- **Interactive Dashboard**: Gain insights into your spending habits through dynamic, interactive charts (powered by Recharts).
- **AI Financial Advisor**: Integrated with Google Gemini to provide personalized financial advice and insights based on your transaction history.
- **Robust Data Management**: Add transactions manually or import them in bulk via CSV.
- **Comprehensive History**: View, edit, and delete your transaction history with ease. Includes powerful filtering by specific date ranges (year and month).
- **Multi-Year Support**: Aggregates and displays historical data with currency formatting in RM (Malaysian Ringgit).
- **Responsive & Accessible UI**: Built with Tailwind CSS and Radix UI primitives. Fully responsive layout that respects system preferences, including a toggleable dark mode.
- **Authentication & Storage**: Secure backend powered by Supabase for user authentication and database capabilities.

## Tech Stack

- **Frontend Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/), [shadcn/ui](https://ui.shadcn.com/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Backend & Auth**: [Supabase](https://supabase.com/)
- **AI Integration**: [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai)

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- A Supabase Project
- A Google Gemini API Key

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd zenith-finance
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy the `.env.example` file to `.env.local` and configure your local environment variables.
   ```bash
   cp .env.example .env.local
   ```
   *Required variables typically include `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `GEMINI_API_KEY`.*

4. Set up the Database:
   Execute the provided SQL schemas (`supabase_schema.sql` and `supabase_profile_schema.sql`) in your Supabase project's SQL editor to set up the necessary tables and Row Level Security (RLS) policies.

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## License

This project is open-source and available under the MIT License.
