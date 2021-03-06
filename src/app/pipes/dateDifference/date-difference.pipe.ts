import { Pipe, PipeTransform } from '@angular/core'
import * as Moment from 'moment'

@Pipe({
	name: 'dateDifference'
})
export class DateDifferencePipe implements PipeTransform {

	// transform a string date into a readable date
	transform (date: string, withDay: boolean = true, withHours: boolean = false, realDate: boolean = true, ...args: any[]): string {

		if (realDate && Moment().diff(date, 'days') <= -6) {
			return Moment().locale('Fr').to(date)
		}

		let format = ''

		if (withDay) {
			format += 'dddd D MMMM '
		}
		if (withHours) {
			format += 'à HH:mm '
		}

		if (format) {
			return Moment(date).locale('Fr').format(format)
		}

		return Moment(date).locale('Fr').format('DD/MM/YYYY')

	}

}