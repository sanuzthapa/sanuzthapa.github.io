<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portfolio</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      line-height: 1.6;
    }

    header {
      background: #333;
      color: #fff;
      padding: 1rem 0;
      text-align: center;
    }

    header h1 {
      margin: 0;
      font-size: 2.5rem;
    }

    nav {
      display: flex;
      justify-content: center;
      background: #444;
      padding: 0.5rem 0;
    }

    nav a {
      color: #fff;
      text-decoration: none;
      margin: 0 15px;
      font-weight: bold;
    }

    nav a:hover {
      color: #f0a500;
    }

    .container {
      width: 90%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 0;
    }

    section {
      margin-bottom: 2rem;
    }

    .about, .projects, .skills {
      background: #f4f4f4;
      padding: 1.5rem;
      border-radius: 10px;
    }

    .projects .project {
      margin-bottom: 1rem;
    }

    .skills ul {
      list-style-type: none;
      padding: 0;
    }

    .skills li {
      display: inline-block;
      margin: 0.5rem;
      background: #ddd;
      padding: 0.5rem 1rem;
      border-radius: 5px;
    }

    .contact form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .contact input, .contact textarea {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 5px;
    }

    .contact button {
      background: #333;
      color: #fff;
      border: none;
      padding: 0.7rem;
      cursor: pointer;
      font-size: 1rem;
      border-radius: 5px;
    }

    .contact button:hover {
      background: #f0a500;
    }

    footer {
      background: #333;
      color: #fff;
      text-align: center;
      padding: 1rem 0;
    }

    @media (max-width: 768px) {
      nav {
        flex-direction: column;
      }

      nav a {
        margin: 10px 0;
      }
    }
  </style>
</head>
<body>
  <header>
    <h1>My Portfolio</h1>
    <p>Welcome to my personal portfolio website!</p>
  </header>

  <nav>
    <a href="#about">About</a>
    <a href="#projects">Projects</a>
    <a href="#skills">Skills</a>
    <a href="#contact">Contact</a>
  </nav>

  <div class="container">
    <!-- About Section -->
    <section id="about" class="about">
      <h2>About Me</h2>
      <p>Hello! I'm [Your Name], a passionate [Your Profession] with experience in [Your Specialization]. I love creating, innovating, and solving problems.</p>
    </section>

    <!-- Projects Section -->
    <section id="projects" class="projects">
      <h2>Projects</h2>
      <div class="project">
        <h3>Project 1</h3>
        <p>Description of the project and its key features.</p>
      </div>
      <div class="project">
        <h3>Project 2</h3>
        <p>Description of the project and its key features.</p>
      </div>
    </section>

    <!-- Skills Section -->
    <section id="skills" class="skills">
      <h2>Skills</h2>
      <ul>
        <li>Skill 1</li>
        <li>Skill 2</li>
        <li>Skill 3</li>
        <li>Skill 4</li>
      </ul>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact">
      <h2>Contact Me</h2>
      <form>
        <input type="text" placeholder="Your Name" required>
        <input type="email" placeholder="Your Email" required>
        <textarea placeholder="Your Message" rows="5" required></textarea>
        <button type="submit">Send Message</button>
      </form>
    </section>
  </div>

  <footer>
    <p>&copy; 2025 [Your Name]. All Rights Reserved.</p>
  </footer>
</body>
</html>
