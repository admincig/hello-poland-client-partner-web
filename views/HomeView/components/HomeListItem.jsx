import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Fade from '@material-ui/core/Fade';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import DesktopWindows from '@material-ui/icons/DesktopWindows';
import AddIcon from '@material-ui/icons/Add';
import AssessmentIcon from '@material-ui/icons/Assessment';
import CreateIcon from '@material-ui/icons/Create';
import InfoIcon from '@material-ui/icons/Info';
import DeleteIcon from '@material-ui/icons/Delete';
import LinkIcon from '@material-ui/icons/Link';
import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';
import RemoveShoppingCart from '@material-ui/icons/RemoveShoppingCart';
import VisibilityIcon from '@material-ui/icons/Visibility';
import config from 'config';

const styles = theme => ({
  dialogActions: {
    paddingBottom: theme.spacing.unit,
  },
  link: {
    backgroundColor: theme.palette.grey[100],
    display: 'block',
  },
  paper: {
    maxWidth: 350,
  },
});

const { baseAffiliationURL } = config.public || {};

const getAffiliationURL = (slug, affiliationCode) => `${baseAffiliationURL}/${slug}?a=${affiliationCode}`;

const getAffiliationLink = (slug, affiliationCode) => `
  <a href="${getAffiliationURL(slug, affiliationCode)}"
   style="color: #fff; background-color: #f92c4f; padding: 8px 16px; min-width: 64px;
    box-sizing: border-box; line-height: 1.75; font-family: 'Roboto', 'Helvetica', 'Arial',
    sans-serif; font-weight: 500; border-radius: 4px; letter-spacing: 0.02857em;
    text-transform: uppercase; text-decoration: none; margin: 0"
   rel="nofollow"
  >
    Kup produkt
  </a>
`;

class HomeListItem extends Component {
  state = {
    affiliationAnchorEl: null,
    affiliationOpen: false,
  };

  handleAffiliationClick = (event) => {
    const { currentTarget } = event;

    this.setState(state => ({
      affiliationAnchorEl: currentTarget,
      affiliationOpen: !state.affiliationOpen,
    }));
  };

  handleAffiliationClose = () => this.setState(state => ({
    affiliationOpen: !state.affiliationOpen,
  }));

  render() {
    const { affiliationAnchorEl, affiliationOpen } = this.state;
    const {
      affiliation, blocked, classes, icon: Icon, primary, secondary, onAddClick, onAddLabel,
      onDeleteClick, onDeleteLabel, onEditClick, onPreviewClick, onPreviewLabel, onEditLabel,
      onStatsClick, onStopSellClick, onStopSellLabel, onViewClick, onViewLabel, published,
    } = this.props;

    const id = affiliationOpen ? 'simple-popper' : null;

    return (
      <ListItem>
        <ListItemIcon>
          <Icon />
        </ListItemIcon>
        <ListItemText
          primary={<Typography noWrap style={{ width: '60%' }} variant="subtitle1">{primary}</Typography>}
          secondary={<Typography noWrap style={{ width: '60%' }}>{secondary}</Typography>}
        />
        <ListItemSecondaryAction>
          {blocked
          && (
          <IconButton
            aria-label={onViewLabel}
            style={{ cursor: 'default' }}
            title="Zablokowane"
          >
            <NotificationImportantIcon color="error" />
          </IconButton>
          )
          }
          {published
          && (
          <IconButton
            aria-label={onViewLabel}
            style={{ cursor: 'default' }}
            title="Opublikowane"
          >
            <VisibilityIcon color="primary" />
          </IconButton>
          )
          }
          {onViewClick
          && (
          <IconButton
            aria-label={onViewLabel}
            title={onViewLabel}
          >
            <DesktopWindows />
          </IconButton>
          )
          }
          {affiliation
            && (
            <Fragment>
              <IconButton
                aria-label="Pokaż link afiliacyjny"
                onClick={this.handleAffiliationClick}
                title="Pokaż link afiliacyjny"
              >
                <LinkIcon />
              </IconButton>
              <Popper id={id} open={affiliationOpen} anchorEl={affiliationAnchorEl} transition>
                {({ TransitionProps }) => (
                  <Fade {...TransitionProps} timeout={350}>
                    <Paper className={classes.paper}>
                      <DialogContent>
                        <DialogContentText>
                          Link afiliacyjny:
                        </DialogContentText>
                        <Typography paragraph className={classes.link}>
                          {getAffiliationURL(affiliation.slug, affiliation.code)}
                        </Typography>
                        <DialogContentText>
                          Kod na stronę:
                        </DialogContentText>
                        <TextField
                          fullWidth
                          margin="none"
                          value={getAffiliationLink(affiliation.slug, affiliation.code)}
                        />
                      </DialogContent>
                      <DialogActions className={classes.dialogActions}>
                        <Button onClick={this.handleAffiliationClose} color="primary">
                          Zamknij
                        </Button>
                      </DialogActions>
                    </Paper>
                  </Fade>
                )}
              </Popper>
            </Fragment>
            )
          }
          {onStatsClick
            && (
              <IconButton
                aria-label="Pokaż dostępność produktów"
                component="a"
                href={onStatsClick()}
                target="_blank"
                title="Pokaż dostępność produktów"
              >
                <AssessmentIcon />
              </IconButton>
            )
          }
          {onAddClick
          && (
          <IconButton
            aria-label={onAddLabel}
            onClick={onAddClick}
            title={onAddLabel}
          >
            <AddIcon />
          </IconButton>
          )
          }
          {onEditClick
          && (
          <IconButton
            aria-label={onEditLabel}
            onClick={onEditClick}
            title={onEditLabel}
          >
            <CreateIcon />
          </IconButton>
          )
          }
          {onPreviewClick
          && (
          <IconButton
            aria-label={onPreviewLabel}
            onClick={onPreviewClick}
            title={onPreviewLabel}
          >
            <InfoIcon />
          </IconButton>
          )
          }

          {onStopSellClick
          && (
          <IconButton
            aria-label={onPreviewLabel}
            onClick={onStopSellClick}
            title={onStopSellLabel}
          >
            <RemoveShoppingCart />
          </IconButton>
          )
          }
          {onDeleteClick
          && (
          <IconButton
            aria-label={onDeleteLabel}
            onClick={onDeleteClick}
            title={onDeleteLabel}
          >
            <DeleteIcon />
          </IconButton>
          )
          }
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}

HomeListItem.propTypes = {
  affiliation: PropTypes.shape({
    code: PropTypes.string,
    slug: PropTypes.string,
  }),
  blocked: PropTypes.bool,
  classes: PropTypes.shape({}).isRequired,
  icon: PropTypes.func.isRequired,
  onAddClick: PropTypes.func,
  onAddLabel: PropTypes.string,
  onAffiliationClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  onDeleteLabel: PropTypes.string,
  onEditClick: PropTypes.func,
  onEditLabel: PropTypes.string,
  onPreviewClick: PropTypes.func,
  onPreviewLabel: PropTypes.string,
  onStatsClick: PropTypes.func,
  onStopSellClick: PropTypes.func,
  onStopSellLabel: PropTypes.string,
  onViewClick: PropTypes.func,
  onViewLabel: PropTypes.string,
  primary: PropTypes.string.isRequired,
  published: PropTypes.bool,
  secondary: PropTypes.string,
};

HomeListItem.defaultProps = {
  affiliation: null,
  blocked: false,
  onAddClick: null,
  onAddLabel: null,
  onAffiliationClick: null,
  onDeleteClick: null,
  onDeleteLabel: null,
  onEditClick: null,
  onEditLabel: null,
  onPreviewClick: null,
  onPreviewLabel: null,
  onStatsClick: null,
  onStopSellClick: null,
  onStopSellLabel: null,
  onViewClick: null,
  onViewLabel: null,
  published: false,
  secondary: null,
};

export default withStyles(styles)(HomeListItem);
