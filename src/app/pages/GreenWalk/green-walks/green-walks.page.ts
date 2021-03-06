import { Component, OnInit } from '@angular/core'
import { GreenWalkLightInterface } from '../../../interfaces/green-walk-light.interface'
import { GreenWalkRequest } from '../../../requests/green-walk.request'
import { GeolocationService } from '../../../services/geolocation/geolocation.service'
import { ModalController, NavController, ToastController } from '@ionic/angular'
import { LocationModalComponent } from '../../../components/location-modal/location-modal.component'
import { Request } from '../../../requests/request'
import { CoordinatesInterface } from '../../../interfaces/coordinates.Interface'

@Component({
	selector: 'app-green-walks',
	templateUrl: './green-walks.page.html',
	styleUrls: ['./green-walks.page.scss'],
})
export class GreenWalksPage implements OnInit {

	state = {
		loading: false,
		coordinates: { longitude: 0, latitude: 0 }
	}

	greenWalks: GreenWalkLightInterface[] = []

	constructor (
		private greenWalkRequestService: GreenWalkRequest,
		private geolocationService: GeolocationService,
		private modalController: ModalController,
		private toastController: ToastController,
		private navController: NavController
	) {}

	// Check the user location. If not available => open the modal location
	async ngOnInit () {
		this.state.loading = true
		try {
			this.state.coordinates = (await this.geolocationService.getLastLocation()).coordinates
			await this.init(this.state.coordinates)

		} catch (e) {
			await this.chooseLocation()
		}
	}

	// refresh the GreenWalks list
	ionViewWillEnter () {
		this.init(this.state.coordinates)
	}

	// Open the the modal location to let the user change his location
	async chooseLocation () {
		const modal = await this.modalController.create({
			component: LocationModalComponent,
			backdropDismiss: false,
			componentProps: {
				coordinates: {
					latitude: 48.856886091827164,
					longitude: 2.341345178964275,
				},
			},
		})
		await modal.present()
		const { data: coordinates } = await modal.onWillDismiss()
		await this.geolocationService.setLocation(coordinates)
		await this.init(coordinates)
	}

	// Load the GreenWalk list
	async init (coordinates: CoordinatesInterface, event = null) {
		try {
			this.state.loading = true
			this.greenWalks = await this.greenWalkRequestService.getAll(coordinates)
			this.state.loading = false
		} catch (e) {
			await Request.HandleError(e, this.toastController, this.navController)
		} finally {
			if (event) {
				event.target.complete()
			}
		}
	}

}
