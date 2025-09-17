export class PersonService {
  private person = new Map<string, string>();

  createPerson(name: string, email: string): void {
    const correctedEmail = email.toLowerCase().trim();
    if (this.person.has(correctedEmail)) {
      throw new Error(`Person with email id ${correctedEmail} already exists`);
    }

    this.person.set(correctedEmail, name);
  }

  getPersonByEmail(email: string): string | undefined {
    return this.person.get(email.toLowerCase().trim());
  }

  getAllEmailIds() {
    return Array.from(this.person.keys());
  }

  findAndGetPersons(emails: string[]): string[] {
    const names: string[] = [];
    for (const email of emails) {
      const name = this.getPersonByEmail(email.toLowerCase().trim());
      if (!name) {
        throw new Error(`Person with email id ${email} does not exist`);
      }
      names.push(name);
    }
    return names;
  }
}
