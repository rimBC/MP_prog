
export const MENU_ITEMS: MenuItem[] = [

      // Common items for all users
      {
        label: 'Home',
        icon: 'icons/home.svg',
        route: '/user/dashboard',
        roles: ['SIMPLE_UTILISATEUR', 'RESPONSABLE', 'ADMINISTRATEUR']
      },
      {
        label: 'Formateurs',
        icon: 'icons/formateurs.svg',
        route: '/user/trainers',
        roles: ['SIMPLE_UTILISATEUR', 'RESPONSABLE', 'ADMINISTRATEUR']
      },
      {
        label: 'Formations',
        icon: 'icons/formation.svg',
        route: '/user/trainings',
        roles: ['SIMPLE_UTILISATEUR', 'RESPONSABLE', 'ADMINISTRATEUR']
      },
      {
        label: 'Participants',
        icon: 'icons/participants.svg',
        route: '/user/participants',
        roles: ['SIMPLE_UTILISATEUR', 'RESPONSABLE', 'ADMINISTRATEUR']
      },
      
 
      // Manager items
      {
        label: 'Statistique',
        icon: 'icons/stats.svg',
        route: '/manager/statistics',
        roles: ['RESPONSABLE', 'ADMINISTRATEUR']
      },
      {
        label: 'Reports',
        icon: 'icons/reports.svg',
        route: '/manager/reports',
        roles: ['RESPONSABLE', 'ADMINISTRATEUR']
      },
 
      // Admin items
      {
        label: 'Utilistateurs',
        icon: 'icons/users.svg',
        route: '/admin/users',
        roles: ['ADMINISTRATEUR']
      },
      
      {
        label: 'Configuration',
        icon: 'icons/settings.svg',
        route: '/admin/settings',
        roles: ['ADMINISTRATEUR']
      },
      {
        label: 'Support',
        icon: 'icons/contact.svg',
        route: '/contact',
        roles: ['SIMPLE_UTILISATEUR', 'RESPONSABLE', 'ADMINISTRATEUR']
      }
    ];