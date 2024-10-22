# Birlikte Hareket

## Overview

Welcome to **Birlikte Hareket**! This project aims to keep you informed about strikes or other public demonstrations happening in the country. Through this platform, you can stay updated on upcoming events, join walks, and access detailed information about them. You’ll be able to see who is organizing the event, the time and location of the walk (including start and end points), and a list of participants who have signed up. Additionally, you can create your own walks and invite others to participate.

## Installation

To run this project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/MedusaCollins/birliktehareket.org.git
   ```

2. Navigate to the project directory:

   ```bash
   cd birliktehareket.org
   ```

3. Install dependencies:

   ```bash
   npm i
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`.

## Project Structure

Here's an overview of the project's structure and the purpose of key files and directories:

```
birliktehareket.org/
│
├── public/               # Static files such as images and fonts
│
├── app/
│   ├── components/       # Reusable UI components
│   ├── pages/            # Next.js page components
│   ├── api/              # Server-side API routes for handling requests
│   ├── auth/             # Authentication logic, including login, signup, and session management
│
├── lib/                   # Utility functions and third-party library integrations
│
├── hooks/                 # Custom hooks for managing state, side effects, and other reusable logic
│
└── package.json          # Project dependencies and scripts
```

## Contribution Guideline

We welcome contributions! Here's how you can contribute:

1. Fork the repository.

2. Create a new branch with a descriptive name:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make your changes and commit them:

   ```bash
   git commit -m "Add a detailed description of your changes"
   ```

4. Push to your branch:

   ```bash
   git push origin feature/your-feature-name
   ```

5. Create a pull request on GitHub, explaining the purpose of your changes.

Please make sure to follow our coding standards and provide clear descriptions in your pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
