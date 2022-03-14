import EventEmitter from "events";
import { Person } from "./Person";

export type Message = {
	secret: string,
	recipient: string
}

export class World {
	persons: Person[] = [];
	private worldEmitter = new EventEmitter();
	private messageBus: Message[] = [];

	constructor(persons: Person[]) {
		persons.forEach(person => {
			person.setGossipEmitter(this.worldEmitter);
		});
		this.persons = persons;
		this.worldEmitter.on("talk", (secret: string, id: string) => {
			console.log(`Some1 is talking to ${id} the secret ${secret}`);
			this.messageBus.push({
				secret,
				recipient: id
			});
		});
	}

	emitGossip(): void {
		console.log(`Sending propagation`);
		this.worldEmitter.emit("propagate");
		console.log(`Propagation sent, bus is ${this.messageBus.length}`);
		this.messageBus.forEach(({secret, recipient}) => {
			console.log(`Sending hear to ${recipient} the secret ${secret}`);
			this.worldEmitter.emit("hear", {secret, recipient});
		});
	}

	ask(id: string): string {
		const person: Person = this.persons.find(person => person.id === id);
		if (person) {
			return person.getSecret();
		}
		throw new Error(`Person with id ${id} not found`);
	}
}
