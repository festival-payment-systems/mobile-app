import type {IEvent} from "../../types/Event.ts";
import {Container, Tooltip, Typography, useMediaQuery, useTheme} from "@mui/material";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {setRouteTitle} from "../../hooks/Navigation.ts";
import {MotionFab} from "../../components/Motion.tsx";
import AddIcon from "@mui/icons-material/Add";
import ShopCreation from "../../components/event/ShopCreation.tsx";

interface Props {
  event: IEvent,
}

function EventShops({ event }: Props) {

  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [shopCreation, setShopCreation] = useState<boolean>(false)

  useEffect(() => {
    setRouteTitle(t('shops'))
  }, []);

  return (
    <Container maxWidth={'md'}>
      <Typography variant={'h2'} component={'h1'}>
        {t('shops')}: {event.shopIds?.length ?? 0}
      </Typography>

      <Tooltip title={t('create shop')} arrow placement={'auto'}>
        <MotionFab
          color="primary"
          aria-label={t('create shop')}
          sx={{
            position: 'fixed',
            bottom: isMobile ? 20 : 40,
            right: isMobile ? 20 : 40,
            width: isMobile ? 56 : 70,
            height: isMobile ? 56 : 70,
          }}
          initial={{scale: 0}}
          animate={{scale: 1}}
          transition={{type: 'spring', stiffness: 260, damping: 20, delay: 0.5}}
          onClick={() => setShopCreation(true)}
        >
          <AddIcon fontSize={isMobile ? 'medium' : 'large'}/>
        </MotionFab>
      </Tooltip>

      <ShopCreation open={shopCreation} onClose={() => setShopCreation(false)} />
    </Container>
  );
}

export default EventShops;
