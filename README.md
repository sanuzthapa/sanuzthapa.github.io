/* General Reset */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  line-height: 1.6;
  background-color: #f9f9f9;
  color: #333;
}

.dark-theme {
  background-color: #1e1e1e;
  color: #f9f9f9;
}

h1, h2, h3 {
  margin: 0;
}

a {
  color: #0073e6;
  text-decoration: none;
}

/* Theme Switcher */
.theme-switcher {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background: #444;
  color: #fff;
}

/* Profile Header */
.profile-header {
  text-align: center;
  padding: 2rem 1rem;
  background: #f4f4f4;
}

.profile-card {
  max-width: 500px;
  margin: 0 auto;
  background: white;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.profile-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 1rem;
}

.download-resume {
  background: #333;
  color: white;
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.download-resume:hover {
  background: #f0a500;
}

/* Sections */
main {
  width: 90%;
  max-width: 1200px;
  margin: 2rem auto;
}

.about, .projects, .contact {
  margin-bottom: 2rem;
}

.projects .project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.project {
  background: #fff;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* Contact */
.contact ul {
  list-style-type: none;
  padding: 0;
}

.contact li {
  margin-bottom: 1rem;
}

/* Footer */
footer {
  text-align: center;
  padding: 1rem;
  background: #444;
  color: #fff;
}
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portfolio Website</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="theme-switcher">
    <p>Theme</p>
    <button id="change-theme">Change Theme</button>
  </div>

  <header class="profile-header">
    <div class="profile-card">
      <img src="https://via.placeholder.com/150" alt="Profile Picture" class="profile-img">
      <h1>Ariful Alam</h1>
      <p>⚡ Senior Software Engineer | Open Source Enthusiast ⚡</p>
      <p>PHP | Node.js | React</p>
      <button class="download-resume">Download Resume</button>
    </div>
  </header>

  <main>
    <section class="about">
      <h2>About Me</h2>
      <p>Hi! I'm Ariful Alam, a senior software engineer and an avid open-source contributor. I specialize in building robust web applications and engaging user interfaces. When I'm not coding, you’ll find me exploring open-source tools and contributing to the community.</p>
      <p><strong>Based in:</strong> Bangladesh</p>
    </section>

    <section class="projects">
      <h2>GitHub Projects</h2>
      <div class="project-grid">
        <div class="project">
          <h3>gitprofile</h3>
          <p>Create and deploy a dynamic portfolio by just providing your GitHub username.</p>
          <p><strong>Tech:</strong> TypeScript</p>
        </div>
        <div class="project">
          <h3>ezfolio</h3>
          <p>Open Source Portfolio/Resume CMS built using Laravel, React, and Ant Design.</p>
          <p><strong>Tech:</strong> PHP</p>
        </div>
        <div class="project">
          <h3>reactive-button</h3>
          <p>3D animated React button component with a progress bar.</p>
          <p><strong>Tech:</strong> JavaScript</p>
        </div>
        <!-- Add more project cards as needed -->
      </div>
    </section>

    <section class="contact">
      <h2>Contact Me</h2>
      <ul>
        <li><strong>GitHub:</strong> <a href="https://github.com/arifszn" target="_blank">arifszn</a></li>
        <li><strong>Twitter:</strong> <a href="https://twitter.com/arif_szn" target="_blank">@arif_szn</a></li>
        <li><strong>LinkedIn:</strong> <a href="https://linkedin.com/in/ariful-alam" target="_blank">ariful-alam</a></li>
      </ul>
    </section>
  </main>

  <footer>
    <p>&copy; 2025 Ariful Alam. All rights reserved.</p>
  </footer>

  <script>
    const changeThemeButton = document.getElementById('change-theme');
    changeThemeButton.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
    });
  </script>
</body>
</html>
