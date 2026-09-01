/*──────────────────────────────────────────────
  PROJECT DATA — single source of truth
  Used by index.html (top 3 featured) and
  projects.html (full searchable/paginated list).
──────────────────────────────────────────────*/

const GITHUB_ICON_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>';

const PROJECTS = [
  {
    id: 'advani-family-office-dashboard',
    category: 'Full-Stack',
    name: 'Advani Family Office Dashboard',
    desc: 'Internal back-office dashboard for a family office running $2B+ in private equity and $1B+ in crypto across 200+ positions — surfacing holdings, valuations, capital movements, LP obligations, and compliance status in one screen. NestJS + Prisma API on Supabase Postgres, Next.js App Router frontend with ShadCN UI, both deployed serverless on Vercel.',
    techs: ['TypeScript', 'Next.js', 'NestJS', 'Prisma', 'PostgreSQL', 'TailwindCSS'],
    tag: { label: 'Featured ⭐', cls: 'tag-featured' },
    thumbnail: 'thumb-advani.svg',
    github: 'https://github.com/nandani2203/advani-family-office-dashboard',
    featured: true,
  },
  {
    id: 'oauth-integrations-platform',
    category: 'Full-Stack',
    name: 'OAuth Integrations Platform',
    desc: 'Multi-platform OAuth 2.0 integration system for Notion, HubSpot, and Airtable — built the full authorize/callback/token-exchange flow with parallel data fetching via asyncio.gather and httpx, cutting API latency 3x. Refactored three duplicate React components into one generic OAuthIntegration component, migrated CRA to Vite, replaced 200ms polling with event-driven postMessage for popup detection, and wrote 31 pytest unit tests that caught a real bug in a provider\'s contact-name fallback logic.',
    techs: ['Python', 'FastAPI', 'httpx', 'AsyncIO', 'React', 'Material UI', 'Redis', 'OAuth 2.0'],
    tag: { label: 'Full-Stack', cls: 'tag-fullstack' },
    thumbnail: 'thumb-oauth.svg',
    github: 'https://github.com/nandani2203/Oauth_Integrations_Platform',
    featured: true,
  },
  {
    id: 'fintech-fraud-risk-engine',
    category: 'Backend',
    name: 'Fintech Fraud Risk Engine',
    desc: 'Real-time fraud detection platform integrating a Logistic Regression model (ROC-AUC 0.98), KYC profiling, behavioral velocity analytics, and SHAP explainability. Architected as modular FastAPI microservices with event-driven ingestion via Redis Streams, SQLAlchemy-based persistence, and Dockerized deployment. Built StandardScaler-based feature preprocessing and probabilistic inference pipelines in Pandas and Scikit-learn, with systematic regression tests validating model output correctness across edge cases before deployment.',
    techs: ['Python', 'FastAPI', 'Scikit-learn', 'Redis Streams', 'SQLAlchemy', 'Docker', 'SHAP'],
    tag: { label: 'Backend', cls: 'tag-fullstack' },
    thumbnail: 'thumb-fintech.svg',
    github: 'https://github.com/nandani2203/fintech-fraud-risk-engine',
    featured: true,
  },
  {
    id: 'fashion-attribute-classifier',
    category: 'ML',
    name: 'Fashion Attribute Classifier',
    desc: 'End-to-end ML pipeline that scrapes fashion product images, trains an EfficientNet-B0 classifier to predict gender and sleeve type, and serves predictions through a Streamlit UI with full prediction history tracked in SQLite.',
    techs: ['Python', 'PyTorch', 'EfficientNet', 'Streamlit', 'SQLite'],
    tag: { label: 'ML', cls: 'tag-ml' },
    thumbnail: 'thumb-fashion.svg',
    github: 'https://github.com/nandani2203/fashion_scraper_classifier',
    featured: false,
  },
  {
    id: 'high-scale-url-shortener',
    category: 'Backend',
    name: 'High-Scale URL Shortener',
    desc: 'High-throughput URL shortening service in Golang using the Gin framework, with Redis-based caching for low-latency redirection and a Bloom Filter for O(1) alias existence checks, eliminating cache penetration and sustaining consistent performance under high concurrent traffic. Designed a scalable PostgreSQL persistence layer with optimized indexing for link metadata storage.',
    techs: ['Golang', 'Gin', 'Redis', 'PostgreSQL', 'Bloom Filter'],
    tag: { label: 'Backend', cls: 'tag-fullstack' },
    thumbnail: 'thumb-urlshort.svg',
    github: 'https://github.com/nandani2203/url_shortener',
    featured: false,
  },
  {
    id: 'multithreaded-producer-consumer-system',
    category: 'Systems',
    name: 'Multithreaded Producer-Consumer System',
    desc: 'Thread-safe producer-consumer system in Java using a fair ReentrantLock with notFull/notEmpty condition variables for bounded queue synchronization, graceful shutdown, deadlock detection, live metrics (enqueue/dequeue counts, peak size, average wait time), and a SIGTERM shutdown hook with configurable timeout. Decomposed into clean, reusable modules with a custom unchecked exception hierarchy, comprehensive JUnit 5 test coverage, and built with Maven.',
    techs: ['Java', 'Maven', 'ReentrantLock', 'Multithreading', 'JUnit 5', 'Design Patterns'],
    tag: { label: 'Systems', cls: 'tag-fullstack' },
    thumbnail: 'thumb-producer.svg',
    github: 'https://github.com/nandani2203/Multithreaded-Producer-Consumer-System',
    featured: false,
  },
  {
    id: 'multiple-elevator-system',
    category: 'Systems',
    name: 'Multiple Elevator System',
    desc: 'Multi-elevator control system in C++ using OOP principles and a score-based scheduling algorithm to efficiently coordinate concurrent floor requests. Validated with a dedicated unit test suite covering all state-transition and scheduling edge cases.',
    techs: ['C++', 'OOP', 'Scheduling Algorithms', 'Unit Testing', 'Git'],
    tag: { label: 'Systems', cls: 'tag-ml' },
    thumbnail: 'thumb-elevator.svg',
    github: 'https://github.com/nandani2203/Multiple-Elevator-System',
    featured: false,
  },
  {
    id: 'bolna-slack-integration',
    category: 'Backend',
    name: 'Bolna Slack Integration',
    desc: 'Webhook integration that automatically sends Slack alerts whenever a Bolna AI voice call ends, with multi-agent routing, channel-based alerts, and support for scaling to many concurrent agents.',
    techs: ['Python', 'Webhooks', 'Slack API', 'Multi-Agent Routing'],
    tag: { label: 'Backend', cls: 'tag-fullstack' },
    thumbnail: 'thumb-bolna-slack.svg',
    github: 'https://github.com/nandani2203/Bolna_Slack_Integration',
    featured: false,
  },
  {
    id: 'chatroom',
    category: 'Full-Stack',
    name: 'Real-Time Chat Application',
    desc: 'Full-stack real-time messaging application with a Node.js/Express.js backend and a React.js frontend. Room-based WebSocket connections via Socket.io power bi-directional communication, with REST API endpoints for session management and authentication, and concurrent session handling across multiple active rooms with low-latency delivery and disconnection logic.',
    techs: ['React.js', 'Node.js', 'Express.js', 'Socket.io', 'WebSockets', 'REST APIs'],
    tag: { label: 'Full-Stack', cls: 'tag-fullstack' },
    thumbnail: 'thumb-chatroom.svg',
    github: 'https://github.com/nandani2203/ChatRoom',
    featured: false,
  },
  {
    id: 'sales-analytics-system',
    category: 'Backend',
    name: 'Sales Analytics System',
    desc: 'Java application for analyzing sales data using structured data processing techniques, surfacing revenue patterns, top-performing products, and sales trends through efficient data handling and reporting.',
    techs: ['Java', 'Data Processing', 'Reporting'],
    tag: { label: 'Backend', cls: 'tag-fullstack' },
    thumbnail: 'thumb-sales.svg',
    github: 'https://github.com/nandani2203/Sales-Analytics-System',
    featured: false,
  },
  {
    id: 'crude-oil-process-analytics',
    category: 'ML',
    name: 'Crude Oil Process Analytics',
    desc: 'Data science and process analytics project analyzing crude oil refining operations using machine learning, PCA-based fault detection, and hydrocracking kinetics modeling.',
    techs: ['Python', 'Machine Learning', 'PCA', 'Process Analytics'],
    tag: { label: 'ML', cls: 'tag-ml' },
    thumbnail: 'thumb-crudeoil.svg',
    github: 'https://github.com/nandani2203/crude-oil-process-analytics',
    featured: false,
  },
  {
    id: 'mini-git-cpp',
    category: 'Systems',
    name: 'Mini-Git (C++)',
    desc: 'C++17 version control system built with a singly linked list architecture to manage immutable project snapshots. Features a recursive file-shadowing engine, binary-level diffing for byte-accurate change detection, and persistent metadata tracking, supporting O(1) HEAD updates, history traversal, and full-state historical reverts.',
    techs: ['C++17', 'Data Structures', 'Version Control', 'Binary Diffing'],
    tag: { label: 'Systems', cls: 'tag-fullstack' },
    thumbnail: 'thumb-minigit.svg',
    github: 'https://github.com/nandani2203/Mini-Git_CPP',
    featured: false,
  },
  {
    id: 'movie-recommender-system',
    category: 'ML',
    name: 'Movie Recommender System',
    desc: 'Content-based movie recommender system that suggests similar titles by analyzing movie metadata and computing similarity scores between films.',
    techs: ['Python', 'Machine Learning', 'Recommender Systems'],
    tag: { label: 'ML', cls: 'tag-ml' },
    thumbnail: 'thumb-movierec.svg',
    github: 'https://github.com/nandani2203/Movie-Recommender-System',
    featured: false,
  },
  {
    id: 'bubble-shooter',
    category: 'Fun',
    name: 'Bubble Shooter',
    desc: 'Bubble Shooter arcade game built in Python with Pygame, featuring shooting mechanics, collision detection, and classic match-and-pop gameplay.',
    techs: ['Python', 'Pygame', 'Game Development'],
    tag: { label: 'Fun', cls: 'tag-ml' },
    thumbnail: 'thumb-bubbleshooter.svg',
    github: 'https://github.com/nandani2203/Bubble-Shooter',
    featured: false,
  },
  {
    id: 'kanban-board',
    category: 'Full-Stack',
    name: 'Kanban Board',
    desc: 'Fully responsive React.js single-page application consuming a live REST API, with dynamic ticket grouping via React hooks for state management, persistent user preferences, and responsive layouts across devices — structured with a reusable component architecture and deployed to production on Vercel.',
    techs: ['React.js', 'JavaScript', 'REST APIs', 'CSS3'],
    tag: { label: 'Full-Stack', cls: 'tag-fullstack' },
    thumbnail: 'thumb-kanban.svg',
    github: 'https://github.com/nandani2203/Kanban-Board',
    featured: false,
  },
];

function renderProjectCard(p, delaySeconds) {
  const delayAttr = delaySeconds ? ` style="transition-delay:${delaySeconds}s"` : '';
  const featuredClass = p.featured ? ' featured' : '';
  return `
    <div class="project-card${featuredClass} reveal"${delayAttr}>
      <div class="project-thumbnail">
        <img class="project-thumbnail-img" src="${p.thumbnail}" alt="${p.name} illustration" loading="lazy"/>
        <span class="project-tag ${p.tag.cls}">${p.tag.label}</span>
      </div>
      <div class="project-body">
        <h3 class="project-name">${p.name}</h3>
        <p class="project-desc">${p.desc}</p>
        <div class="project-techs">
          ${p.techs.map(t => `<span class="project-tech-chip">${t}</span>`).join('')}
        </div>
        <div class="project-actions">
          <a href="${p.github}" target="_blank" rel="noopener" class="btn-sm btn-sm-primary">
            ${GITHUB_ICON_SVG}
            GitHub
          </a>
        </div>
      </div>
    </div>`;
}
