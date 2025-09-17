import { Meeting } from "../models/meeting.model";
import { MeetingService } from "../services/meeting.service";
import { PersonService } from "../services/person.service";

export class Scheduler {
  private personService: PersonService;
  private meetingService: MeetingService;
  constructor() {
    this.personService = new PersonService();
    this.meetingService = new MeetingService(this.personService);
  }

  createPerson(name: string, email: string): void {
    this.personService.createPerson(name, email);
  }

  getPersonByEmail(email: string): string | undefined {
    return this.personService.getPersonByEmail(email);
  }

  getAllEmailIds(): string[] {
    return this.personService.getAllEmailIds();
  }

  createMeeting(title: string, startTime: Date, participantEmails: string[]) {
    this.meetingService.createMeeting(title, startTime, participantEmails);
  }

  getAllMeetings(): Meeting[] {
    return this.meetingService.getAllMeetings();
  }

  getUpcomingMeetings(email: string): Meeting[] | undefined {
    return this.meetingService.getUpcomingMeetings(email);
  }

  getAvailableSlots(
    participantEmails: string[],
    startTime: Date,
    endTime: Date
  ) {
    return this.meetingService.getAvailableSlots(
      startTime,
      endTime,
      participantEmails
    );
  }
}
