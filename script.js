async function fetchGitHubProjects() {
  const response = await fetch('https://api.github.com/users/sanuzthapa/repos');
  const repos = await response.json();

  const projectsContainer = document.querySelector('.project-grid');
  repos.forEach(repo => {
    const projectCard = document.createElement('div');
    projectCard.className = 'project';
    projectCard.innerHTML = `
      <h3>${repo.name}</h3>
      <p>${repo.description || 'No description available.'}</p>
      <p><strong>Tech:</strong> ${repo.language || 'N/A'}</p>
      <a href="${repo.html_url}" target="_blank">View on GitHub</a>
    `;
    projectsContainer.appendChild(projectCard);
  });
}

fetchGitHubProjects();
