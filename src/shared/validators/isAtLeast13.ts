import {
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isAtLeast13', async: false })
export class IsAtLeast13Constraint implements ValidatorConstraintInterface {
	validate(value: Date) {
		const today = new Date();
		const thirteenYearsAgo = new Date(
			today.getFullYear() - 13,
			today.getMonth(),
			today.getDate(),
		);

		return value <= thirteenYearsAgo;
	}
}
