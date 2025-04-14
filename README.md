# SPL Returns Bot

A modern, user-friendly web application for managing product returns for SPL (Supplier Parts Limited). This chatbot-based interface provides a seamless and enjoyable return process with full transparency.

## Features

- **Modern UI**: Clean, intuitive interface with subtle design elements
- **Chat Interface**: Conversational bot to guide users through the return process
- **Returns Dashboard**: Track and manage all return requests
- **Email Integration**: Receive updates on return status via email
- **Transparent Process**: Clear visibility into return status, reasons, and any applicable fees

## Getting Started

### Prerequisites

- Node.js (v14.0 or higher)
- npm (v6.0 or higher)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/spl-returns-bot.git
cd spl-returns-bot
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## Tech Stack

- **React**: Frontend library for building the user interface
- **TypeScript**: Type-safe JavaScript
- **Material UI**: Component library for consistent, modern UI elements
- **React Router**: Navigation and routing
- **Context API**: State management

## Application Structure

- `src/components`: Reusable UI components
  - `auth`: Authentication components
  - `common`: Common components like Header, Layout
  - `returns`: Return-specific components
  - `dashboard`: Dashboard components
- `src/context`: React Context providers for global state
- `src/pages`: Page components
- `src/services`: API services
- `src/utils`: Utility functions
- `src/theme`: Theme configuration
- `src/types`: TypeScript type definitions
- `src/mock-data`: Mock data for development

## Login Credentials (Demo Only)

For demonstration purposes, you can use the following credentials:

- **Email**: john.doe@example.com
- **Password**: any password will work in the demo

## Deployment

Built files can be generated with:

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory, ready for deployment to any static hosting service.

## Future Enhancements

- Integration with OpenAI or Llama for advanced conversational capabilities
- Real-time tracking of return shipments
- Mobile app version with push notifications
- Dashboard for administrators to manage returns

## License

This project is a demo.

## Contact

For questions or support, please contact mmusakbangash@gmail.com
