// src/components/Projects/ProjectsData.js

export const projectData = [
  {
    id: 1,
    title: 'Wafina Wedding Planner',
    desc: 'A private full-stack web application tailored for Malaysian Islamic customs, designed to streamline wedding logistics and financial planning through automated calculations and process optimization.[cite: 1]',
    tech: ['Laravel 13', 'Livewire', 'Tailwind CSS', 'Docker'],
    iframeSrc: 'https://wafina-wedding-production.up.railway.app/login', 
    demo: 'https://wafina-wedding-production.up.railway.app/login',
    github: 'https://github.com/sfwnbaek/wafina-wedding'
  },
  {
    id: 2,
    title: 'Subject Progress Indicator (SPIN)',
    desc: 'An award-winning data-driven academic analytics platform built for Kolej Tingkatan 6 Tawau. It features role-based dashboards, automated GPMP computations, and early intervention flagging.[cite: 1]',
    tech: ['PHP', 'SQL', 'JavaScript', 'HTML/CSS'],
    iframeSrc: 'https://spinkt6t.nexusmandiri.com', 
    demo: 'https://spinkt6t.nexusmandiri.com',
    github: 'https://github.com/sfwnbaek/SPIN-System-KT6T'
  },
  {
    id: 3,
    title: 'Crew Scheduling System',
    desc: 'A full-stack prototype with RESTful APIs built for Batik Air Malaysia to replace manual workflows. Features standby/duty tracking and fatigue analysis across Boeing 737 and Airbus 330 fleets.[cite: 1]',
    tech: ['React', 'Node.js', 'Express', 'MySQL'],
    // Since this doesn't have a live link, we will use a sleek placeholder iframe, 
    // or you can switch this back to an 'image' property later!
    iframeSrc: 'https://example.com', 
    demo: '#',
    github: '#'
  }
];