// Replace 'sanuzthapa' with your actual GitHub username
const GITHUB_USERNAME = 'sanuzthapa';

async function fetchGitHubProjects() {
  const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos`);
  const repos = await response.json();

  const projectContainer = document.getElementById('project-container');

  let delay = 0; // Animation delay for staggered effect

  repos.forEach(repo => {
    // Filter out forked repositories if you want only original projects
    if (!repo.fork) {
      const projectDiv = document.createElement('div');
      projectDiv.className = 'project';
      projectDiv.style.animationDelay = `${delay}s`; // Stagger animation
      projectDiv.innerHTML = `
        <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
        <p>${repo.description || 'No description available.'}</p>
        <p><strong>Language:</strong> ${repo.language || 'N/A'}</p>
        <p><strong>Stars:</strong> ${repo.stargazers_count}</p>
      `;
      projectContainer.appendChild(projectDiv);
      delay += 0.1; // Increase delay for each project
    }
  });
}

// Fetch and display the projects on page load
document.addEventListener('DOMContentLoaded', fetchGitHubProjects);
