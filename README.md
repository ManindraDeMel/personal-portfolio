# Manindra's Portfolio Website

Welcome to my personal portfolio website. Built with React, this portfolio showcases my journey as a developer, some of the projects I've worked on, and ways to contact me. This site is my personal space on the internet where I share about myself and my work.

## Project Overview

The website is divided into various sections:

- **Landing**: Introduction about me.
- **Timeline**: My journey as a developer, captured as a timeline.
- **Projects**: A showcase of my projects, fetched dynamically from my GitHub profile.
- **Testimonials**: Testimonials received from clients and peers.
- **Contact**: Ways to get in touch with me and my social media profiles.

The project uses React hooks for state management, AOS (Animate on Scroll) library for scroll animations, and Masonry layout for arranging the project cards. I also used the GitHub API to dynamically fetch and display my latest projects.

## Deployment

The website is deployed using Firebase, and automatically updated on every push to the master branch, thanks to GitHub Actions.

## Local Setup

To set up the website on your local machine, follow these steps:

1. Clone the repository: `git clone https://github.com/ManindraDeMel/manindra.git`
2. Install the dependencies: `npm install`
3. Start the local server: `npm start`
4. The site will be running on `http://localhost:3000`.

Note: You'll need a `.env` file in the root of your project with your GitHub API token stored in `REACT_APP_GITHUB_TOKEN`.

## Contribute

Feel free to raise an issue or submit a PR if you find any bugs or have some suggestions for improvements.

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

You can reach out to me on LinkedIn or via email. More details are available on the Contact section of the website.
