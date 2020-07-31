import Dashboard from 'views/Dashboard';
import Users from 'views/users/Users';
import Calendars from 'views/calendar/Calendars';
import Calendar from 'views/calendar/Calendar';
import Images from 'views/images/Images';
import Image from 'views/images/Image';
import Amenities from 'views/amenities/Amenities';
import Amenity from 'views/amenities/Amenity';
import Logs from 'views/logs/Logs';

const dashboardRoutes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: 'pe-7s-graph',
    component: Dashboard,
    layout: '/admin'
  },
  {
    path: '/users',
    name: 'Manage Users',
    icon: 'pe-7s-user',
    component: Users,
    layout: '/admin'
  },
  {
    path: '/calendars',
    name: 'Manage Calendars',
    icon: 'pe-7s-note2',
    component: Calendars,
    layout: '/admin'
  },
  {
    path: '/calendar/:id',
    name: 'Calendar',
    icon: 'pe-7s-monitor',
    component: Calendar,
    layout: '/admin',
    hidden: true
  },
  {
    path: '/images',
    name: 'Manage Images',
    icon: 'pe-7s-camera',
    component: Images,
    layout: '/admin'
  },
  {
    path: '/image/:id',
    name: 'Image',
    icon: 'pe-7s-monitor',
    component: Image,
    layout: '/admin',
    hidden: true
  },
  {
    path: '/amenities',
    name: 'Manage Amenities',
    icon: 'pe-7s-monitor',
    component: Amenities,
    layout: '/admin'
  },
  {
    path: '/amenity/:id',
    name: 'Amenity',
    icon: 'pe-7s-monitor',
    component: Amenity,
    layout: '/admin',
    hidden: true
  },
  {
    path: '/logs',
    name: 'View Logs',
    icon: 'pe-7s-news-paper',
    component: Logs,
    layout: '/admin'
  }
];

export default dashboardRoutes;
