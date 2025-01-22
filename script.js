// Initialize Feather icons
document.addEventListener('DOMContentLoaded', () => {
    feather.replace();
    fetchGitHubProjects();
});

// Fetch GitHub projects
async function fetchGitHubProjects() {
    try {
        const response = await fetch('https://api.github.com/users/sanuzthapa/repos');
        const repos = await response.json();
        displayProjects(repos);
    } catch (error) {
        console.error('Error fetching repos:', error);
        document.getElementById('projects-grid').innerHTML = '<p>Error loading projects. Please try again later.</p>';
    }
}

// Display projects in the grid
function displayProjects(repos) {
    const projectsGrid = document.getElementById('projects-grid');
    const projectsHTML = repos.map(repo => `
        <div class="project-card">
            <h3>${repo.name}</h3>
            <p>${repo.description || 'No description available'}</p>
            <div class="project-footer">
                <span class="project-language">${repo.language || 'N/A'}</span>
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link">
                    <i data-feather="github" class="icon"></i>
                    View Code
                </a>
            </div>
        </div>
    `).join('');
    
    projectsGrid.innerHTML = projectsHTML;
    
    // Re-initialize Feather icons for the newly added content
    feather.replace();
}