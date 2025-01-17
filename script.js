// Replace 'your-username' with your actual GitHub username
const GITHUB_USERNAME = 'sanuzthapa';

async function fetchGitHubProjects() {
  const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos`);
  const repos = await response.json();

  const projectContainer = document.getElementById('project-container');

  repos.forEach(repo => {
    // Filter out forked repositories if you want only original projects
    if (!repo.fork) {
      const projectDiv = document.createElement('div');
      projectDiv.className = 'project';
      projectDiv.innerHTML = `
        <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
        <p>${repo.description || 'No description available.'}</p>
        <p><strong>Language:</strong> ${repo.language || 'N/A'}</p>
        <p><strong>Stars:</strong> ${repo.stargazers_count}</p>
      `;
      projectContainer.appendChild(projectDiv);
    }
  });
}

// Fetch and display the projects on page load
fetchGitHubProjects();
