import { Person } from "../src/model/Person";
import { World } from "../src/model/World";

describe('World behaviour', () => {
	it('Person without friends should forget the secret', () => {
		const person = new Person('secret');

		const world = new World([person]);
		expect(world.ask(person.id)).toBe('secret');

		world.emitGossip();

		expect(world.ask(person.id)).toBeNull();
	});
	describe('Two personas, one speaks w/ the other, one secret', () => {
		it('Person should tell the message to person1 and forget the secret', () => {
			const person = new Person('secret');
			const person1 = new Person();
			person.talksWith(person1);
			const world = new World([person, person1]);
			world.emitGossip();
			expect(world.ask(person.id)).toBeNull();
			expect(world.ask(person1.id)).toBe('secret');
		});
	});
	describe('Three personas, one speaks w/ the others', () => {
		it('Person should tell the message to person1 and not person2 and keep the secret', () => {
			const person = new Person('secret');
			const person1 = new Person();
			const person2 = new Person();

			person.talksWith(person1);
			person.talksWith(person2);

			const world = new World([person, person1, person2]);
			world.emitGossip();

			expect(world.ask(person.id)).toBe('secret');
			expect(world.ask(person1.id)).toBe('secret');
			expect(world.ask(person2.id)).toBeNull();
		});

		it('Person should tell the message to person1 and then person2 and forget the secret', () => {
			const person = new Person('secret');
			const person1 = new Person();
			const person2 = new Person();

			person.talksWith(person1);
			person.talksWith(person2);

			const world = new World([person, person1, person2]);
			world.emitGossip();
			world.emitGossip();

			expect(world.ask(person.id)).toBeNull();
			expect(world.ask(person2.id)).toBe('secret');
		});
	});
});
