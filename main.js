document.addEventListener('DOMContentLoaded', function() {
    // Typing animation
    const roles = ['Webdeveloper_', 'Webdesigner_', 'Webanalist_', 'Copywriter_'];
    let currentRoleIndex = 0;
    const roleElement = document.getElementById('role');
    const typingSpeed = 100;

    function typeRole(role, index, callback) {
        if (index < role.length) {
            roleElement.textContent += role.charAt(index);
            setTimeout(function() {
                typeRole(role, index + 1, callback);
            }, typingSpeed);
        } else {
            setTimeout(callback, 2000);
        }
    }

    function deleteRole(callback) {
        const role = roleElement.textContent;
        if (role.length > 0) {
            roleElement.textContent = role.slice(0, -1);
            setTimeout(function() {
                deleteRole(callback);
            }, typingSpeed / 2);
        } else {
            setTimeout(callback, 1000);
        }
    }

    function nextRole() {
        deleteRole(function() {
            currentRoleIndex = (currentRoleIndex + 1) % roles.length;
            typeRole(roles[currentRoleIndex], 0, nextRole);
        });
    }

    typeRole(roles[currentRoleIndex], 0, nextRole);

    // Project slider
    const slider = document.querySelector('.project-slider-container');
    const next = document.getElementById('next');
    const prev = document.getElementById('prev');
    const projects = document.querySelectorAll('.project');
    const gap = parseInt(window.getComputedStyle(document.querySelector('.project-slider')).gap);
    let isScrolling = false;
    let currentIndex = 0;

    function isMobile() {
        return window.innerWidth <= 650;
    }

    function centerProject(index) {
        const project = projects[index];
        const projectWidth = project.offsetWidth;
        const sliderWidth = slider.offsetWidth;
        const scrollPosition = project.offsetLeft - (sliderWidth / 2 - projectWidth / 2);
        slider.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }

    function scrollProject(index) {
        const project = projects[index];
        const scrollPosition = project.offsetLeft;
        slider.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }

    next.addEventListener('click', () => {
        if (!isScrolling) {
            isScrolling = true;
            currentIndex = (currentIndex + 1) % projects.length;
            if (isMobile()) {
                centerProject(currentIndex);
            } else {
                scrollProject(currentIndex);
            }
            setTimeout(() => {
                isScrolling = false;
            }, 500);
        }
    });

    prev.addEventListener('click', () => {
        if (!isScrolling) {
            isScrolling = true;
            currentIndex = (currentIndex - 1 + projects.length) % projects.length;
            if (isMobile()) {
                centerProject(currentIndex);
            } else {
                scrollProject(currentIndex);
            }
            setTimeout(() => {
                isScrolling = false;
            }, 500);
        }
    });

    // Center the first project on page load for mobile
    if (isMobile()) {
        centerProject(currentIndex);
    } else {
        scrollProject(currentIndex);
    }

    // Form submission
    function submitForm(event) {
        event.preventDefault();

        var name = document.getElementById('name').value;
        var subject = document.getElementById('subject').value;
        var message = document.getElementById('message').value;

        var mailtoLink = 'mailto:juliandeligt@hotmail.nl' +
            '?subject=' + encodeURIComponent(subject) +
            '&body=' + encodeURIComponent('Name: ' + name + '\n\nMessage:\n' + message);

        window.location.href = mailtoLink;
    }

    document.getElementById('contact-form').addEventListener('submit', submitForm);
});

// Fetch and display project data
document.addEventListener('DOMContentLoaded', () => {
    async function fetchAndDisplayProjectData() {
        try {
            const response = await fetch('projects.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // Get all elements with IDs starting with 'projectTemplate'
            const containers = document.querySelectorAll('[id^="projectTemplate"]');
            
            containers.forEach(container => {
                const containerId = container.id;
                const projectName = containerId
                    .replace('projectTemplate', '') // Remove the prefix
                    .replace(/([A-Z])/g, ' $1') // Add spaces before capital letters
                    .trim(); // Remove extra spaces

                // Find the project based on the name
                const project = data.portfolio_projects.find(p => p.project_name === projectName);

                if (project) {
                    // Conditionally add project services if not empty
                    const services = [project.project_service_1, project.project_service_2, project.project_service_3]
                        .filter(service => service) // Filter out empty services
                        .map(service => `<p>${service}</p>`).join('');

                    const projectTemplate = `
                        <div class="project-section-1">
                            <div class="row-1">
                                <div class="col-1 col">
                                    <h1>${project.project_name}</h1>
                                </div>
                                <div class="col-2 col" style="background-color: ${project.project_header_color};">
                                    <img src="${project.project_header_img}" class="${project.project_img_class}">
                                </div>
                            </div>
                        </div>

                        <div class="project-section-2">
                            <div class="row-1">
                                <div class="col-1 col">
                                    ${services}
                                </div>
                                <div class="col-2">
                                    <h2>Over het project</h2>
                                    <p>${project.project_about}</p>
                                </div>
                            </div>
                            <div class="row-2">
                                <div class="col-1">
                                    <h3>Jaar</h3>
                                    <p>${project.project_year}</p>
                                </div>
                                <div class="col-2">
                                    <h3>Tools</h3>
                                    <p>${project.project_tool_1} ${project.project_tool_2}</p>
                                </div>
                                <div class="col-3">
                                    <h3>Soort</h3>
                                    <p>${project.project_type}</p>
                                </div>
                                <div class="col-4">
                                    <h3>Launcher</h3>
                                    <p><a href="${project.project_launcher}" target="_blank">${project.launcher_type}</a></p>
                                </div>
                            </div>
                            <div class="project-banner">
                            <div 
                                class="row-1" 
                                style="
                                    background-image: url('${project.project_banner}');
                                    background-size: cover;
                                    background-position: center;
                                    background-repeat: no-repeat;
                                ">
                            </div>
                        </div>

                        </div>
                            <div class="project-banner-2">
                                <div 
                                class="row-1" 
                                style="
                                    background-image: url('${project.project_banner}');
                                    background-size: cover;
                                    background-position: center;
                                    background-repeat: no-repeat;
                                ">
                            </div>
                            </div>

                        <div class="project-section-3">
                            <div class="row-1">
                                <h2>Het proces</h2>
                                <p>${project.project_process_1}</p>
                                <p>${project.project_process_2}</p>
                            </div>
                        </div>

                        <div class="project-section-4">
                            <div class="row-2">
                                <div class="col-1">
                                    <h4>Volgend project:</h4>
                                </div>
                                <div class="col-2">
                                    <a href="${project.project_next_link}" class="button">${project.project_next} ></a>
                                </div>
                            </div>
                        </div>
        </div>`;
                    container.innerHTML = projectTemplate;
                } else {
                    console.error('Project not found:', projectName);
                }
            });
        } catch (error) {
            console.error('Error fetching JSON data:', error);
        }
    }

    fetchAndDisplayProjectData();
});
