export interface Meeting {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  participantEmails: string[];
}
