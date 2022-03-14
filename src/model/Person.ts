import EventEmitter from "events";
import { Message } from "./World";

interface Friend {
	person: Person;
	secretTold: boolean;
}


export class Person extends EventEmitter {
	id = Math.random().toString(36).substr(2, 9);
	worldEmitter: EventEmitter;

	constructor(private secret: string = null, private friends: Friend[] = []) {
		super();
	}

	talksWith(friend: Person): void {
		this.friends.push({
			person: friend,
			secretTold: false
		});
	}

	hearSecret(secret: string): void {
		console.log(`${this.id} heard ${secret}`);
		this.secret = secret;
	}

	tellSecret(): void {
		if (this.secret) {
			console.log(`${this.id} told ${this.secret}`);
			const friendToTellSecretTo = this.friends.find(friend => !friend.secretTold);
			if(friendToTellSecretTo) {
				this.worldEmitter.emit("talk", this.secret, friendToTellSecretTo.person.id);
				friendToTellSecretTo.secretTold = true;
			}
			if(this.friends.every(friend => friend.secretTold)) {
				this.secret = null;
			}
		} else {
			console.log(`${this.id} had no secret to share`);
		}
	}

	setGossipEmitter(worldEmitter: EventEmitter): void {
		this.worldEmitter = worldEmitter;
		this.worldEmitter.on("propagate", () => {
			this.tellSecret();
		});
		this.worldEmitter.on("hear", ({secret, recipient}: Message) => {
			console.log(`Hearing ${secret} for ${recipient}`);
			if(recipient === this.id) {
				this.hearSecret(secret);
			}
		});
	}

	getSecret(): string {
		return this.secret;
	}

}
