import DashboardIcon from '@material-ui/icons/Dashboard';
import DomainIcon from '@material-ui/icons/Domain';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import PeopleIcon from '@material-ui/icons/People';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

export default [
  {
    label: 'Obiekty i oferty', href: '/', Icon: DashboardIcon,
  },
  {
    label: 'Wizytówka firmy', href: '/company-card', Icon: DomainIcon,
  },
  {
    label: 'Definicje produktów', href: '/tickets', Icon: LocalOfferIcon,
  },
  {
    label: 'Sprzedaż/Raporty', href: '/sales', Icon: ShoppingCartIcon,
  },
  {
    label: 'Pracownicy', href: '/ushers', Icon: PeopleIcon,
  },
];
