import { Component, OnInit } from '@angular/core'
import { GreenWalkInterface } from '../../../interfaces/green-walk.interface'
import { MapService } from '../../../services/map/map.service'
import { ActivatedRoute } from '@angular/router'
import { LoadingController, NavController, Platform, ToastController, } from '@ionic/angular'
import { GreenWalkRequest } from '../../../requests/green-walk.request'
import { LocalService } from '../../../services/local/local.service'
import * as Moment from 'moment'
import { Request } from '../../../requests/request'

@Component({
	selector: 'app-green-walk',
	templateUrl: './green-walk.page.html',
	styleUrls: ['./green-walk.page.scss'],
})
export class GreenWalkPage implements OnInit {

	greenWalk: GreenWalkInterface

	state = {
		isRegister: false,
		isPast: false,
		canDelete: false,
	}

	map = {
		url: null,
		loaded: false,
	}

	constructor (
		private mapService: MapService,
		private activatedRoute: ActivatedRoute,
		private loadingController: LoadingController,
		private platform: Platform,
		private greenWalkRequest: GreenWalkRequest,
		private toastController: ToastController,
		public navController: NavController,
	) { }

	// Get the GreenWalk detail
	// if the GreenWalk id passed in the url is not valid => redirect to the GreenWalk list
	async ngOnInit () {
		const id = this.activatedRoute.snapshot.paramMap.get('id')

		this.greenWalkRequest.getOneById(id).then(
			greenWalk => {
				this.greenWalk = greenWalk

				const user = LocalService.user
				this.state.isRegister = greenWalk.participants.filter(
					participant => user.id === participant.id,
				).length !== 0

				this.state.isPast = Moment(greenWalk.datetime).isBefore(Moment())
				this.state.canDelete = this.canDelete(greenWalk)

			}).catch(() => {
				this.navController.navigateRoot(['/'])
			},
		)
	}

	// Check if the user already participate to the GreenWalk
	// if already => unsubscribe
	// else => show disclaimers popup then send subcribe request
	async registerAndUnregisterToGreenWalk () {
		try {
			// check if user already register to that grenwalk
			await this.greenWalkRequest.registerUnregister(
				this.greenWalk.id,
				this.state.isRegister,
			)

			if (this.state.isRegister) {
				this.greenWalk.participants = this.greenWalk.participants.filter(
					participant => LocalService.user.id !== participant.id)
			} else {
				this.greenWalk.participants.push(LocalService.user)
				const toast = await this.toastController.create({
					message: 'Attention ! L\'équipe Green Walk vous conseille la plus grande prudence lors des sorties. En effet, nous ne garantissons pas le bon déroulement de celles-ci.',
					position: 'top',
					buttons: [
						{
							text: 'ok'
						}
					],
				})

				await toast.present()
			}
			this.state.isRegister = !this.state.isRegister
		} catch (e) {
			await Request.HandleError(e, this.toastController, this.navController)
		}
	}

	// Get the map picture with the correct size
	getMap (): string {
		if (!this.greenWalk) {
			return ''
		}

		const element = document.getElementById('map')

		if (element.offsetWidth === 0 || element.offsetHeight === 0) {
			return ''
		}

		const width = element.offsetWidth > 0 && element.offsetWidth < 1280
			? element.offsetWidth
			: 1280
		const height = element.offsetHeight > 0 && element.offsetHeight < 1280
			? element.offsetHeight
			: 1280
		this.map.url = this.mapService.getMap(this.greenWalk.location.coordinates,
			{ width, height, zoom: 13 })
		return this.map.url
	}

	// Open the integrated map app with correct coordinates
	openMapsApp () {
		if (this.platform.is('android')) {
			window.location.href = 'geo:' +
				this.greenWalk.location.coordinates.latitude + ',' +
				this.greenWalk.location.coordinates.longitude
		} else {
			window.location.href = 'maps://maps.apple.com/?q=' +
				this.greenWalk.location.coordinates.latitude + ',' +
				this.greenWalk.location.coordinates.longitude
		}
	}

	// check if the user can delete the GreenWalk
	canDelete (greenwalk: GreenWalkInterface): boolean {
		return (greenwalk.author.id === LocalService.user.id) ||
			LocalService.user.roles.indexOf('ROLE_ADMIN') > -1
	}

	// send the delete request then redirect to the GreenWalk list
	async delete () {
		try {
			await this.greenWalkRequest.delete(this.greenWalk.id)
			await this.navController.navigateRoot('/')
		} catch (e) {
			await Request.HandleError(e, this.toastController, this.navController)
		}

	}

}
