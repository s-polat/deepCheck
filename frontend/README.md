# DeepCheck Frontend

AI-powered photo and video verification frontend application built with Angular 19.

## 🚀 Features

- **File Upload**: Drag & drop support with file type and size validation
- **URL Analysis**: Platform-specific URL validation for social media platforms  
- **Real-time Validation**: Instant feedback for file and URL inputs
- **Backend Integration**: HTTP client ready for AI analysis backend
- **Modern UI**: Bootstrap 5 responsive design with loading states

## 🛠 Supported Platforms

- **YouTube**: Video links, Shorts, Embed URLs
- **Instagram**: Posts, Reels, Stories, IGTV
- **TikTok**: Video content
- **Twitter/X**: Tweet links
- **Facebook**: Posts, Photos, Videos
- **Vimeo**: Video content
- **DailyMotion**: Video content
- **Direct Media**: Direct image/video file URLs

## 📁 File Support

### Images (Max 10MB)
- JPEG, JPG, PNG, GIF, WebP

### Videos (Max 30MB)  
- MP4, AVI, MOV, WMV, FLV, WebM

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
