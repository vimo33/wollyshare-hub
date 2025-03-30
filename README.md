
# WollyShare Hub - Community Item Sharing Platform

## Project Overview

WollyShare Hub is a community-based platform that enables members to share items with each other. It facilitates borrowing, lending, and managing personal belongings within a trusted community environment.

**URL**: https://lovable.dev/projects/a4556c51-d6bf-4240-8429-0bf5fdc435c2

**Public GitHub Repository**: https://github.com/vimo33/wollyshare-hub

## Core Features

- **User Authentication**: Secure login system with member validation
- **Item Management**: Post, edit, and delete personal items available for borrowing
- **Borrowing System**: Request to borrow items with approval workflow
- **Telegram Notifications**: Real-time alerts for borrow requests via Telegram
- **Profile Management**: User profiles with customizable settings including Telegram connectivity
- **Admin Dashboard**: Community management and settings for administrators

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **UI Framework**: Tailwind CSS, shadcn/ui components
- **State Management**: React Query for server state, React Context for application state
- **Backend**: Supabase (Authentication, Database, Storage, Edge Functions)
- **External Integrations**: Telegram Bot API for notifications

## Project Structure

### Core Components

- **Authentication**: Complete authentication flow with signup, login, and profile management
- **Item Listing**: Grid-based UI for browsing available items with filtering options
- **My Items Section**: Personal dashboard for managing owned items and borrow requests
- **Borrow Request System**: Request, approve, and track item borrowing
- **Admin Area**: Community management tools for administrators

### Key Files & Directories

- **`src/components/`**: UI components organized by feature
- **`src/contexts/`**: React context providers (Auth, etc.)
- **`src/hooks/`**: Custom React hooks for reusable logic
- **`src/pages/`**: Top-level page components
- **`src/services/`**: API services for backend communication
- **`src/types/`**: TypeScript type definitions
- **`supabase/functions/`**: Supabase Edge Functions

## Data Model

### Main Database Tables

- **profiles**: User profile information
- **items**: Shareable items with details
- **borrow_requests**: Tracks borrowing requests and status
- **community_locations**: Community location information
- **admin_profiles**: Admin user information
- **invitations**: User invitations for community membership

### Key Relationships

- Users can own multiple items
- Users can make/receive multiple borrow requests
- Items can have multiple borrow requests
- Admins manage community settings and members

## Telegram Integration

WollyShare Hub integrates with Telegram for real-time notifications. When a user requests to borrow an item:

1. Notification is sent to both the requester and item owner
2. Users are connected via their Telegram IDs stored in profiles
3. The system uses a Supabase Edge Function to communicate with Telegram's API

### Setup Requirements

1. Users must chat with the @WollyShareBot Telegram bot
2. Users need to add their Telegram chat ID to their profile
3. The system requires a valid Telegram Bot Token in Supabase environment variables

## Development Workflow

### Running Locally

```sh
# Install dependencies
npm i

# Start development server
npm run dev
```

### Deployment

The application is deployed through Lovable's publishing feature. To deploy:

1. Open the project in Lovable
2. Click Share -> Publish

### Environment Variables

- **TELEGRAM_BOT_TOKEN**: Required for Telegram notifications
- **Supabase connection details**: Automatically managed by Lovable

## Troubleshooting

### Common Issues

- **Missing Telegram notifications**: Verify Telegram chat ID in profile and check Edge Function logs
- **Borrow request failures**: Check RLS policies and browser console for errors
- **Authentication issues**: Ensure users have verified email and proper permissions

### Debugging Tools

- Browser console logs for client-side errors
- Supabase Dashboard for database inspection and Edge Function logs
- Telegram Bot API documentation for notification issues

## Feature Enhancement Guide

When adding new features:

1. Consider the existing data model and extend it as needed
2. Follow the established component pattern for UI consistency
3. Add proper RLS policies for new database tables
4. Document any new environment variables or configuration requirements
5. Update relevant TypeScript types in `src/types/`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request with detailed description

## License

This project is for educational purposes. All rights reserved.
