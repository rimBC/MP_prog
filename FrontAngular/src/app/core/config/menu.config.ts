
export const MENU_ITEMS: MenuItem[] = [

      // Common items for all users
      {
        label: 'Home',
        icon: 'icons/users.svg',
        route: '/user/dashboard',
        roles: ['SIMPLE_UTILISATEUR', 'RESPONSABLE', 'ADMINISTRATEUR']
      },
      {
        label: 'Formateurs',
        icon: 'users.svg',
        route: '/user/trainers',
        roles: ['SIMPLE_UTILISATEUR', 'RESPONSABLE', 'ADMINISTRATEUR']
      },
      {
        label: 'Formations',
        icon: 'users.svg',
        route: '/user/trainings',
        roles: ['SIMPLE_UTILISATEUR', 'RESPONSABLE', 'ADMINISTRATEUR']
      },
      {
        label: 'Participants',
        icon: 'users.svg',
        route: '/user/participants',
        roles: ['SIMPLE_UTILISATEUR', 'RESPONSABLE', 'ADMINISTRATEUR']
      },
      
 
      // Manager items
      {
        label: 'Statistique',
        icon: 'users.svg',
        route: '/manager/statistics',
        roles: ['RESPONSABLE', 'ADMINISTRATEUR']
      },
      {
        label: 'Reports',
        icon: 'users.svg',
        route: '/manager/reports',
        roles: ['RESPONSABLE', 'ADMINISTRATEUR']
      },
 
      // Admin items
      {
        label: 'Utilistateurs',
        icon: 'users.svg',
        route: '/admin/users',
        roles: ['ADMINISTRATEUR']
      },
      
      {
        label: 'Configuration',
        icon: 'users.svg',
        route: '/admin/settings',
        roles: ['ADMINISTRATEUR']
      },
      {
        label: 'Support',
        icon: 'users.svg',
        route: '/contact',
        roles: ['SIMPLE_UTILISATEUR', 'RESPONSABLE', 'ADMINISTRATEUR']
      }
    ];