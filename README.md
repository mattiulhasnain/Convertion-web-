# MUHIUM - The Ultimate Online File & Media Conversion Suite

MUHIUM is a modern, responsive web application that provides a suite of free, browser-based file and media conversion tools. All processing happens client-side, ensuring your files never leave your device.

![MUHIUM Screenshot](https://via.placeholder.com/1200x600?text=MUHIUM+Screenshot)

## Features

MUHIUM offers a variety of tools for file and media conversion:

- **PDF Merger**: Combine multiple PDF files into a single document
- **Format Converter**: Convert images between different formats (PNG, JPG, WEBP, etc.)
- **Video Editor**: Trim, rotate, and edit videos
- **Video to Audio**: Extract audio tracks from video files
- **Audio + Video**: Combine audio files with images or videos

## Technology Stack

- **Frontend**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **File Processing**: Client-side JavaScript APIs
- **Deployment**: GitHub Pages

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/muhium.git
   cd muhium
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
MUHIUM/
├── public/
│   └── assets/
├── src/
│   ├── components/
│   │   ├── AnimatedBackground.tsx
│   │   ├── FileUpload.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   └── ToolCard.tsx
│   ├── app/
│   │   ├── page.tsx                 # Homepage
│   │   ├── pdf-merger/
│   │   ├── format-converter/
│   │   ├── video-editor/
│   │   ├── video-to-audio/
│   │   └── audio-video/
│   ├── utils/
│   │   ├── fileProcessor.ts         # File processing functions
│   │   └── helpers.ts               # Utility functions
│   └── styles/
│       └── globals.css              # Global styles
├── package.json
└── README.md
```

## Deployment

### Building for Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

### Deploying to GitHub Pages

1. Update the `next.config.js` file to include your repository name:

```js
const nextConfig = {
  output: 'export',
  basePath: '/muhium',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
```

2. Build and deploy:

```bash
npm run build
# or
yarn build
```

3. Push the generated `out` directory to the `gh-pages` branch:

```bash
git add out/ -f
git commit -m "Deploy to GitHub Pages"
git subtree push --prefix out origin gh-pages
```

## Browser Compatibility

MUHIUM works best in modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Security

All file processing happens directly in your browser. Your files are never uploaded to any server, ensuring complete privacy and security.

## Roadmap

Future enhancements planned for MUHIUM:

- Additional file conversion tools
- Batch processing capabilities
- Advanced editing features
- User accounts for saving conversion history
- Mobile apps

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
