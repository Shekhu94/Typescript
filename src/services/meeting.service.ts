import { Meeting } from "../models/meeting.model";
import { TimeSlot } from "../models/timeSlot.model";
import { PersonService } from "./person.service";

export class MeetingService {
  private meetings = new Map<string, Meeting>();
  private personMeetings = new Map<string, string[]>();

  private static readonly DURARION_IN_MS = 60 * 60 * 1000;

  constructor(private personService: PersonService) {}

  private validateInputs(
    title: string,
    startTime: Date,
    participantEmails: string[]
  ) {
    if (!title) {
      throw new Error("Title is missing");
    }

    if (!startTime || !(startTime instanceof Date)) {
      throw new Error("Start time is invalid");
    }

    if (participantEmails.length < 1) {
      throw new Error("Minimum two participants are required");
    }

    const uniqueEmails = new Set(participantEmails);
    if (uniqueEmails.size != participantEmails.length) {
      throw new Error("Duplicate emails are not allowed");
    }
  }

  private validateParticipants(participantEmails: string[]) {
    return this.personService.findAndGetPersons(participantEmails);
  }

  private setOrUpdatePersonMeetings(meeting: Meeting) {
    for (let participantEmail of meeting.participantEmails) {
      if (!this.personMeetings.has(participantEmail)) {
        this.personMeetings.set(participantEmail, []);
      }
      this.personMeetings.get(participantEmail)?.push(meeting.id);
    }
  }
  private getAllPossibleSlots(startTime: Date, endTime: Date): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const currentTime = new Date(startTime);

    if (currentTime.getMinutes() !== 0) {
      currentTime.setHours(currentTime.getHours() + 1, 0, 0, 0);
    }

    while (currentTime < endTime) {
      const slotStart = new Date(currentTime);
      const slotEnd = new Date(
        currentTime.getTime() + MeetingService.DURARION_IN_MS
      );
      if (slotEnd <= endTime) {
        slots.push({ startTime: slotStart, endTime: slotEnd });
      }

      currentTime.setHours(currentTime.getHours() + 1);
    }

    return slots;
  }
  private hasConflict(email: string, startTime: Date): boolean {
    const meetingIds = this.personMeetings.get(email);
    const totalMeetingIds = meetingIds?.map((id) => this.meetings.get(id));
    return (
      totalMeetingIds?.some((meeting) => meeting?.startTime === startTime) ??
      false
    );
  }
  createMeeting(title: string, startTime: Date, participantEmails: string[]) {
    // validate title and the start and end time
    this.validateInputs(title, startTime, participantEmails);

    // validate the participants exist or not

    this.validateParticipants(participantEmails);

    // validate the availability of all the participants
    this.validateAvailabilityOfAllParticipants(participantEmails, startTime);

    // create meeting
    const endTime = new Date(
      startTime.getTime() + MeetingService.DURARION_IN_MS
    );
    const id = crypto.randomUUID();
    const meeting: Meeting = {
      id,
      title,
      startTime,
      endTime,
      participantEmails,
    };

    this.meetings.set(id, meeting);
    this.setOrUpdatePersonMeetings(meeting);
  }

  getAllMeetings(): Meeting[] {
    return Array.from(this.meetings.values());
  }
  validateAvailabilityOfAllParticipants(
    participantEmails: string[],
    startTime: Date
  ) {
    for (const email of participantEmails) {
      if (this.hasConflict(email, startTime)) {
        throw new Error(
          `Person with email id : ${email} has conflict for this meeting at ${startTime}`
        );
      }
    }
  }

  getUpcomingMeetings(email: string) {
    const meetingIds = this.personMeetings.get(email);
    const totalMeetingIds = meetingIds
      ?.map((id) => this.meetings.get(id))
      .filter((meeting) => meeting !== undefined);
    const now = new Date();
    return totalMeetingIds
      ?.filter((id) => id?.startTime! >= now)
      .sort((a, b) => {
        return a.startTime.getTime() - b.startTime.getTime();
      });
  }

  getAvailableSlots(
    startTime: Date,
    endTime: Date,
    participantEmails: string[]
  ): TimeSlot[] {
    //validate email ids exist or not

    this.personService.findAndGetPersons(participantEmails);

    // find all the possible slots between startTime & endTime

    const allSlots = this.getAllPossibleSlots(startTime, endTime);

    // finding non conflicting slots
    allSlots.filter((slot) => {
      return participantEmails.every((email) => {
        return !this.hasConflict(email, slot.startTime);
      });
    });

    return allSlots;
  }
}
