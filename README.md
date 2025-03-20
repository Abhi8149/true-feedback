# Anonymous Feedback Platform

This is a full-stack anonymous feedback platform built using **Next.js** and **Node.js**, with **MongoDB** as the database. The platform allows users to create an account and receive anonymous messages through a shareable link. It includes authentication, email verification using **Resend**, unique username enforcement using debouncing, and **Gemini AI** for message suggestions. The UI is designed with **ShadCN** for a modern and clean experience.

## Why This Platform?

In today's digital world, open and honest communication can be challenging. Many people hesitate to share feedback due to fear of judgment, social pressure, or professional consequences. This platform solves that problem by providing a safe and anonymous way for users to receive genuine feedback from friends, colleagues, or anyone they trust.

Whether it's for personal growth, workplace improvement, or fun social interactions, this platform ensures that messages remain truly anonymous while maintaining security and ease of use.

## Features

### User Panel

- User authentication and account management.
- Unique username enforcement with debouncing.
- Receive anonymous messages via a personal link.
- AI-powered message suggestions using **Gemini**.
- Email verification using **Resend**.

## Tech Stack

- **Frontend:** Next.js, TypeScript, ShadCN UI
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** NextAuth.js
- **Email Verification:** Resend
- **AI Integration:** Gemini

## Installation

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v16+ recommended)
- **MongoDB** (Local or Atlas)

### Steps to Run Locally

1. Clone the repository:

2. Install dependencies:

3. Set up environment variables by creating a `.env` file:

4. Start the development server:

   The app will be available at [http://localhost:3000](http://localhost:3000)

## Deployment

The application is hosted on **Vercel**. You can try the live version here:
[https://true-feedback-e1qa.vercel.app/)

### Test Credentials

To try out the platform, use the following credentials:

- **Email:** newuser03@gmail.com
- **Password:** 12345678

## Development Roadmap

- Enhance AI message suggestions.
- Improve UI and add customization options.
- Introduce message filtering and moderation options.

## Contributing

Feel free to contribute by opening an issue or submitting a pull request.


