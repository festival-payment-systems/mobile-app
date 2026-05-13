import {Dialog, DialogContent, DialogTitle, Grid, TextField} from "@mui/material";
import {useTranslation} from "react-i18next";

interface Props {
  open: boolean
  onClose: () => void,
}

function ShopCreation({open, onClose}: Props) {

  const { t } = useTranslation()

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={'sm'} disableRestoreFocus>
      <DialogTitle>{t('create shop')}</DialogTitle>

      <DialogContent>
        <Grid container>
          <Grid size={12}>
            <TextField
              label={t('shop name')} fullWidth disabled margin='normal'
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default ShopCreation;
