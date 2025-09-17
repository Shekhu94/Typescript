import { Scheduler } from "./controllers/scheduler.controller";

function Main() {
  try {
    const scheduler = new Scheduler();
    /******* Persons ********/
    // create few persons

    scheduler.createPerson("Ricky Ponting", "ricky.ponting@xmail.com");
    scheduler.createPerson("Adam Gilchrist", "adam.gilchrist@xmail.com");

    // get a person
    console.log("Person name is: ");
    console.log(scheduler.getPersonByEmail("ricky.ponting@xmail.com"));

    // get all email ids
    const allEmailIds = scheduler.getAllEmailIds();
    console.log("All emails:");
    console.log(allEmailIds);

    /******* Meetings ********/

    // create a meeting for now
    scheduler.createMeeting("Kt session", new Date(), allEmailIds);

    // create a meeting for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    scheduler.createMeeting("Code workshop", tomorrow, allEmailIds);

    // get all meetings
    const allMeetings = scheduler.getAllMeetings();
    console.log("All meetings:");
    console.log(allMeetings);

    // get upcoming meetings
    console.log("Upcoming meetings for Ricky Ponting:");
    console.log(scheduler.getUpcomingMeetings("ricky.ponting@xmail.com"));

    // get available slots for a group pf persons
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 2);

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 3);

    console.log("Available slots for Ricky Ponting & Adam Gilchrist");
    console.log(scheduler.getAvailableSlots(allEmailIds, startDate, endDate));
  } catch (error) {
    console.log(`Exception occured: ${error}`);
  }
}

Main();
