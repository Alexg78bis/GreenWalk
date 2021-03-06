import { Component, Input } from '@angular/core'
import { GreenWalkLightInterface } from '../../interfaces/green-walk-light.interface'
import { MapService } from '../../services/map/map.service'

@Component({
	selector: 'app-green-walk-card',
	templateUrl: './green-walk-card.component.html',
	styleUrls: ['./green-walk-card.component.scss'],
})
export class GreenWalkCardComponent {
	@Input() greenWalk: GreenWalkLightInterface

	constructor (public mapService: MapService) {}
}
