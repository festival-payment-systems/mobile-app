import {Chip, Typography} from "@mui/material";
import { MotionPaper } from "./../Motion.tsx";
import type {IEvent} from "../../types/Event.ts";
import {getMillisFromDateString} from "../../utils/DateTimeUtils.ts";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";
import {getStatusProps} from "../../utils/EventUtils.ts";


interface Props {
  event: IEvent,
  index: number,
}

function EventCard({ event, index }: Props) {

  const nav = useNavigate()
  const { t } = useTranslation()
  const startDate = event.startingAt ? getMillisFromDateString(event.startingAt) : Date.parse(event.timestamps.createdAt)
  const endDate = event.endingAt ? getMillisFromDateString(event.endingAt) : undefined
  const { color } = getStatusProps(event.status)

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
      onClick={() => nav(`/event/${event.id}/dashboard`)}
    >
      <Chip
        label={t(event.status.toLowerCase())}
        size="small"
        color={color}
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          fontWeight: 'bold',
          borderRadius: 1,
        }}
      />

      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: -1 }}>
        {event.name}
      </Typography>

      {endDate && (
        <Typography variant="caption" sx={{ opacity: 0.5 }}>
          {`${new Date(startDate).toDateString()} - ${new Date(endDate).toDateString()}`}
        </Typography>
      )}

      {event.status !== 'UPCOMING' && (
        <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
          {t('total revenue')}: {0} €
        </Typography>
      )}
    </MotionPaper>
  )
}

export default EventCard;