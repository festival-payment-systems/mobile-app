import type {IEventMember} from "../../types/Event.ts";
import {Card} from "@mui/material";

interface Props {
  member: IEventMember,
}

function EventMemberCard({ member }: Props) {
  return (
    <Card>
      {member.userId}
    </Card>
  );
}

export default EventMemberCard;