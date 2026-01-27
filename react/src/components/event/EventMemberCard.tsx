import type {IEventMember} from "../../types/Event.ts";
import {Box, Card, Chip, Typography} from "@mui/material";
import {useQuery} from "@tanstack/react-query";
import {api} from "../../services/api.service.ts";
import {useEffect, useState} from "react";
import {dateToString, getMillisFromDateString} from "../../utils/DateTimeUtils.ts";
import type {User} from "../../types/User.ts";
import {useTranslation} from "react-i18next";
import {getRoleProps, isCustomer, sortByRole} from "../../utils/ProfileUtils.ts";

interface Props {
  member: IEventMember,
}

function EventMemberCard({ member }: Props) {

  const { t } = useTranslation()
  const createdDate = new Date(member.timestamps.createdAt)
  const isGuest = isCustomer(member)
  const highestRole = member.roles.sort(sortByRole)[0]

  const UserQuery = useQuery({
    queryKey: ['user-profile', member.userId],
    queryFn: async () => (await api.get<User>(`users/profile?id=${member.userId}`)).data,
    enabled: !isGuest,
  })

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', p: 1, gap: 0.5, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography>
          {UserQuery.isSuccess ? `${UserQuery.data.firstName} ${UserQuery.data.lastName}` : member.id}
        </Typography>

        <Chip
          label={t(highestRole.toLowerCase())}
          size="small"
          color={getRoleProps(highestRole).color}
          sx={{
            fontWeight: 'bold',
            borderRadius: 1,
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant={'subtitle2'} color={'textDisabled'}>
          {`Registered at ${createdDate.getHours()}:${createdDate.getMinutes()} • ${createdDate.toDateString()}`}
        </Typography>
      </Box>
    </Card>
  );
}

export default EventMemberCard;