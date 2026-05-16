import type {IShop} from "../../types/Shop.ts";
import {Chip, Typography} from "@mui/material";
import {MotionPaper} from "../Motion.tsx";
import {useNavigate} from "react-router";
import {useTranslation} from "react-i18next";


interface Props {
  shop: IShop,
  index: number,
}

function ShopCard({ shop, index }: Props) {

  const nav = useNavigate()
  const { t } = useTranslation()

  return (
    <MotionPaper
      elevation={3}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        '&:hover': {
          scale: 1.01,
        },
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={() => nav(`/event/${shop.id}/dashboard`)}
    >
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: -1 }}>
        {shop.name}
      </Typography>

      <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
        {t('total revenue')}: {0} €
      </Typography>
    </MotionPaper>
  )
}

export default ShopCard;