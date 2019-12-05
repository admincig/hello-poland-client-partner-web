import DashboardIcon from '@material-ui/icons/Dashboard';
import DomainIcon from '@material-ui/icons/Domain';
import PeopleIcon from '@material-ui/icons/People';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

export default [
  {
    label: 'Atrakcje i oferty', href: '/', Icon: DashboardIcon,
  },
  {
    label: 'Sprzedaż', href: '/sales', Icon: ShoppingCartIcon,
  },
  {
    label: 'Bileterzy', href: '/ushers', Icon: PeopleIcon,
  },
  {
    label: 'Ustawienia',
  },
  {
    label: 'Dane firmy', href: '/settings/company', Icon: DomainIcon,
  },
];
