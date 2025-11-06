# **Contributing**

**Suriform** is an open-source project, and contributions are welcome! Whether you want to fix bugs, add new features, or improve documentation, your help makes the library better.

## **How to Contribute**

### 1. Fork & Clone

1. Fork the [suriform repository](https://github.com/jimboquijano/suriform).
2. Clone your fork locally:

```bash
git clone https://github.com/jimboquijano/suriform.git
cd suriform

```

### 2. Install Dependencies

Install all project dependencies:

```bash
npm install
```

### 3. Create a Branch

Create a descriptive branch for your changes:

```bash
git checkout -b feature/faster-error-handling
```

### 4. Make Changes

- Update or add code in the `src/` directory.
- Update documentation in the `docs/` folder if needed.
- Write clear commit messages.

### 5. Test Your Changes

suriform provides local testing via VitePress demo site:

```bash
npm run docs:dev
```

Check your changes in the browser and make sure all existing animations work correctly.

### 6. Commit & Push

Commit your changes and push to your fork:

```bash
git add .
git commit -m "Add a faster error handling"
git push origin feature/faster-error-handling
```

### 7. Create a Pull Request

Open a Pull Request (PR) against the main suriform repository. Include:

- A clear description of the change
- Screenshots or demo links if relevant
- Reference any related issues

## **Code Guidelines**

- Follow the existing **folder structure**.
- Use **ES6 modules** (`import`/`export`) consistently.
- Add **JSDoc comments** for all new methods.
- Maintain **cross-browser compatibility** (modern browsers).

## **Reporting Issues**

If you find bugs or unexpected behavior:

1. Check if an issue already exists on the [GitHub Issues page](https://github.com/jimboquijano/suriform/issues).
2. If not, open a new issue with:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots or video if possible

## **Feature Requests**

We welcome feature ideas! To submit a request:

- Provide a **clear description** of the feature.
- Explain the **problem it solves**.
- Suggest how it might integrate with **existing triggers or behaviors**.

## **Code Review Process**

All contributions undergo review to maintain code quality:

- Ensure **tests pass** and animations behave as expected.
- Check **documentation updates** for new features.
- Review **performance considerations** for animations.

## **Thank You**

Your contributions help Suriform grow as a flexible, high-performance animation library for the web. Every improvement—big or small—is appreciated!
